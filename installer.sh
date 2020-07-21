#!/bin/bash 

python3 -m venv PebbleImessageServer

source PebbleImessageServer/bin/activate

curl -o PebbleImessageServer/app.py https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/app.py

curl -o PebbleImessageServer/requirements.txt https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/requirements.txt

pip install -r PebbleImessageServer/requirements.txt


