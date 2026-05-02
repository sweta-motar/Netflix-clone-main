from django.urls import path
from . import views

urlpatterns = [
    # AUTH
    path("signup/", views.signup),
    path("login/", views.login),

    # USERS
    path("users/", views.get_users),

    # WISHLIST
    path("add-wishlist/", views.add_wishlist),
    path("get-wishlist/<int:user_id>/", views.get_wishlist),
    path("remove-wishlist/", views.remove_wishlist),

    # HISTORY
    path("add-history/", views.add_history),
    path("get-history/<int:user_id>/", views.get_history),

    # PROFILE
    path("profiles/<int:user_id>/", views.get_profiles),
    path("add-profile/", views.create_profile),
    path("delete-profile/", views.delete_profile),
    path("update-profile/", views.update_profile),

    # ANALYTICS
       #path("analytics/", views.most_watched),             # all users
        #path("analytics/<int:user_id>/", views.most_watched),           # specific user
      
]