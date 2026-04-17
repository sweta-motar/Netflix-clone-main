from django.contrib import admin
from .models import User, Wishlist, History, Profile

# USER
class UserAdmin(admin.ModelAdmin):
    list_display = ("id", "email", "is_admin")

# PROFILE
class ProfileAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "name")

# WISHLIST
class WishlistAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "title", "movie_id")

#HISTORY
class HistoryAdmin(admin.ModelAdmin):
    list_display = ("id", "user_id", "title", "movie_id")

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Wishlist, WishlistAdmin)
admin.site.register(History, HistoryAdmin)