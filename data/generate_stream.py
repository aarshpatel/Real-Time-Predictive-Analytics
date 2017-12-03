import pandas as pd
import time
import pyrebase
import math
import logging
from twilio.rest import Client

class ComputeProbability:
    def __init__(self, window_size):
        self.window_size = window_size
        self.history = []
        self.df = pd.read_csv("fault_errors_final.csv")
        self.dp_array = []
        self.firebase, self.token = self.init_firebase()
        self.logger = self.setup_logging()
        account_sid = "AC8b677b6d4c1734a8158f94eca0b296b1"
        auth_token  = "cfba1f36e6c9b60d4547f54b571885a0"
        self.client = Client(account_sid, auth_token)
        self.iscooldown = False

    def twiliotext(self,index, prob,treshhold):
        if not self.iscooldown:
            message = self.client.messages.create(
                    to="+14134046003", 
                    from_="+12486483579",
                    body=("There's a potential ERROR!",prob))
            self.iscooldown = True
            print ("There's a potential ERROR! " + str(index),prob,treshhold,self.iscooldown)
    

    def setup_logging(self):
        logger = logging.getLogger(__name__)
        logger.setLevel(logging.INFO)

        # create a file handler
        handler = logging.FileHandler('../streaming_data.log')
        handler.setLevel(logging.INFO)

        # create a logging format
        formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')
        handler.setFormatter(formatter)

        # add the handlers to the logger
        logger.addHandler(handler)

        return logger 

    def init_firebase(self):
        config = {
            "apiKey": "AIzaSyCQB7zrf81BKMHP1ZMXcBZvvZn5NVfS_kU",
            "authDomain": "yhack-187804.firebaseapp.com",
            "databaseURL": "https://yhack-187804.firebaseio.com",
            "projectId": "yhack-187804",
            "storageBucket": "yhack-187804.appspot.com",
            "messagingSenderId": "909982270042"
        } 
        firebase = pyrebase.initialize_app(config) 
        auth = firebase.auth()
        user = auth.sign_in_with_email_and_password("411cru@gmail.com", "Aarshisabitch123")
        return firebase, user['idToken']

    def compute_error_probability(self, index, data_point):
        if len(self.history) >= self.window_size:
            self.history.pop(0)
        self.history.append(data_point[-1])

        total = 0
        for status in self.history:
            if status == 1:
                total += 1

        dp = data_point.tolist()
        treshhold = 0.85
        prob = float(total) / self.window_size
        dp.append(float(total) / self.window_size)
        if prob > treshhold:
            self.twiliotext(index, prob,treshhold)
        if dp[-2] < 1:
            self.iscooldown = False
            print(self.iscooldown,dp[-2])
        
        return dp

    def get_data_points(self):                
        for idx, row in self.df.iterrows():
            time.sleep(1)
            dp = self.compute_error_probability(idx, row)
            yield dp

    def stream_data_points(self):
        for point in self.get_data_points():
            self.add_to_firebase(point)

    def add_to_firebase(self, data_point):
        # Get a database reference to our blog.
        db = self.firebase.database()

        keys = ['Occurred', u'StudID', u'Fault Number', u'Fault Trigger', u'Fixed',
        u'Duration', u'Reason', u'Description', u'Extended description',
        u'Operation Mode', u'Success', u'Prob']
        new_data_points = []
        for point in data_point:
            try:
                result = math.isnan(float(point))
            except:
                new_data_points.append(point)
            else:
                if result:
                    new_data_points.append(None)
                else: 
                    new_data_points.append(point)

        # data_point = [None if math.isnan(float(point)) else point for point in data_point]
        data_point = dict(zip(keys, new_data_points))
        self.logger.info(str(data_point))
        db.child("streaming-data").push(data_point, self.token)
        
if __name__ == '__main__':
    cp = ComputeProbability(7)
    cp.stream_data_points()

