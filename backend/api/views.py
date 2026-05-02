import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Wishlist, History, Profile

# ✅ OPTIONAL JWT (simple, safe)
try:
    from rest_framework_simplejwt.tokens import RefreshToken
    JWT_ENABLED = True
except:
    JWT_ENABLED = False


# ---------------- AUTH ---------------- #

@csrf_exempt
def signup(request):
    try:
        data = json.loads(request.body)

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

        response = {
            "user_id": user.id,
            "is_admin": user.is_admin
        }

        # ✅ Add token if JWT installed
        if JWT_ENABLED:
            refresh = RefreshToken.for_user(user)
            response["token"] = str(refresh.access_token)

        return JsonResponse(response)

    except Exception as e:
        return JsonResponse({"error": str(e)})


# ✅ FIXED MISSING FUNCTION (IMPORTANT)
def get_users(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)


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
            user_id=data.get("user_id")
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