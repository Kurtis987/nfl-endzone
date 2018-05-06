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

@app.route('/standings')
def standings():
    return render_template('standings.html')

@app.route('/trivia')
def trivia():
    return render_template('trivia.html')

@app.route('/total-offense')
def totalOffense():
    return render_template('offense-team-total.html')
@app.route('/team-passing')
def teamPassing():
    return render_template('offense-team-passing.html')
@app.route('/team-rushing')
def teamRushing():
    return render_template('offense-team-rushing.html')
@app.route('/team-receiving')
def teamReceiving():
    return render_template('offense-team-receiving.html')

@app.route('/total-defense')
def totalDefense():
    return render_template('defense-team-total.html')
@app.route('/passing-allowed')
def passingAllowed():
    return render_template('defense-team-passing.html')
@app.route('/rushing-allowed')
def rushingAllowed():
    return render_template('defense-team-rushing.html')
@app.route('/receiving-allowed')
def receivingAllowed():
    return render_template('defense-team-receiving.html')
@app.route('/fans-avg')
def fansAvg():
    return render_template('fans-avg.html')
@app.route('/fans-total')
def fansTotal():
    return render_template('fans-total.html')





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
def individualStats():
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
            data = json.dumps(list(players), separators=(',', ':'))
            return data
        except:
            return "no documents found"

@app.route('/team/dump')
def teamStats():
    # A constant that defines the record fields that we wish to retrieve.
    FIELDS = {
        '_id': False, 'city': True, 'name': True, 'wins': True, 'losses': True,
        'stadium-roof': True, 'offenseTotal': True, 'offensePassing': True, 'offenseRushing': True,
        'offenseReceiving': True, 'defenseTotal': True, 'defensePassing': True,
        'defenseRushing': True, 'defenseReceiving': True, 'fansAvgPerGame': True,
        'fansSeasonTotal': True
    }

    # Open a connection to MongoDB using a with statement such that the
    # connection will be closed as soon as we exit the with statement
    with MongoClient(MONGODB_HOST, MONGODB_PORT) as conn:
        try:
            # Define which collection we wish to access
            collection = conn[DBS_NAME][COLLECTION_TWO]
            # Retrieve a result set only with the fields defined in FIELDS
            # and limit the the results to 55000
            teams = collection.find(projection=FIELDS, limit=5500)
            # Convert projects to a list in a JSON object and return the JSON data
            data = json.dumps(list(teams), separators=(',', ':'))
            return data
        except:
            return "no documents found"
if __name__ == '__main__':
    app.run()