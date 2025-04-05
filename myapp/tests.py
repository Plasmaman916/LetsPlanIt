from django.test import TestCase
from .models import *
from datetime import timedelta
import datetime
# Create your tests here.

# Log In
class Login(TestCase):
    def setUp(self):
        account_manager = AccountManager()
        account_manager.create_account("rufaelTek", "abcd1253")
    
    def test_01(self):
        account_manager = AccountManager()
        response = account_manager.check_login("rufaelTek", "abcd1253")
        self.assertEqual(response, "Successful Login")
    
    def test_02(self):
        account_manager = AccountManager()
        response = account_manager.check_login("rufaelTek", "xyz")
        self.assertEqual(response, "Password is not correct")
    
    def test_03(self):
        account_manager = AccountManager()
        response = account_manager.check_login("rrrrrrr", "abcd1253")
        self.assertEqual(response, "User could not be found")

        
# Log Out
class Logout(TestCase):
    def setUp(self):
        account_manager = AccountManager()
        account_manager.create_account("rufaelTek", "abcd1253")
    
    def test_01(self):
        account_manager = AccountManager()
        login = account_manager.check_login("rufaelTek", "abcd1253")

        session_token = ""
        if login == "Successful Login":
            session_token = "123"
        
        response = account_manager.log_out(session_token=session_token)
        self.assertEqual(response, "Successful logout")
    

    def test_02(self):
        account_manager = AccountManager()
        login = account_manager.check_login("rufaelTek", "abcd1253")

        session_token = ""
        if login == "Successful Login":
            session_token = "124"

        response = account_manager.log_out(session_token=session_token)
        self.assertEqual(response, "Invalid session token error")
    
    def test_03(self):
        account_manager = AccountManager()
        login = account_manager.check_login("rrrr", "abcd1253")

        session_token = None
        if login == "Successful Login":
            session_token = "123"
        
        response = account_manager.log_out(session_token=session_token)
        self.assertEqual(response, "Unauthorized access error")


# Create Task
class TaskTestCase(TestCase):
    def setUp(self):
        account_manager = AccountManager()
        account_manager.create_account("1234", "1234")


    def test_01(self): # all inputs valid
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        
        response = task_manager.create_task(user=user, name="Group Meeting", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=60), invitees=["Tom", "Jerry"], priority=5, due_date=datetime.datetime(2026, 4, 30), reminders=True)
        self.assertEqual(response, "Successfully created task")

    def test_02(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        response = task_manager.create_task(user=user, name="Group Meeting", type="xxyz", repeat_interval=interval, duration=timedelta(minutes=60), invitees=["Tom", "Jerry"], priority=5, due_date=datetime.datetime(2026, 4, 30), reminders=True)
        self.assertEqual(response, "type of task is not valid")

    def test_39(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(1996, 5,7), frequency=timedelta(days=7))

        response = task_manager.create_task(user=user, name="Group Meeting", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=60), invitees=["Tom", "Jerry"], priority=5, due_date=datetime.datetime(2026, 4, 30), reminders=True)
        self.assertEqual(response, "Interval is not valid")

    def test_65(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        response = task_manager.create_task(user=user, name="Group Meeting", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=-1), invitees=["Tom", "Jerry"], priority=5, due_date=datetime.datetime(2026, 4, 30), reminders=True)
        self.assertEqual(response, "duration must be positive")

    def test_82(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        response = task_manager.create_task(user=user, name="Group Meeting", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=-1), invitees=["Tom", "ZYZ"], priority=5, due_date=datetime.datetime(2026, 4, 30), reminders=True)
        self.assertEqual(response, "invalid invitees")

    def test_92(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        
        response = task_manager.create_task(user=user, name="Group Meeting", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=60), invitees=["Tom", "Jerry"], priority=67, due_date=datetime.datetime(2026, 4, 30), reminders=True)
        self.assertEqual(response, "invalid task priority")

    def test_97(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        
        response = task_manager.create_task(user=user, name="Group Meeting", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=60), invitees=["Tom", "Jerry"], priority=5, due_date=datetime.datetime(1996, 4, 30), reminders=True)
        self.assertEqual(response, "invalid due date")

    def test_100(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        
        response = task_manager.create_task(user=user, name="Group Meeting", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=60), invitees=["Tom", "Jerry"], priority=5, due_date=datetime.datetime(2026, 4, 30), reminders=None)
        self.assertEqual(response, "invalid reminder paramter")

    def test_101(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        
        response = task_manager.create_task(user=user, name="", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=60), invitees=["Tom", "Jerry"], priority=5, due_date=datetime.datetime(2026, 4, 30), reminders=True)
        self.assertEqual(response, "no name for task")

    def test_150(self):
        user = User.objects.get(username="1234")
        task_manager = TaskManager()
        interval = RepeatInterval(start=datetime.datetime(2025, 4, 7), end=datetime.datetime(2025, 5,7), frequency=timedelta(days=7))

        
        response = task_manager.create_task(user=user, name="\t", type="Meeting", repeat_interval=interval, duration=timedelta(minutes=60), invitees=["Tom", "Jerry"], priority=5, due_date=datetime.datetime(2026, 4, 30), reminders=True)
        self.assertEqual(response, "no name for task")

# Navigate Dashboard
class NavigateDashboard(TestCase):
    def test_01(self):
        db_manager = DatabaseManager()
        
        response = db_manager.redirect(page="profile", session_time=30)
        self.assertEqual(response, "Page is set")

    def test_02(self):
        db_manager = DatabaseManager()
        
        response = db_manager.redirect(page="payment", session_time=30)
        self.assertEqual(response, "page does not exist")

    def test_03(self):
        db_manager = DatabaseManager()
        
        response = db_manager.redirect(page="profile", session_time=61)
        self.assertEqual(response, "user timed out")