#!/bin/bash 

echo "Creating Python Virtual Environment"

python3 -m venv PebbleImessageServer

source PebbleImessageServer/bin/activate

echo "Downloading Required Files"

curl -o PebbleImessageServer/app.py https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/app.py

curl -o PebbleImessageServer/config.json https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/config.json

curl -o PebbleImessageServer/requirements.txt https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/requirements.txt

pip install -r PebbleImessageServer/requirements.txt

echo "Now edit config.json to add contacts, to change the port number, and to set the key" 

echo "Use sh start.sh to start the server"



