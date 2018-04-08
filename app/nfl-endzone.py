import json
import tweepy
from tweepy import OAuthHandler
import config
from flask import Flask, abort, render_template


auth = OAuthHandler(config.CONSUMER_KEY, config.CONSUMER_SECRET)
auth.set_access_token(config.OAUTH_TOKEN, config.OAUTH_TOKEN_SECRET)

api = tweepy.API(auth)

count = 4
query = 'NFL'


# Get all status
results = [status for status in tweepy.Cursor(api.search, q=query).items(count)]

print(json.dumps(results[0]._json, indent=4))

for status in results:
    print("Divider Separator")
    print(status.text.encode('utf-8'))
    print(status.user.id)
    print(status.user.screen_name)
    print(status.user.profile_image_url_https)
    print(status.user.followers_count)
    print(status.place)


app = Flask(__name__)

@app.route('/')
def home():
    return render_template('home.html', results=results)
if __name__ == '__main__':
    app.run(debug=True)