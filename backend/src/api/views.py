import boto3
import uuid


from django.db import transaction
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from .models import Equipment, ConditionPhoto, DamageReport
from .serializers import (
    EquipmentSerializer,
    ConditionPhotoSerializer,
    DamageReportSerializer,
)


class GeneratePresignedURLView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        file_name = request.data.get("file_name")
        file_type = request.data.get("file_type")

        if not file_name:
            return Response({"error": "file_name is required"}, status=400)

        # Determine the upload path
        if file_type == "condition":
            upload_path = "uploads/condition_photos/"
        elif file_type == "damage":
            upload_path = "uploads/damage_photos/"
        else:
            upload_path = "uploads/other/"

        # Generate a unique key for S3
        file_key = f"{upload_path}{uuid.uuid4()}-{file_name}"

        try:
            # Initialize the S3 client
            s3_client = boto3.client(
                "s3",
                region_name="us-west-1",
                aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
                aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
            )

            response = s3_client.generate_presigned_post(
                Bucket=settings.AWS_STORAGE_BUCKET_NAME, Key=file_key, ExpiresIn=600
            )

            return Response(response)

        except Exception as e:
            return Response({"error": str(e)}, status=500)


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all().order_by("name")
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=["get"])
    def latest_photos(self, request, pk=None):
        """
        Returns the most recent set of 'AFTER' photos for a piece of equipment.
        """
        # Get the specific equipment object
        equipment = self.get_object()

        latest_contract_id = equipment.get_latest_contract_identifier()

        if not latest_contract_id:
            return Response([])

        # Find all 'AFTER' photos that share that same contract identifier
        photos_for_contract = ConditionPhoto.objects.filter(
            equipment=equipment,
            photo_type="AFTER",
            contract_identifier=latest_contract_id,
        ).order_by("photo_location")

        # Serialize the data and return it as a JSON response
        serializer = ConditionPhotoSerializer(photos_for_contract, many=True)
        return Response(serializer.data)


