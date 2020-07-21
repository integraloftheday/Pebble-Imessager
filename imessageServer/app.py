from flask import Flask, session, json,request
from flask_cors import CORS
from gevent.pywsgi import WSGIServer
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

@app.route('/msg/api/v1/send',methods=['POST'])
def sendMsg():
    config = getConfig() 
    res =""
    postData = request.json
    print(postData)
    '''postData format:
    {
        "msg":"Some String",
        "to":"Buddy Name on Computer",
        "key":"rudamentary string to check user",
    } 
    '''
    if(postData["key"] != config["key"]):
        res = {
            "success":"false"
        }
        return(res,400)

    postData["msg"] = postData["msg"].replace("'","") # need to find a better way to acount for ' like it's 
    msgCommand = "osascript -e \'tell application \"Messages\" to send \"{0}\" to buddy \"{1}\"\'".format(postData["msg"],postData["to"])
    
    try:
        subprocess.check_output(msgCommand,shell=True)
        res = {
            "success":"true"
        }
        return(res,200)
    except: 
        res = {
            "success":"false"
        }
        return(res,400)
    #cmdOut = os.popen(msgCommand).read()
    #result = subprocess.run([msgCommand], stdout=subprocess.PIPE)
    #cmdOut = result.stdout.decode('utf-8')

@app.route("/msg/api/v1/contacts", methods=['POST'])
def getContacts():
    config = getConfig()
    postData = request.json
    print(postData)
    if(postData["key"] == config["key"]):
        return({"success":"true","contacts":config['contacts']},200)
    else:
        return({"success":"false"},400)

@app.route("/msg/api/exception")
def get_exception():
    raise Exception("example")

@app.errorhandler(500)
def server_error(e):
    #logging.exception('An error occurred during a request. %s', e)
    return "An internal error occured", 500

http_server = WSGIServer(('', getConfig()["port"]), app)
http_server.serve_forever()


