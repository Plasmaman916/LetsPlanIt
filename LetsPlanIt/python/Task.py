import datetime

import User
import RepeatInterval

import time

class Task:
    def __init__(self,
                 task_id: str,
                 user: User,
                 name: str,
                 type: str,
                 repeat_interval: RepeatInterval,
                 duration: time.timedelta,
                 invitees: str[10],
                 priority: int,
                 due_date: datetime,
                 reminders: bool
                 ):
        self.task_id = task_id
        self.user = user
        self.name = name
        self.type = type
        self.repeat_interval = repeat_interval
        self.duration = duration
        self.invitees = invitees
        self.priority = priority
        self.due_date = due_date
        self.reminders = reminders

    def is_valid(self):
        pass