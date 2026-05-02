from django.db import models

class User(models.Model):
    email = models.EmailField(unique=True)  # ✅ prevent duplicate users
    password = models.CharField(max_length=100)
    is_admin = models.BooleanField(default=False)


class Wishlist(models.Model):
    user_id = models.IntegerField()
    movie_id = models.IntegerField()
    title = models.CharField(max_length=200)
    poster = models.CharField(max_length=300)


class History(models.Model):
    user_id = models.IntegerField()
    movie_id = models.IntegerField()
    title = models.CharField(max_length=200)
    poster = models.CharField(max_length=300)


class Profile(models.Model):
    user_id = models.IntegerField(null=True)
    name = models.CharField(max_length=100)
    avatar = models.TextField(blank=True)
    is_kid = models.BooleanField(default=False)