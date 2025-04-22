from django.urls import path
from . import views

urlpatterns = [
    path("", views.home, name="home"),
    path("register", views.register, name="register"),
    path("login", views.login, name="login"),
    path("logout", views.logout, name="logout"),
    path("update_user", views.update_user, name="update_user"),
    path("create_task", views.create_task, name="create_task"),
    path("get_all_tasks", views.get_all_tasks, name="get_all_tasks"),
    path("get_task", views.get_task, name="get_task"),
    path("update_task", views.update_task, name="update_task"),
]