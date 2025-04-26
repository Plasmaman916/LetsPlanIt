from django.db import models
from django.contrib.auth.models import AbstractUser
from django.contrib.auth.hashers import check_password
from django.conf import settings
from datetime import timedelta
from datetime import datetime
from typing import List
import re

CONTROL_CHAR_PATTERN = re.compile(r"[\x00-\x1F\x7F]")

# Create your models here.
# User
class User(AbstractUser):
    # username and password already included
    pass

    def login(self):
        return f"{self.username} has logged in" # Log in use case
    

    def logout(self):
        return f"{self.username} has logged out" # Log out use case



# Account Manager
class AccountManager:
    def __init__(self):
        self.session_token = None


    def create_account(self, username: str, password: str):
        # create a new user and saved to the database automatically
        
        if len(username) < 5 or len(username) > 15:
            return "Username is not valid"

        user = User.objects.create_user(
            username=username,
            password=password
        )

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
        if self.session_token == None:
            return "Unauthorized access error"
        
        if not session_token == self.session_token:
            return "Invalid session token error"
        else:
            return "Successful logout"


# Task
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
    # invitees = models.TextField(blank=True, default="") # invitees should be a many to many relationship
    due_date = models.DateTimeField()
    reminders = models.BooleanField(default=False)
    # completed
    completed = models.BooleanField(default=False)

    # many to many for invited users
    invitees = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        related_name="shared_tasks",
        blank=True
    )

    def __str__(self):
        return f"{self.name} for {self.user.username}"
    
    def get_invitees_list(self):
        return [username.strip() for username in self.invitees.split(",") if username.strip()]
    
    def set_invitees_list(self, invitees_list):
        self.invitees = ",".join(invitees_list)
    


# RepeatInterval
class RepeatInterval:
    def __init__(self, start: datetime, end: datetime, frequency: timedelta):
        self.start = start
        self.end = end
        self.frequency = frequency

    def is_valid(self):
        return self.start < self.end

    def parse(self, str):
        pass

    def next_run():
        pass


# Task Manager
class TaskManager:
    def create_task(self, user: User, name: str, type: str, repeat_interval: RepeatInterval, duration: timedelta, invitees: list[str], priority: int, due_date: datetime, reminders: bool):
        
        valid_types = ["Meeting", "Task"]
        valid_invitees = ["Tom", "Jerry"]

        if name == "" or CONTROL_CHAR_PATTERN.search(name):
            return "no name for task"

        if not reminders == True or reminders == False:
            return "invalid reminder paramter"

        if due_date < datetime.now():
            return "invalid due date"

        if priority < 1 or priority > 5:
            return "invalid task priority"

        for invitee in invitees:
            if invitee not in valid_invitees:
                return "invalid invitees"

        if duration.total_seconds() < 0:
            return "duration must be positive"

        if not type in valid_types:
            return "type of task is not valid"
        
        if not repeat_interval.is_valid():
            return "Interval is not valid"
        
        task = Task.objects.create(
            user=user,
            name=name,
            type=type,
            duration=duration,
            priority=priority,
            due_date=due_date,
            reminders=reminders
        )

        task.set_invitees_list(invitees) # set the invitees 

        task.save() # save the task to the database
        return "Successfully created task" # Create task use case

    def update_task(self, task: Task, new_values: dict):
        if not isinstance(task, Task):
            return "The given task does not belong to a class"
        
        valid_fields = [field.name for field in Task._meta.fields]

        for field_name, value in new_values.items():
            if field_name not in valid_fields:
                return "Invalid fields provided"

            if field_name == 'user' and not isinstance(value, User): # this should never execute in use, but just for good practice
                return "The given user does not belong to a class"
            
            # set the attribute to the new value
            setattr(task, field_name, value)
            
        # save the task to the database
        task.save()

        return "Successfully updated task" # for now



# Database Manager
class DatabaseManager:
    def __init__(self):
        self.pages = ["create task", "profile", "log out"]


    def get_user(self, uid: int): # Retrieve a user
        try:
            user = User.objects.get(id=uid)
            print(f"Retrieved user with username {user.username}")
            return user
        except Exception as e:
            print("Could not retrieve user")
            return None
    
    def get_task(self, tid: int):
        try :
            task = Task.objects.get(id=tid)
            print(f"Retreived task that belongs to {task.user.username} with name {task.name}")
            return task
        except Exception as e:
            print("Could not retrieve task")
            return None
        

    def add_task(self, task: Task): # handled by Task Manager
        pass

    
    def save_task(self, task: Task): # handled by Task Manager
        pass

    
    def redirect(self, page: str, session_time: int): # Navigate Dashboard Use Case
        if not page in self.pages:
            return "page does not exist"
        
        if session_time > 60: # session time greater than 60 minutes
            return "user timed out"
        
        return "Page is set"
    
