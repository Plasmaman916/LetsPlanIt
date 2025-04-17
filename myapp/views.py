from django.shortcuts import render, HttpResponse
from myapp.models import User

# Create your views here.
def home(request):
    return HttpResponse("hello world")

def register(request, username, password):

    try:
        curr_usr = User.objects.get(username=username)
        passc = curr_usr.check_password(password)
        if passc:
            return HttpResponse("Welcome back " + curr_usr.username)
        else:
            return HttpResponse("Invalid password")
    except User.DoesNotExist:
        curr_usr = User.objects.create_user(username=username, password=password)
        return HttpResponse("Created new user: " + curr_usr.username)