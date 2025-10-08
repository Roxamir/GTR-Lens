from django.db import models
from django.contrib.auth.models import User

class Equipment(models.Model):
    name = models.CharField(max_length=100)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return self.name

class ConditionPhoto(models.Model):
    PHOTO_LOCATIONS = [
        ('FRONT_VIEW', 'Front View'),
        ('REAR_VIEW', 'Rear View'),
        ('LEFT_SIDE', 'Left Side'),
        ('RIGHT_SIDE', 'Right Side'),
        ('HOOKUP', 'Hookup'),
        ('DAMAGE', 'Damage'),
        ('OTHER', 'Other'),
    ]

    PHOTO_TYPES = [
        ('BEFORE', 'Before (Check-Out)'),
        ('AFTER', 'After (Check-In)'),
    ]

    image = models.ImageField(upload_to='photos/')
    contract_identifier = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    photo_location = models.CharField(max_length=50, choices=PHOTO_LOCATIONS, default='OTHER')
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='photos')
    photo_type = models.CharField(max_length=10, choices=PHOTO_TYPES, default='AFTER')
    notes = models.TextField(blank=True, null=True)
    
    def __str__(self):
        return f"{self.equipment.name} - {self.get_photo_location_display()} on {self.timestamp.strftime('%Y-%m-%d')}"

class DamageReport(models.Model):
    DAMAGE_TYPES = [
        ('SCRATCH', 'Scratch/Scuff'),
        ('DENT', 'Dent'),
        ('BROKEN', 'Broken Part'),
        ('MISSING', 'Missing Part'),
        ('OTHER', 'Other'),
    ]

    DAMAGE_LOCATIONS = [
        ('FRONT', 'Front'),
        ('REAR', 'Rear'),
        ('LEFT', 'Left Side'),
        ('RIGHT', 'Right Side'),
        ('OTHER', 'Other'),
    ]

    damage_location = models.CharField(max_length=20, choices=DAMAGE_LOCATIONS, default='OTHER')
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='damage_reports')
    reported_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True)
    damage_type = models.CharField(max_length=50, choices=DAMAGE_TYPES)
    notes = models.TextField()
    reported_at = models.DateTimeField(auto_now_add=True)
    photo = models.ImageField(upload_to='damage_photos/', blank=True, null=True)

    def __str__(self):
        return f"Damage report for {self.equipment.name} on {self.reported_at.strftime('%Y-%m-%d')}"