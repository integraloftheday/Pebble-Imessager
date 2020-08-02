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

pip install -r PebbleImessageServer/requirements.txt


if [ $installOption -eq 1 ]
then 
    mkdir PebbleImessageServer/certs
    echo "\n Generating openssl key."
    read -p "Enter Local IP: " localIP
    read -p "Enter Public IP: " publicIP
	openssl genrsa -out PebbleImessageServer/certs/iMessager-ca.key 4096
    openssl req -x509 -new -nodes -key PebbleImessageServer/certs/iMessager-ca.key -sha256 -days 365 -out PebbleImessageServer/certs/iMessager-ca.crt
    openssl genrsa -out PebbleImessageServer/certs/iMessager.key 4096
    echo "[ req ]
prompt             = no
default_bits       = 4096\n
distinguished_name = req_distinguished_name
req_extensions     = req_ext
[ req_distinguished_name ]
organizationName           = PebbleImessager
commonName                 = Imessager
[ req_ext ]
extendedKeyUsage = serverAuth
subjectAltName = @alt_names
[alt_names]
DNS.1 = localhost
IP.1 = $localIP
IP.2 = $publicIP" > PebbleImessageServer/certs/config.cnf
openssl req -new -key PebbleImessageServer/certs/iMessager.key -config PebbleImessageServer/certs/config.cnf -out PebbleImessageServer/certs/iMessager.csr
openssl x509 -req -in PebbleImessageServer/certs/iMessager.csr -CA PebbleImessageServer/certs/iMessager-ca.crt -CAkey PebbleImessageServer/certs/iMessager-ca.key -CAcreateserial -out PebbleImessageServer/certs/iMessager.crt -days 365 -sha256 -extfile PebbleImessageServer/certs/config.cnf -extensions req_ext
echo ""
echo "Install PebbleImessageServer/certs/iMessager-ca.crt on your iPhone. Follow the instructions on the GitHub ReadMe"
fi

echo "Now edit config.json to add contacts, to change the port number, and to set the key" 

echo "Use sh start.sh to start the server"



