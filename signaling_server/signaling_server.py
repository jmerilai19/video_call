import json
from flask import Flask, request, Response, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

offer_dict = None
answer = None

@app.route('/createoffer', methods=['POST'])
def createoffer():
    global offer_dict

    try:
        request_dict = json.loads(request.data)
    except:
        return Response(status = 416)
    
    offer_dict = request_dict

    return Response(status=201)

@app.route('/getoffer', methods=['GET'])
def getoffer():
    global offer_dict

    if offer_dict is None:
        return Response(status=404)
    
    return Response(json.dumps(offer_dict), status=200)

@app.route('/createanswer', methods=['POST'])
def createanswer():
    global answer

    try:
        request_dict = json.loads(request.data)
    except:
        return Response(status = 416)
    
    answer = request_dict

    return Response(status=201)

@app.route('/getanswer', methods=['GET'])
def getanswer():
    global answer

    if answer is None:
        return Response(status=404)
    
    return Response(json.dumps(answer), status=200)