from django.db import transaction
from rest_framework.permissions import AllowAny
from rest_framework.authtoken.models import Token
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework import status
from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Equipment, ConditionPhoto, DamageReport
from .serializers import (
    EquipmentSerializer,
    ConditionPhotoSerializer,
    DamageReportSerializer,
)


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

        # Photo mapping: form field name -> (photo_location, photo_type)
        photo_mapping = {
            "front_view_photo": ("FRONT_VIEW", "AFTER"),
            "rear_view_photo": ("REAR_VIEW", "AFTER"),
            "left_view_photo": ("LEFT_SIDE", "AFTER"),
            "right_view_photo": ("RIGHT_SIDE", "AFTER"),
            "hookup_view_photo": ("HOOKUP", "BEFORE"),
        }

        created_photos = []
        created_reports = []

        # Use transaction to ensure all-or-nothing
        with transaction.atomic():
            # 1. Create condition photos
            for field_name, (location, photo_type) in photo_mapping.items():
                photo_file = request.FILES.get(field_name)
                if photo_file:
                    photo = ConditionPhoto.objects.create(
                        photo=photo_file,
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
                photo_file = request.FILES.get(f"damage_report_{i}_photo")

                if damage_type:  # Only create if type is provided
                    report = DamageReport.objects.create(
                        equipment=equipment,
                        damage_type=damage_type,
                        damage_location=damage_location,
                        notes=notes,
                        photo=photo_file,
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
        Standalone endpoint for submitting damage reports without condition photos.
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
                {"error": "Equipment not found"}, status=status.HTTP_404_NOT_FOUND
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
                photo_file = request.FILES.get(f"damage_report_{i}_photo")

                if damage_type:  # Only create if type is provided
                    report = DamageReport.objects.create(
                        equipment=equipment,
                        damage_type=damage_type,
                        damage_location=damage_location,
                        notes=notes,
                        photo=photo_file,
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


@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
   
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(username=username, password=password)

        if user:
            token, _ = Token.objects.get_or_create(user=user)
            return Response({'token': token.key}, status=status.HTTP_200_OK)

        return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)