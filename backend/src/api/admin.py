from django.contrib import admin
from .models import Equipment, ConditionPhoto, DamageReport
from django.utils.html import mark_safe


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ("name",)


@admin.register(ConditionPhoto)
class ConditionPhotoAdmin(admin.ModelAdmin):
    list_display = (
        "equipment",
        "photo_preview",
        "photo_location",
        "timestamp",
        "contract_identifier",
        "uploaded_by",
    )
    list_filter = ("equipment", "photo_location", "timestamp")
    readonly_fields = ("photo_preview",)

    def photo_preview(self, obj):
        if obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" width="150" height="auto" />')
        return "No Photo"

    photo_preview.short_description = "Photo Preview"


@admin.register(DamageReport)
class DamageReportAdmin(admin.ModelAdmin):
    list_display = (
        "equipment",
        "photo_preview",
        "damage_location",
        "reported_by",
        "damage_type",
        "notes",
        "reported_at",
    )
    readonly_fields = ("photo_preview",)
    list_filter = ("damage_location", "equipment", "reported_by", "damage_type")

    def photo_preview(self, obj):
        if obj.photo:
            return mark_safe(f'<img src="{obj.photo.url}" width="150" height="auto" />')
        return "No Photo"

    photo_preview.short_description = "Photo Preview"
