from rest_framework import serializers
from api.models import Equipment, ConditionPhoto


class EquipmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Equipment
        fields = ['id', 'name', 'notes']


class ConditionPhotoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ConditionPhoto
        fields = ['id', 'image', 'contract_identifier', 'timestamp', 'photo_location', 'equipment', 'notes', 'photo_type']
