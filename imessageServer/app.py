from flask import Flask, session, json,request
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
import os.path
import subprocess
import json as js

#getJson
def getConfig():
    config =""
    with open('./config.json') as f:
        config = json.load(f)
    return(config)

#define flask app
app = Flask(__name__)
CORS(app, resources=r'/msg/api*')

#send message 
@app.route('/msg/api/v1/send',methods=['POST'])
def sendMsg():
    config = getConfig() 
    res =""
    postData = request.json
    
    '''postData format:
    {
        "msg":"Some String",
        "to":"Buddy Name on Computer",
        "key":"rudamentary string to check user",
    } 
    '''
    if(postData["key"] != config["key"]):
        print(postData)
        return({"success":"false"},400)

    postData["msg"] = postData["msg"].replace("'","") # need to find a better way to acount for ' like it's 
    msgCommand = "osascript -e \'tell application \"Messages\" to send \"{0}\" to buddy \"{1}\"\'".format(postData["msg"],postData["to"])
    
    try:
        subprocess.check_output(msgCommand,shell=True)
        res = {
            "success":"true"
        }
        return(res,200)
    except: 
        print(postData)
        return({"success":"false"},400)

#get contacts
@app.route("/msg/api/v1/contacts", methods=['POST'])
def getContacts():
    config = getConfig()
    postData = request.json
    
    if(postData["key"] == config["key"]):
        return({"success":"true","contacts":config['contacts']},200)
    else:
        print(postData)
        return({"success":"false"},400)

#get quick replies 
@app.route("/msg/api/v1/replies", methods=['POST'])
def getReplies():
    config = getConfig() 
    postData = request.json
    if(postData["key"] == config["key"]):
        return({"sucess":"true","quickReplies":config["quickReplies"]},200)
    else:
        print(postData)
        return({"success":"false"},400)

@app.route("/msg/api/exception")
def get_exception():
    raise Exception("example")

@app.errorhandler(500)
def server_error(e):
    return "An internal error occured", 500

print("Starting Server")
#Added option for https however ios does not like self signed certificates
if(os.path.isfile('./certs/iMessager.crt') and os.path.isfile('./certs/iMessager.key')):
    print("https:")
    https_server = WSGIServer(('', getConfig()["port"]), app,certfile='./certs/iMessager.crt', keyfile='./cert/iMessager.key')
    https_server.serve_forever()
else:
    print("http:")
    http_server = WSGIServer(('', getConfig()["port"]),app)
    http_server.serve_forever()
