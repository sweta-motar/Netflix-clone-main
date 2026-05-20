from django.urls import path
from . import views

urlpatterns = [
    path("signup/", views.signup),
    path("login/", views.login),
    path("reset-password/", views.reset_password),
    path("users/", views.get_users),
    path("add-wishlist/", views.add_wishlist),
    path("get-wishlist/<int:user_id>/", views.get_wishlist),
    path("remove-wishlist/", views.remove_wishlist),
    path("add-history/", views.add_history),
    path("get-history/<int:user_id>/", views.get_history),
    path("remove-history/", views.remove_history),
    path("profiles/<int:user_id>/", views.get_profiles),
    path("add-profile/", views.create_profile),
    path("delete-profile/", views.delete_profile),
    path("update-profile/", views.update_profile),
]
