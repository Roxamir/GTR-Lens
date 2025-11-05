from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views

router = DefaultRouter()
router.register(r"equipment", views.EquipmentViewSet, basename="equipment")
router.register(r"photos", views.ConditionPhotoViewSet, basename="photo")
router.register(r"damage-reports", views.DamageReportViewSet)


urlpatterns = [
    path("", include(router.urls)),
    path("auth/", include("dj_rest_auth.urls")),
    path(
        "generate-upload-url/",
        views.GeneratePresignedURLView.as_view(),
        name="generate-upload-url",
    ),
]
