from django.db import models
from django.contrib.auth.models import AbstractUser
from django.conf import settings
from datetime import timedelta
from datetime import datetime

# Create your models here.
# User
class User(AbstractUser):
    # username and password already included
    pass

# Account Manager
class AccountManager:
    def create_account(self, username: str, password: str):
        # create a new user and save it to the database
        user = User.objects.create_user(
            username=username,
            password=password
        )
    

class DatabaseManager:
    def get_user(self, uid: int):
        try:
            user = User.objects.get(id=uid)
            return user
        except Exception as e:
            return None
    
    def get_task(self, tid: int):
        pass

class Task(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks"
    )

    name = models.CharField(max_length=150)
    type = models.CharField(max_length=100)
    duration = models.DurationField()
    priority = models.IntegerField()
    due_date = models.DateTimeField()
    reminders = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} for {self.user.username}"
    

class TaskManager:
    def create_task(self, user: User, name: str, type: str, duration: timedelta, priority: int, due_date: datetime, reminders: bool):
        task = Task.objects.create(
            user=user,
            name=name,
            type=type,
            duration=duration,
            priority=priority,
            due_date=due_date,
            reminders=reminders
        )
