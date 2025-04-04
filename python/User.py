import Task

class User:
    def __init__(self,
                 username: str,
                 password: str):
        pass

    def authenticate(self, username: str, password: str) -> bool:
        pass

    def verify_login(self):
        pass

    def finish_task(self, task: Task):
        pass