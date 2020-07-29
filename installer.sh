#!/bin/bash 

echo "Creating Python Virtual Environment"

python3 -m venv PebbleImessageServer

source PebbleImessageServer/bin/activate

echo "Install Options" 
echo "Use http (not encrypted):0" 
echo "Use self signed https (encryped):1"
read -p "Option: " installOption 

echo "Downloading Required Files"
curl -o PebbleImessageServer/app.py https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/app.py
curl -o PebbleImessageServer/config.json https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/config.json
curl -o PebbleImessageServer/requirements.txt https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/requirements.txt
curl -o PebbleImessageServer/start.sh https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/imessageServer/start.sh

echo "\n Generating openssl key."
if [ $installOption -eq 1 ]
then 
	openssl req -x509 -newkey rsa:4096 -nodes -out PebbleImessageServer/cert.pem -keyout PebbleImessageServer/key.pem -days 365
fi

pip install -r PebbleImessageServer/requirements.txt

echo "Now edit config.json to add contacts, to change the port number, and to set the key" 

echo "Use sh start.sh to start the server"



