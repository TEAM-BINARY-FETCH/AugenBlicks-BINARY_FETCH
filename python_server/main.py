from flask import Flask
from generate_script.generate import GenerateScript
from flask import request as req
import json
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  
script_generator = GenerateScript()

@app.route("/generate/script", methods=['POST'])
def hello_world() : 
  print("Request received")
  title = req.form.get("title", "")
  instructions = req.form.get("instructions", "")
  summary = req.form.get("summary", "")

  if title == "" or summary == "" : 
    return "Title and summary must be provided"
  
  response = script_generator.generate_script(title, summary, instructions)
  print(response)
  return response

