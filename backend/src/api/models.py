from django.db import models

# Create your models here.
<<<<<<< HEAD

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
        ('OTHER', 'Other')
    ]

    image = models.ImageField(upload_to='photos/')
    contract_identifier = models.CharField(max_length=10)
    timestamp = models.DateTimeField(auto_now_add=True)
    photo_location = models.CharField(max_length=50, choices=PHOTO_LOCATIONS, default='OTHER')
    equipment = models.ForeignKey(Equipment, on_delete=models.CASCADE, related_name='photos')
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.equipment.name} - {self.get_photo_location_display()} on {self.timestamp.strftime('%Y-%m-%d')}"    
=======
>>>>>>> a202756 (feat(backend): Initialize Django project structure)
