from flask import Flask, send_file, jsonify
from flask_cors import CORS
import os

app = Flask(__name__)
CORS(app)  # Enable CORS for all routes

@app.route('/api/playlist')
def get_playlist():
    # Use relative paths from your project directory
    return jsonify([
        {
            "id": "1",
            "title": "Drama",
            "artist": "My Guy",
            "album": "Night Creatures",
            "cover": "./assets/SD_cover1.png",
            "audio": "./assets/drama.mp3"
        }
        # Add more songs as needed
    ])

@app.route('/api/play-audio')
def play_audio():
    audio_path = './assets/drama.mp3'
    if not os.path.exists(audio_path):
        return "Audio file not found", 404
    return send_file(audio_path, mimetype='audio/mp3')

@app.route('/api/album-art')
def album_art():
    image_path = './assets/SD_cover1.png'
    if not os.path.exists(image_path):
        return "Image not found", 404
    return send_file(image_path, mimetype='image/png')

if __name__ == '__main__':
    # Add host and port explicitly
    app.run(host='0.0.0.0', port=5000, debug=True)
