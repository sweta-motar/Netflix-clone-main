import json
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import User, Wishlist, History, Profile

try:
    from rest_framework_simplejwt.tokens import RefreshToken
    JWT_ENABLED = True
except:
    JWT_ENABLED = False

def get_json_body(request):
    try:
        return json.loads(request.body or "{}")
    except json.JSONDecodeError:
        return None

@csrf_exempt
def signup(request):
    try:
        if request.method != "POST":
            return JsonResponse({"error": "POST method required"}, status=405)
        data = get_json_body(request)
        if data is None:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        if not email or not password:
            return JsonResponse({"error": "Email and password are required"}, status=400)
        if User.objects.filter(email=email).exists():
            return JsonResponse({"error": "User already exists"}, status=400)
        user = User.objects.create(email=email, password=password)
        return JsonResponse({"user_id": user.id})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def login(request):
    try:
        if request.method != "POST":
            return JsonResponse({"error": "POST method required"}, status=405)
        data = get_json_body(request)
        if data is None:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
        email = data.get("email", "").strip().lower()
        password = data.get("password", "")
        if not email or not password:
            return JsonResponse({"error": "Email and password are required"}, status=400)
        user = User.objects.filter(email=email, password=password).first()
        if not user:
            return JsonResponse({"error": "Invalid credentials"}, status=400)
        response = {"user_id": user.id, "is_admin": user.is_admin}
        if JWT_ENABLED:
            try:
                refresh = RefreshToken.for_user(user)
                response["token"] = str(refresh.access_token)
            except Exception:
                pass
        return JsonResponse(response)
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def reset_password(request):
    try:
        if request.method != "POST":
            return JsonResponse({"error": "POST method required"}, status=405)
        data = get_json_body(request)
        email = data.get("email", "").strip().lower()
        new_password = data.get("new_password", "")
        if not email or not new_password:
            return JsonResponse({"error": "Email and new password required"}, status=400)
        user = User.objects.filter(email=email).first()
        if not user:
            return JsonResponse({"error": "No account found with this email"}, status=404)
        user.password = new_password
        user.save()
        return JsonResponse({"message": "Password reset successful"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

def get_users(request):
    users = User.objects.all().values()
    return JsonResponse(list(users), safe=False)

@csrf_exempt
def create_profile(request):
    try:
        data = json.loads(request.body)
        profile = Profile.objects.create(
            user_id=data["user_id"],
            name=data["name"],
            avatar=data.get("avatar", ""),
            is_kid=data.get("is_kid", False),
            preferences=data.get("preferences", {}),
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
        Profile.objects.filter(id=data["id"], user_id=data.get("user_id")).delete()
        return JsonResponse({"message": "deleted"})
    except Exception as e:
        return JsonResponse({"error": str(e)})

@csrf_exempt
def update_profile(request):
    try:
        data = json.loads(request.body)
        profile = Profile.objects.filter(id=data["id"], user_id=data["user_id"]).first()
        if not profile:
            return JsonResponse({"error": "Profile not found"}, status=404)
        profile.name = data["name"]
        profile.avatar = data["avatar"]
        if "preferences" in data:
            profile.preferences = data["preferences"]
        profile.save()
        return JsonResponse({"message": "updated"})
    except Exception as e:
        return JsonResponse({"error": str(e)})

def get_wishlist(request, user_id):
    profile_id = request.GET.get("profile_id")
    if profile_id:
        wishlist = Wishlist.objects.filter(user_id=user_id, profile_id=profile_id)
    else:
        wishlist = Wishlist.objects.filter(user_id=user_id)
    return JsonResponse(list(wishlist.values()), safe=False)

@csrf_exempt
def add_wishlist(request):
    try:
        data = json.loads(request.body)
        Wishlist.objects.create(user_id=data["user_id"], profile_id=data.get("profile_id"), movie_id=data["movie_id"], title=data["title"], poster=data["poster"])
        return JsonResponse({"message": "added"})
    except Exception as e:
        return JsonResponse({"error": str(e)})

@csrf_exempt
def remove_wishlist(request):
    try:
        data = json.loads(request.body)
        Wishlist.objects.filter(user_id=data["user_id"], movie_id=data["movie_id"]).delete()
        return JsonResponse({"message": "removed"})
    except Exception as e:
        return JsonResponse({"error": str(e)})

def get_history(request, user_id):
    profile_id = request.GET.get("profile_id")
    if profile_id:
        history = History.objects.filter(user_id=user_id, profile_id=profile_id).order_by("-id")
    else:
        history = History.objects.filter(user_id=user_id).order_by("-id")
    return JsonResponse(list(history.values()), safe=False)

@csrf_exempt
def add_history(request):
    try:
        if request.method != "POST":
            return JsonResponse({"error": "POST method required"}, status=405)
        data = get_json_body(request)
        if data is None:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
        user_id = data.get("user_id")
        movie_id = data.get("movie_id")
        if not user_id or not movie_id:
            return JsonResponse({"error": "user_id and movie_id are required"}, status=400)
        profile_id = data.get("profile_id")
        History.objects.filter(user_id=user_id, movie_id=movie_id, profile_id=profile_id).delete()
        History.objects.create(user_id=user_id, profile_id=profile_id, movie_id=movie_id, title=data.get("title") or "Untitled", poster=data.get("poster") or "")
        return JsonResponse({"message": "added"})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)

@csrf_exempt
def remove_history(request):
    try:
        if request.method != "POST":
            return JsonResponse({"error": "POST method required"}, status=405)
        data = get_json_body(request)
        if data is None:
            return JsonResponse({"error": "Invalid JSON body"}, status=400)
        user_id = data.get("user_id")
        movie_id = data.get("movie_id")
        if not user_id or not movie_id:
            return JsonResponse({"error": "user_id and movie_id are required"}, status=400)
        deleted_count, _ = History.objects.filter(user_id=user_id, movie_id=movie_id).delete()
        return JsonResponse({"message": "removed", "deleted": deleted_count})
    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
