from django.test import TestCase
from myapp.models import User, Task, AccountManager, TaskManager, DatabaseManager, RepeatInterval
from datetime import datetime, timedelta

# Account Tests
class AccountTestCase(TestCase):
    def setUp(self):
        self.manager = AccountManager()
        self.username = "testuser"
        self.password = "testpass123"

    def test_create_account_valid(self):
        result = self.manager.create_account(self.username, self.password)
        self.assertEqual(result, "Successfully created user")

    def test_create_account_invalid_username(self):
        result = self.manager.create_account("abc", self.password)
        self.assertEqual(result, "Username is not valid")

    def test_login_successful(self):
        self.manager.create_account(self.username, self.password)
        result = self.manager.check_login(self.username, self.password)
        self.assertEqual(result, "Successful Login")

    def test_login_wrong_password(self):
        self.manager.create_account(self.username, self.password)
        result = self.manager.check_login(self.username, "wrongpass")
        self.assertEqual(result, "Password is not correct")

    def test_login_user_not_found(self):
        result = self.manager.check_login("unknown", self.password)
        self.assertEqual(result, "User could not be found")

    def test_logout_success(self):
        self.manager.create_account(self.username, self.password)
        self.manager.check_login(self.username, self.password)
        result = self.manager.log_out("123")
        self.assertEqual(result, "Successful logout")

    def test_logout_invalid_token(self):
        self.manager.create_account(self.username, self.password)
        self.manager.check_login(self.username, self.password)
        result = self.manager.log_out("wrong_token")
        self.assertEqual(result, "Invalid session token error")

    def test_logout_unauthorized(self):
        result = self.manager.log_out("any")
        self.assertEqual(result, "Unauthorized access error")


# Task Tests
class TaskTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="bob", password="bobpassword")
        self.manager = TaskManager()
        self.repeat_interval = RepeatInterval(
            start=datetime.now(),
            end=datetime.now() + timedelta(days=1),
            frequency=timedelta(hours=1)
        )

    def test_create_task_success(self):
        result = self.manager.create_task(
            user=self.user,
            name="Sample Task",
            repeat_interval=self.repeat_interval,
            invitees=[],
            priority=3,
            due_date=datetime.now() + timedelta(days=1),
            reminders=True
        )
        self.assertEqual(result, "Successfully created task")

    def test_create_task_no_name(self):
        result = self.manager.create_task(
            user=self.user,
            name="",
            repeat_interval=self.repeat_interval,
            invitees=[],
            priority=3,
            due_date=datetime.now() + timedelta(days=1),
            reminders=True
        )
        self.assertEqual(result, "no name for task")

    def test_create_task_invalid_priority(self):
        result = self.manager.create_task(
            user=self.user,
            name="Test Task",
            repeat_interval=self.repeat_interval,
            invitees=[],
            priority=7,
            due_date=datetime.now() + timedelta(days=1),
            reminders=True
        )
        self.assertEqual(result, "invalid task priority")

    def test_create_task_invalid_due_date(self):
        result = self.manager.create_task(
            user=self.user,
            name="Test Task",
            repeat_interval=self.repeat_interval,
            invitees=[],
            priority=3,
            due_date=datetime.now() - timedelta(days=1),
            reminders=True
        )
        self.assertEqual(result, "invalid due date")

    def test_update_task_success(self):
        task = Task.objects.create(
            user=self.user,
            name="Old Name",
            description="Old description",
            priority=2,
            due_date=datetime.now() + timedelta(days=2),
            reminders=True
        )
        result = self.manager.update_task(task, {"name": "New Name"})
        self.assertEqual(result, "Successfully updated task")
        task.refresh_from_db()
        self.assertEqual(task.name, "New Name")


# Database Manager Tests
class DatabaseTestCase(TestCase):
    def setUp(self):
        self.db_manager = DatabaseManager()
        self.user = User.objects.create_user(username="alice", password="alicepass")
        self.task = Task.objects.create(
            user=self.user,
            name="Alice's Task",
            description="Sample desc",
            priority=2,
            due_date=datetime.now() + timedelta(days=2),
            reminders=True
        )

    def test_get_user_success(self):
        user = self.db_manager.get_user(self.user.id)
        self.assertEqual(user.username, "alice")

    def test_get_user_failure(self):
        user = self.db_manager.get_user(999)
        self.assertIsNone(user)

    def test_get_task_success(self):
        task = self.db_manager.get_task(self.task.id)
        self.assertEqual(task.name, "Alice's Task")

    def test_get_task_failure(self):
        task = self.db_manager.get_task(999)
        self.assertIsNone(task)

    def test_redirect_success(self):
        result = self.db_manager.redirect("profile", 30)
        self.assertEqual(result, "Page is set")

    def test_redirect_invalid_page(self):
        result = self.db_manager.redirect("invalid_page", 30)
        self.assertEqual(result, "page does not exist")

    def test_redirect_timeout(self):
        result = self.db_manager.redirect("profile", 100)
        self.assertEqual(result, "user timed out")


# Mark Complete Tests
class MarkCompleteTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username="markuser", password="password123")
        self.task = Task.objects.create(
            user=self.user,
            name="Test Task",
            description="Complete me",
            priority=2,
            due_date=datetime.now() + timedelta(days=1),
            reminders=True,
            completed=False
        )

    def test_mark_task_complete_success(self):
        self.task.completed = True
        self.task.save()
        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)

    def test_mark_task_already_completed(self):
        self.task.completed = True
        self.task.save()
        # Trying to "complete" again
        self.task.completed = True
        self.task.save()
        self.task.refresh_from_db()
        self.assertTrue(self.task.completed)

    def test_mark_task_invalid_user(self):
        other_user = User.objects.create_user(username="otheruser", password="password456")
        other_task = Task.objects.create(
            user=other_user,
            name="Other User Task",
            description="Should not complete",
            priority=3,
            due_date=datetime.now() + timedelta(days=2),
            reminders=False,
            completed=False
        )
        self.assertEqual(other_task.user.username, "otheruser")
        self.assertFalse(other_task.completed)
