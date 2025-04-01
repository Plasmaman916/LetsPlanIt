import datetime

class RepeatInterval:
    def __init__(self,
                 start: datetime,
                 end: datetime,
                 frequency: datetime.timedelta):
        self.start = start
        self.end = end
        self.frequency = frequency

    def parse(self, input: str):
        pass

    def next_run(self):
        pass


