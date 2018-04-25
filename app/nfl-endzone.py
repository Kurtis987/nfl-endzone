import json
import tweepy
from tweepy import OAuthHandler
import config
from flask import Flask, abort, render_template
from pymongo import MongoClient


auth = OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)
auth.set_access_token(config.OAUTH_TOKEN, config.OAUTH_TOKEN_SECRET)

api = tweepy.API(auth)

count = 4
query = 'NFL'


# Get all status
results = [status for status in tweepy.Cursor(api.search, q=query).items(count)]



app = Flask(__name__)

MONGODB_HOST = 'localhost'
MONGODB_PORT = 27017
DBS_NAME = 'nfl'
COLLECTION_ONE = 'individual'
COLLECTION_TWO = 'NFLTeams'
COLLECTION_THREE = 'trivia'

@app.route('/')
def home():
    return render_template('home.html', results=results)
@app.route('/about')
def about():
    return render_template('about.html')
@app.route('/individual')
def individual():
    return render_template('individual.html')
@app.route('/rushing')
def Rushing():
    return render_template('rushing.html')
@app.route('/receiving')
def Receiving():
    return render_template('receiving.html')

@app.route('/sacks')
def Sacks():
    return render_template('sacks.html')
@app.route('/tackles')
def Tackles():
    return render_template('tackles.html')
@app.route('/interceptions')
def Interceptions():
    return render_template('interceptions.html')

@app.route('/team')
def team():
    return render_template('team.html')

@app.route('/trivia')
def trivia():
    return render_template('trivia.html')

@app.route('/trivia/dump')
def getTrivia():
    FIELDS = {
        '_id': False, 'question': True, 'a': True, 'b': True,
        'c': True, 'd': True, 'answer': True
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        try:
            # Define which collection we wish to access
            collection = conn[DBS_NAME][COLLECTION_THREE]
            # Retrieve a result set only with the fields defined in FIELDS
            # and limit the the results to 55000
            trivia = collection.find(projection=FIELDS, limit=5500)

            # Convert projects to a list in a JSON object and return the JSON data
            return json.dumps(list(trivia), separators=(',', ':'))

        except:
            return "no documents found"

@app.route('/stats/dump')
def passing():
    # A constant that defines the record fields that we wish to retrieve.
    FIELDS = {
        '_id': False, 'name': True, 'city': True, 'team': True, 'rushing': True,
        'passing': True, 'receiving': True, 'sacks': True,
        'tackles': True, 'interceptions': True
    }

 # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        try:
            # Define which collection we wish to access
            collection = conn[DBS_NAME][COLLECTION_ONE]
            # Retrieve a result set only with the fields defined in FIELDS
            # and limit the the results to 55000
            players = collection.find(projection=FIELDS, limit=5500)

            # Convert projects to a list in a JSON object and return the JSON data
            return json.dumps(list(players), separators=(',', ':'))

        except:
            return "no documents found"
if __name__ == '__main__':
    app.run(debug=True)