from rest_framework import viewsets
from rest_framework.permissions import IsAuthenticated
from .models import Equipment, ConditionPhoto
from .serializers import EquipmentSerializer, ConditionPhotoSerializer


class EquipmentViewSet(viewsets.ModelViewSet):
    queryset = Equipment.objects.all()
    serializer_class = EquipmentSerializer
    permission_classes = [IsAuthenticated]

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