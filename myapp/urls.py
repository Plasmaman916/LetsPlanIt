from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("register/<str:username>/<str:password>", views.register, name="register")
]