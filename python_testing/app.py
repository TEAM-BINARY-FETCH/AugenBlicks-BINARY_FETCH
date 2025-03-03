from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from auto_suggestion import get_auto_suggestion
import os

load_dotenv()

app = Flask(__name__)

CORS(app)

@app.route('/', methods=['GET'])
def health_check():
    return jsonify({"status": "Backend is working!"})

@app.route('/auto-suggestion', methods=['POST'])
def auto_suggestion():
    try:
        user_input = request.json.get('input', '')

        suggestion = get_auto_suggestion(user_input)

        return jsonify({"suggestion": suggestion})

    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)