class ConditionPhotoViewSet(viewsets.ModelViewSet):
    queryset = ConditionPhoto.objects.all().order_by("-timestamp")
    serializer_class = ConditionPhotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        queryset = super().get_queryset()

        # Get optional query parameters
        equipment_id = self.request.query_params.get("equipment_id")
        contract_id = self.request.query_params.get("contract_identifier")
        photo_location = self.request.query_params.get("photo_location")

        # Apply any filters.
        if equipment_id:
            queryset = queryset.filter(equipment__id=equipment_id)
        if contract_id:
            queryset = queryset.filter(contract_identifier__icontains=contract_id)
        if photo_location:
            queryset = queryset.filter(photo_location__iexact=photo_location)

        return queryset

    @action(detail=False, methods=["post"])
    def bulk_upload(self, request):
        """
        Custom endpoint to handle condition photos + damage reports in one submission.

        This view is refactored to handle BOTH S3 keys (from production)
        and raw file uploads (from development).
        """
        equipment_id = request.data.get("equipment")
        contract_id = request.data.get("contract_identifier")

        if not equipment_id or not contract_id:
            return Response(
                {"error": "Equipment and contract_identifier are required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            equipment = Equipment.objects.get(id=equipment_id)
        except Equipment.DoesNotExist:
            return Response(
                {"error": "Equipment not found"}, status=status.HTTP_404_NOT_FOUND
            )

        # Photo mapping: form field name (from React) -> (photo_location, photo_type)
        key_mapping = {
            "front_view_key": ("FRONT_VIEW", "AFTER"),
            "rear_view_key": ("REAR_VIEW", "AFTER"),
            "left_view_key": ("LEFT_SIDE", "AFTER"),
            "right_view_key": ("RIGHT_SIDE", "AFTER"),
            "hookup_view_key": ("HOOKUP", "BEFORE"),
        }

        created_photos = []
        created_reports = []

        # Use transaction to ensure all-or-nothing
        with transaction.atomic():
            # 1. Create condition photos
            for key_name, (location, photo_type) in key_mapping.items():

                # Check for S3 key (prod) OR raw file (dev)
                s3_key = request.POST.get(key_name)
                file_upload = request.FILES.get(
                    key_name.replace("_key", "")
                )  # e.g., "front_view"

                photo_to_save = None
                if s3_key:
                    photo_to_save = s3_key  # Save the S3 key string
                elif file_upload:
                    photo_to_save = file_upload  # Save the actual file

                if photo_to_save:
                    photo = ConditionPhoto.objects.create(
                        photo=photo_to_save,
                        contract_identifier=contract_id,
                        photo_location=location,
                        photo_type=photo_type,
                        equipment=equipment,
                        uploaded_by=request.user,
                    )
                    created_photos.append(photo)

            # 2. Create damage reports
            damage_count = int(request.data.get("damage_report_count", 0))
            for i in range(damage_count):
                damage_type = request.data.get(f"damage_report_{i}_type")
                damage_location = request.data.get(f"damage_report_{i}_location")
                notes = request.data.get(f"damage_report_{i}_notes", "")

                # Check for S3 key (prod) OR raw file (dev)
                s3_key = request.POST.get(f"damage_report_{i}_photo_key")
                file_upload = request.FILES.get(f"damage_report_{i}_photo")

                photo_to_save = None
                if s3_key:
                    photo_to_save = s3_key
                elif file_upload:
                    photo_to_save = file_upload

                if damage_type:  # Only create if type is provided
                    report = DamageReport.objects.create(
                        equipment=equipment,
                        damage_type=damage_type,
                        damage_location=damage_location,
                        notes=notes,
                        photo=photo_to_save,
                        reported_by=request.user,
                    )
                    created_reports.append(report)

        return Response(
            {
                "message": "Upload successful",
                "photos_created": len(created_photos),
                "damage_reports_created": len(created_reports),
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["post"])
    def submit_damage_reports(self, request):
        """
        Standalone endpoint for submitting damage reports.
        Refactored to handle S3 keys (prod) or raw files (dev).
        """
        equipment_id = request.data.get("equipment")

        if not equipment_id:
            return Response(
                {"error": "Equipment is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            equipment = Equipment.objects.get(id=equipment_id)
        except Equipment.DoesNotExist:
            return Response(
                {"error": "Equipment not found"}, status=status.HTTP_440_NOT_FOUND
            )

        created_reports = []
        damage_count = int(request.data.get("damage_report_count", 0))

        if damage_count == 0:
            return Response(
                {"error": "At least one damage report is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        with transaction.atomic():
            for i in range(damage_count):
                damage_type = request.data.get(f"damage_report_{i}_type")
                damage_location = request.data.get(f"damage_report_{i}_location")
                notes = request.data.get(f"damage_report_{i}_notes", "")

                # Check for S3 key (prod) OR raw file (dev)
                s3_key = request.POST.get(f"damage_report_{i}_photo_key")
                file_upload = request.FILES.get(f"damage_report_{i}_photo")

                photo_to_save = None
                if s3_key:
                    photo_to_save = s3_key
                elif file_upload:
                    photo_to_save = file_upload

                if damage_type:  # Only create if type is provided
                    report = DamageReport.objects.create(
                        equipment=equipment,
                        damage_type=damage_type,
                        damage_location=damage_location,
                        notes=notes,
                        photo=photo_to_save,
                        reported_by=request.user,
                    )
                    created_reports.append(report)

        return Response(
            {
                "message": "Damage reports submitted successfully",
                "damage_reports_created": len(created_reports),
            },
            status=status.HTTP_201_CREATED,
        )


class DamageReportViewSet(viewsets.ModelViewSet):
    queryset = DamageReport.objects.all()
    serializer_class = DamageReportSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        # Automatically set reported_by to current user
        serializer.save(reported_by=self.request.user)


@api_view(["POST"])
@permission_classes([AllowAny])
def user_login(request):

    username = request.data.get("username")
    password = request.data.get("password")

    user = authenticate(username=username, password=password)

    if user:
        token, _ = Token.objects.get_or_create(user=user)
        return Response({"token": token.key}, status=status.HTTP_200_OK)

    return Response(
        {"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED
    )
