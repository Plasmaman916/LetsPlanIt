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

    def login(self):
        return f"{self.username} has logged in" # Log in use case
    

    def logout(self):
        return f"{self.username} has logged out" # Log out use case



# Account Manager
class AccountManager:
    def create_account(self, username: str, password: str):
        # create a new user and saved to the database automatically
        user = User.objects.create_user(
            username=username,
            password=password
        )
    

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
    due_date = models.DateTimeField()
    reminders = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.name} for {self.user.username}"
    

# Task Manager
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


# RepeatInterval
class RepeatInterval:
    def __init__(self, start: datetime, end: datetime, frequency: timedelta):
        self.start = start
        self.end = end
        self.frequency = frequency

    def parse(self, str):
        pass

    def next_run():
        pass


# Database Manager
class DatabaseManager:
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

    
    def redirect(self, page: str): # Navigate Dashboard Use Case
        return "Page is set to " + str
    
