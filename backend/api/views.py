import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Wishlist, History, Profile


# ---------------- AUTH ---------------- #

@csrf_exempt
def signup(request):
    try:
        data = json.loads(request.body)

        # prevent duplicate user
        if User.objects.filter(email=data["email"]).exists():
            return JsonResponse({"error": "User already exists"}, status=400)

        user = User.objects.create(
            email=data["email"],
            password=data["password"]
        )

        return JsonResponse({"user_id": user.id})

    except Exception as e:
        return JsonResponse({"error": str(e)})


@csrf_exempt
def login(request):
    try:
        data = json.loads(request.body)

        user = User.objects.filter(
            email=data["email"],
            password=data["password"]
        ).first()

        if not user:
            return JsonResponse({"error": "Invalid credentials"}, status=400)

        return JsonResponse({
            "user_id": user.id,
            "is_admin": user.is_admin
        })

    except Exception as e:
        return JsonResponse({"error": str(e)})


# ---------------- PROFILE ---------------- #

@csrf_exempt
def create_profile(request):
    try:
        data = json.loads(request.body)

        profile = Profile.objects.create(
            user_id=data["user_id"],
            name=data["name"],
            avatar=data.get("avatar", ""),
            is_kid=data.get("is_kid", False)
        )

        return JsonResponse({"id": profile.id})

    except Exception as e:
        return JsonResponse({"error": str(e)})


def get_profiles(request, user_id):
    profiles = Profile.objects.filter(user_id=user_id)
    return JsonResponse(list(profiles.values()), safe=False)


@csrf_exempt
def delete_profile(request):
    try:
        data = json.loads(request.body)

        Profile.objects.filter(
            id=data["id"],
            user_id=data.get("user_id")  # safety: delete only own profile
        ).delete()

        return JsonResponse({"message": "deleted"})

    except Exception as e:
        return JsonResponse({"error": str(e)})


# ---------------- WISHLIST ---------------- #

def get_wishlist(request, user_id):
    wishlist = Wishlist.objects.filter(user_id=user_id)
    return JsonResponse(list(wishlist.values()), safe=False)


@csrf_exempt
def add_wishlist(request):
    try:
        data = json.loads(request.body)

        Wishlist.objects.create(
            user_id=data["user_id"],
            movie_id=data["movie_id"],
            title=data["title"],
            poster=data["poster"]
        )

        return JsonResponse({"message": "added"})

    except Exception as e:
        return JsonResponse({"error": str(e)})


@csrf_exempt
def remove_wishlist(request):
    try:
        data = json.loads(request.body)

        Wishlist.objects.filter(
            user_id=data["user_id"],
            movie_id=data["movie_id"]
        ).delete()

        return JsonResponse({"message": "removed"})

    except Exception as e:
        return JsonResponse({"error": str(e)})


# ---------------- HISTORY ---------------- #

def get_history(request, user_id):
    history = History.objects.filter(user_id=user_id)
    return JsonResponse(list(history.values()), safe=False)


@csrf_exempt
def add_history(request):
    try:
        data = json.loads(request.body)

        History.objects.create(
            user_id=data["user_id"],
            movie_id=data["movie_id"],
            title=data["title"],
            poster=data["poster"]
        )

        return JsonResponse({"message": "added"})

    except Exception as e:
        return JsonResponse({"error": str(e)})