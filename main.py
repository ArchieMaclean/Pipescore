from flask_socketio import SocketIO, send
from flask import Flask, render_template, send_from_directory
import os

app = Flask(__name__)
app.config['SECRET_KEY'] = os.urandom(12)

socketio = SocketIO(app)

@app.route('/')
def home():
    return render_template('index.html')

if __name__=="__main__":
    socketio.run(app)
