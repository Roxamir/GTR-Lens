from django.contrib import admin
<<<<<<< HEAD
from .models import Equipment, ConditionPhoto
from django.utils.html import mark_safe


@admin.register(Equipment)
class EquipmentAdmin(admin.ModelAdmin):
    list_display = ('name',)

@admin.register(ConditionPhoto)
class ConditionPhotoAdmin(admin.ModelAdmin):
    list_display = ('equipment', 'image_preview', 'photo_location', 'timestamp', 'contract_identifier')
    list_filter = ('equipment', 'photo_location', 'timestamp')
    readonly_fields = ('image_preview',)

    def image_preview(self, obj):
        if obj.image:
            return mark_safe(f'<img src="{obj.image.url}" width="150" height="auto" />')
        return "No Image"
    
    image_preview.short_description = 'Image Preview'
=======

# Register your models here.
>>>>>>> a202756 (feat(backend): Initialize Django project structure)
