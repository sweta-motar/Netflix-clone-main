from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
import json
from .models import *
from django.db.models import Count


# ---------------- ANALYTICS ----------------

def most_watched(request, user_id=None):
    try:
        print("USER ID RECEIVED:", user_id)  #DEBUG

        if user_id is not None:
            data = (
                History.objects
                .filter(user_id=user_id)
                .values("movie_id", "title", "poster")
                .annotate(count=Count("movie_id"))
                .order_by("-count")
            )
        else:
            data = (
                History.objects
                .values("movie_id", "title", "poster")
                .annotate(count=Count("movie_id"))
                .order_by("-count")
            )

        return JsonResponse(list(data), safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)})


# ---------------- LOGIN & SIGNUP ----------------
@csrf_exempt
def signup(request):
    try:
        data = json.loads(request.body)

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

        user = User.objects.get(
            email=data["email"],
            password=data["password"]
        )

        return JsonResponse({
            "user_id": user.id,
            "is_admin": user.is_admin
        })

    except:
        return JsonResponse({"error": "Invalid"})


# ---------------- USERS (HIDE ADMIN) ----------------
def get_users(request):
    try:
        users = list(
            User.objects
            .filter(is_admin=False)   #hide admin
            .values("id", "email")
        )
        return JsonResponse(users, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)})


from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from .models import Wishlist, History


from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
from .models import Wishlist, History


# ---------------- WISHLIST ----------------
@csrf_exempt
def toggle_wishlist(request):
    if request.method != "POST":
        return JsonResponse({"error": "Invalid method"}, status=405)

    try:
        data = json.loads(request.body)

        user_id = int(data.get("user_id"))
        movie_id = data.get("movie_id")

        if not user_id or not movie_id:
            return JsonResponse({"error": "Missing data"}, status=400)

        obj = Wishlist.objects.filter(user_id=user_id, movie_id=movie_id).first()

        if obj:
            obj.delete()
            return JsonResponse({"message": "removed"})
        else:
            Wishlist.objects.create(
                user_id=user_id,
                movie_id=movie_id,
                title=data.get("title", ""),
                poster=data.get("poster", "")
            )
            return JsonResponse({"message": "added"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_wishlist(request, user_id):
    try:
        user_id = int(user_id)

        data = list(
            Wishlist.objects.filter(user_id=user_id).values()
        )

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def remove_wishlist(request):
    try:
        data = json.loads(request.body)

        Wishlist.objects.filter(
            user_id=int(data.get("user_id")),
            movie_id=data.get("movie_id")
        ).delete()

        return JsonResponse({"message": "removed"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


# ---------------- continue watching----------------
@csrf_exempt
def add_history(request):
    try:
        data = json.loads(request.body)

        user_id = int(data.get("user_id"))
        movie_id = data.get("movie_id")

        if not user_id or not movie_id:
            return JsonResponse({"error": "Missing data"}, status=400)

        History.objects.update_or_create(
            user_id=user_id,
            movie_id=movie_id,
            defaults={
                "title": data.get("title", ""),
                "poster": data.get("poster", "")
            }
        )

        return JsonResponse({"message": "saved"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


def get_history(request, user_id):
    try:
        user_id = int(user_id)

        data = list(
            History.objects
            .filter(user_id=user_id)
            .order_by("-id")
            .values()
        )

        return JsonResponse(data, safe=False)

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)


@csrf_exempt
def remove_history(request):
    try:
        data = json.loads(request.body)

        History.objects.filter(
            user_id=int(data.get("user_id")),
            movie_id=data.get("movie_id")
        ).delete()

        return JsonResponse({"message": "removed"})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=400)



# ---------------- PROFILE ----------------
def get_profiles(request, user_id):
    data = list(Profile.objects.filter(user_id=user_id).values())
    return JsonResponse(data, safe=False)


@csrf_exempt
def add_profile(request):
    try:
        data = json.loads(request.body)

        if not data.get("user_id") or not data.get("name"):
            return JsonResponse({"error": "Missing data"})

        profile = Profile.objects.create(
            user_id=int(data["user_id"]),
            name=data["name"],
            avatar=data.get("avatar", ""),
            is_kid=data.get("is_kid", False)
        )

        return JsonResponse({
            "message": "profile created",
            "id": profile.id
        })

    except Exception as e:
        return JsonResponse({"error": str(e)})


@csrf_exempt
def delete_profile(request):
    try:
        data = json.loads(request.body)

        Profile.objects.filter(id=data["id"]).delete()

        return JsonResponse({"message": "deleted"})

    except Exception as e:
        return JsonResponse({"error": str(e)})


@csrf_exempt
def update_profile(request):
    try:
        data = json.loads(request.body)

        Profile.objects.filter(id=data["id"]).update(
            name=data["name"]
        )

        return JsonResponse({"message": "updated"})

    except Exception as e:
        return JsonResponse({"error": str(e)})