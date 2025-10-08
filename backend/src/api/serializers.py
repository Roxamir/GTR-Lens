from rest_framework import serializers
from api.models import Equipment, ConditionPhoto, DamageReport


class EquipmentSerializer(serializers.ModelSerializer):
    damage_report_count = serializers.SerializerMethodField()

    def get_damage_report_count(self, obj):
        return obj.damage_reports.count()

    class Meta:
        model = Equipment
        fields = ['id', 'name', 'notes', 'damage_report_count']


class ConditionPhotoSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer(read_only=True)

    class Meta:
        model = ConditionPhoto
        fields = ['id', 'image', 'contract_identifier', 'timestamp', 'photo_location', 'equipment', 'notes', 'photo_type']

class DamageReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = DamageReport
        fields = ['id', 'equipment', 'damage_type', 'notes', 'photo', 'reported_at', 'reported_by']
        read_only_fields = ['reported_at', 'reported_by']
