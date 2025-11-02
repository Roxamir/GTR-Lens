from rest_framework import serializers
from api.models import Equipment, ConditionPhoto, DamageReport


class DamageReportSerializer(serializers.ModelSerializer):
    reported_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = DamageReport
        fields = [
            "id",
            "damage_type",
            "damage_location",
            "notes",
            "photo",
            "reported_at",
            "reported_by",
        ]
        read_only_fields = ["reported_at"]


class EquipmentSerializer(serializers.ModelSerializer):
    damage_report_count = serializers.SerializerMethodField()
    latest_contract = serializers.SerializerMethodField()
    damage_reports = DamageReportSerializer(many=True, read_only=True)

    def get_damage_report_count(self, obj):
        return obj.damage_reports.count()

    def get_latest_contract(self, obj):
        return obj.get_latest_contract_identifier()

    class Meta:
        model = Equipment
        fields = [
            "id",
            "name",
            "notes",
            "damage_reports",
            "damage_report_count",
            "latest_contract",
        ]


class ConditionPhotoSerializer(serializers.ModelSerializer):
    equipment = EquipmentSerializer(read_only=True)
    uploaded_by = serializers.StringRelatedField(read_only=True)

    class Meta:
        model = ConditionPhoto
        fields = [
            "id",
            "photo",
            "contract_identifier",
            "timestamp",
            "photo_location",
            "equipment",
            "notes",
            "photo_type",
            "uploaded_by",
        ]
