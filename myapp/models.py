from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import check_password
from django.conf import settings
from datetime import timedelta, datetime
import re

CONTROL_CHAR_PATTERN = re.compile(r"[\x00-\x1F\x7F]")

# User model
class User(AbstractUser):
    pass

    def login(self):
        return f"{self.username} has logged in"
    
    def logout(self):
        return f"{self.username} has logged out"

# Account Manager
class AccountManager:
    def __init__(self):
        self.session_token = None

    def create_account(self, username: str, password: str):
        if len(username) < 5 or len(username) > 15:
            return "Username is not valid"
        user = User.objects.create_user(username=username, password=password)
        return "Successfully created user"
    
    def check_login(self, username: str, password: str):
        try:
            user = User.objects.get(username=username)
            if check_password(password, user.password):
                self.session_token = "123"
                return "Successful Login"
            else:
                return "Password is not correct"
        except User.DoesNotExist:
            return "User could not be found"

    def log_out(self, session_token):
        if self.session_token is None:
            return "Unauthorized access error"
        if session_token != self.session_token:
            return "Invalid session token error"
        return "Successful logout"

# Task model
class Task(models.Model):
    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="tasks"
    )
    name = models.CharField(max_length=150)
    description = models.CharField(max_length=100)
    priority = models.IntegerField()
    due_date = models.DateTimeField()
    reminders = models.BooleanField(default=False)
    completed = models.BooleanField(default=False)
    invitees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="shared_tasks",
        blank=True
    )

    def __str__(self):
        return f"{self.name} for {self.user.username}"

# RepeatInterval class
class RepeatInterval:
    def __init__(self, start: datetime, end: datetime, frequency: timedelta):
        self.start = start
        self.end = end
        self.frequency = frequency

    def is_valid(self):
        return self.start < self.end

# Task Manager
class TaskManager:
    def create_task(self, user: User, name: str, repeat_interval: RepeatInterval, invitees: list[str], priority: int, due_date: datetime, reminders: bool):
        if name == "" or CONTROL_CHAR_PATTERN.search(name):
            return "no name for task"
        if reminders not in [True, False]:
            return "invalid reminder parameter"
        if due_date < datetime.now():
            return "invalid due date"
        if priority < 1 or priority > 5:
            return "invalid task priority"
        if not repeat_interval.is_valid():
            return "Interval is not valid"

        task = Task.objects.create(
            user=user,
            name=name,
            description="Default description",
            priority=priority,
            due_date=due_date,
            reminders=reminders
        )
        task.save()
        return "Successfully created task"

    def update_task(self, task: Task, new_values: dict):
        if not isinstance(task, Task):
            return "The given task does not belong to a class"
        valid_fields = [field.name for field in Task._meta.fields]
        for field_name, value in new_values.items():
            if field_name not in valid_fields:
                return "Invalid fields provided"
            setattr(task, field_name, value)
        task.save()
        return "Successfully updated task"

# Database Manager
class DatabaseManager:
    def __init__(self):
        self.pages = ["create task", "profile", "log out"]

    def get_user(self, uid: int):
        try:
            return User.objects.get(id=uid)
        except Exception:
            return None

    def get_task(self, tid: int):
        try:
            return Task.objects.get(id=tid)
        except Exception:
            return None

    def redirect(self, page: str, session_time: int):
        if page not in self.pages:
            return "page does not exist"
        if session_time > 60:
            return "user timed out"
        return "Page is set"
