from django.contrib.auth import authenticate
from django.shortcuts import render, HttpResponse
from myapp.models import User
import json

# Create your views here.
def home(request):
    return HttpResponse("hello world")

def register(request):
    if request.method != "POST":
        return HttpResponse("Invalid request")

    if request.session.get("user_id"):
        return HttpResponse("User already logged in")

    # username = request.POST.get("username")

    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    username = body["username"]
    password = body["password"]
    #response = username, "this is the request body's username", password, "this is the request body's password"
    #return HttpResponse(response)

    
    try:
        curr_usr = User.objects.get(username=username)
        return HttpResponse("User already exists")
    except Exception:
        curr_usr = User.objects.create_user(username=username, password=password)
        curr_usr.save()
        return HttpResponse("Created new user: " + curr_usr.username)
    

def login(request):

    if request.method != "POST":
        return HttpResponse("Invalid request")
    if request.session.get("user_id"):
        return HttpResponse("User already logged in")
    
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    username = body["username"]
    password = body["password"]

    # username = request.POST.get("username")
    # password = request.POST.get("password")
    user = authenticate(username=username, password=password)

    if user is not None:
        request.session["user_id"] = user.id
        return HttpResponse("Login successful")
    else:
        return HttpResponse("Invalid login")

def update_user(request):
    pass

def create_task(request):
    pass

def get_task(request):
    pass

def update_task(request):
    pass

def logout(request):
    request.session.flush()
    return HttpResponse("Logged out")