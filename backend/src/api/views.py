from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import Equipment, ConditionPhoto
from .serializers import EquipmentSerializer, ConditionPhotoSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]

    @action(detail=True, methods=['get'])
    def latest_photos(self, request, pk=None):
        """
        Returns the most recent set of 'AFTER' photos for a piece of equipment.
        """
        # Get the specific equipment object
        equipment = self.get_object()

        # Find the most recent 'AFTER' photo for this equipment
        latest_after_photo = ConditionPhoto.objects.filter(
            equipment=equipment, 
            photo_type='AFTER'
        ).order_by('-timestamp').first()

        # If no photos were found, return an empty list
        if not latest_after_photo:
            return Response([])

        # Get the contract identifier from that most recent photo
        latest_contract_id = latest_after_photo.contract_identifier

        # Find all 'AFTER' photos that share that same contract identifier
        photos_for_contract = ConditionPhoto.objects.filter(
            equipment=equipment,
            photo_type='AFTER',
            contract_identifier=latest_contract_id
        ).order_by('photo_location')

        # erialize the data and return it as a JSON response
        serializer = ConditionPhotoSerializer(photos_for_contract, many=True)
        return Response(serializer.data)

class ConditionPhotoViewSet(viewsets.ModelViewSet):

    queryset = ConditionPhoto.objects.all()
    serializer_class = ConditionPhotoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        """
        This view can be filtered by `equipment_id` or `contract_identifier`.
        """
        # Start with all photos
        queryset = ConditionPhoto.objects.all()

        # Get optional query parameters from the URL
        equipment_id = self.request.query_params.get('equipment_id')
        contract_id = self.request.query_params.get('contract_identifier')
        photo_location = self.request.query_params.get('photo_location')

        # Apply filters if the parameters are provided
        if equipment_id:
            queryset = queryset.filter(equipment__id=equipment_id)
        
        if contract_id:
            queryset = queryset.filter(contract_identifier__icontains=contract_id)

        if photo_location:
            queryset = queryset.filter(photo_location__iexact=photo_location)
        
        # Finally, order the result
        return queryset.order_by('-timestamp')