from datetime import datetime, timedelta

from django.contrib.auth import authenticate
from django.core import serializers
from django.shortcuts import render, HttpResponse
from django.http import JsonResponse

from myapp.models import User, Task
import json

# Create your views here.
def home(request):
    return HttpResponse("hello world")

def register(request):
    if request.method != "POST":
        return HttpResponse("Invalid request")

    if request.session.get("user_id"):
        return HttpResponse("User already logged in")


    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    username = body["username"]
    password = body["password"]

    
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

    user = authenticate(username=username, password=password)

    if user is not None:
        request.session["user_id"] = user.id
        request.session["username"] = user.username
        print(request.session["user_id"], " this is the id")
        print(request.session["username"], " this is the username")
        return HttpResponse("Login successful")
    else:
        return HttpResponse("Invalid login")
    

def session(request):
    if not request.session.get("user_id"): # this means that the user is not logged in
        return HttpResponse("the session does not have the user id")
    
    print("The session has a user id")
    id = request.session.get("user_id")
    return HttpResponse(f"The session has the user id of {id}")

# returns the username associated with the session
def session_username(request):
    if not request.session.get("user_id"):
        return JsonResponse({"message": "error"})
    
    if not request.session.get("username"):
        return JsonResponse({"message": "error"})
    
    # username should be stored in the session
    username = request.session.get("username")
    return JsonResponse({"username": username})

def search_user(request):
    if request.method != "POST":
        return HttpResponse("Invalid request")
    
    if not request.session.get("user_id"):
        print(request.session.get("user_id"), " this is the request.session")
        return HttpResponse("User not logged in")
    
    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    username = body["username"]

    user = User.objects.get(username=username)

    if user:
        return HttpResponse("Found user")
    else:
        return HttpResponse("Could not find user")
    

def update_user(request):
    if request.method != "POST":
        return HttpResponse("Invalid request")

    if not request.session.get("user_id"):
        return HttpResponse("User not logged in")

    curr_usr = User.objects.get(id=request.session.get("user_id"))
    if not curr_usr:
        return HttpResponse("User not found")

    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    password = body["password"]

    if not password:
        return HttpResponse("Password not provided")

    curr_usr.set_password(password)
    curr_usr.save()
    return HttpResponse("Password updated")


# invitees will be received as a list of strings (usernames) which will then all be invited to the task
def create_task(request):
    if request.method != "POST":
        return HttpResponse("Invalid request")

    if not request.session.get("user_id"):
        return HttpResponse("User not logged in")

    curr_usr = User.objects.get(id=request.session.get("user_id"))
    if not curr_usr:
        return HttpResponse("User not found")

    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    def parse(): # decide whether to assign type as task or meeting
        pass

    name = body["name"]
    type = body["type"]
    duration = body["duration"]
    priority = body["priority"]
    due_date = body["due_date"]
    reminders = body["reminders"]

    format_string = "%Y-%m-%d %H:%M:%S"

    datetime_object = datetime.strptime(due_date, format_string)

    timedelta_object = timedelta(seconds=duration)

    if not name or len(name) == 0:
        return HttpResponse("Name not provided")

    if Task.objects.filter(user=curr_usr).filter(name=name).exists():
        return HttpResponse("Task already exists")

    task = Task.objects.create(name=name,
                               type=type,
                               duration=timedelta_object,
                               priority=priority,
                               due_date=datetime_object,
                               reminders=reminders,
                               user=curr_usr)
    
    # invite users to task
    users_to_invite = body["invitees"] # string array of usernames
    # each user has been validated already
    for username in users_to_invite:
        user = User.objects.get(username=username)
        task.invitees.add(user)

    task.save()
    return HttpResponse("Task created")

def get_task(request):
    if request.method != "GET":
        return HttpResponse("Invalid request")

    if not request.session.get("user_id"):
        return HttpResponse("User not logged in")

    curr_usr = User.objects.get(id=request.session.get("user_id"))
    if not curr_usr:
        return HttpResponse("User not found")

    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    name = body["name"]

    user_tasks = Task.objects.filter(user=curr_usr).filter(name=name)
    if not user_tasks:
        return HttpResponse("Task not found")

    return HttpResponse(serializers.serialize('json',user_tasks), content_type="application/json")


def get_all_tasks(request):
    if request.method != "GET":
        return HttpResponse("Invalid request")

    if not request.session.get("user_id"):
        return HttpResponse("User not logged in")

    curr_usr = User.objects.get(id=request.session.get("user_id"))
    if not curr_usr:
        return HttpResponse("User not found")

    return HttpResponse(serializers.serialize('json',Task.objects.filter(user=curr_usr)), content_type="application/json")

def update_task(request):
    if request.method != "POST":
        return HttpResponse("Invalid request")

    if not request.session.get("user_id"):
        return HttpResponse("User not logged in")

    curr_usr = User.objects.get(id=request.session.get("user_id"))
    if not curr_usr:
        return HttpResponse("User not found")

    body_unicode = request.body.decode("utf-8")
    body = json.loads(body_unicode)

    name = body["name"]
    user_task = None
    try:
        user_task = Task.objects.filter(user=curr_usr).get(name=name)
    except Exception:
        return HttpResponse("Task not found")
    new_name = None
    if "new_name" in body:
        new_name = body["new_name"]
        new_name_task = Task.objects.filter(user=curr_usr).filter(name=new_name)
        if new_name_task.exists():
            return HttpResponse("Task with name already exists")
    type = body["type"]
    duration = body["duration"]
    priority = body["priority"]
    invitees = body["invitees"]
    due_date = body["due_date"]
    reminders = body["reminders"]

    format_string = "%Y-%m-%d %H:%M:%S"

    datetime_object = datetime.strptime(due_date, format_string)

    timedelta_object = timedelta(seconds=duration)

    if not name or len(name) == 0:
        return HttpResponse("Name not provided")

    if new_name and len(new_name) > 0:
        user_task.name = new_name

    user_task.type = type
    user_task.duration = timedelta_object
    user_task.priority = priority
    user_task.invitees = invitees
    user_task.due_date = datetime_object
    user_task.reminders = reminders
    user_task.save()

    return HttpResponse("Task updated")

def logout(request):
    request.session.flush()
    print(request.session.get("user_id"), " this is the user id")
    print(request.session.get("username"), " this is the username")
    return HttpResponse("Logged out")