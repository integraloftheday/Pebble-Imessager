# Pebble-Imessager
A [PebbleJs](https://github.com/pebble/pebblejs) and Server Application to allow iMessage texting on microphone enabled pebble smartwatches. 

## Demo 
![](Demo.gif)

## About 
Since the takeover by Fitbit pebble smartwatches could no longer send messages on iPhones. However, using this watch app and server 
applications users can once again send iMessage’s from iPhones. To accomplish this the application uses a server running on a Mac (or 
[emulated Mac](https://github.com/foxlet/macOS-Simple-KVM)) to send messages.

## A Security Note 
In the current state all server requests are sent over http which is not encrypted. In the future it is planed 
to update this to https to ensure fully encrypted requests. In the meantime, it is recommended to only use this application over local
networks or use a VPN to establish a secure connection to a local network. 

## Server Installation
### Requirments 
1. A Mac or [emulated Mac](https://github.com/foxlet/macOS-Simple-KVM) with iMessage signed in 
2. Xcode Command Line Tools, Can be installed by typeing `xcode-select --install` in terminal 
3. Python3 (sometimes included in Xcode Command Line Tools or can be installed at (python.org)[https://www.python.org/])
### Steps
The simplest way is to use the install.sh script. It only downloads the required files. 
1. `curl -o install.sh https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/installer.sh` 
2. `sh install.sh` The server should install inside a folder called "PebbleImessageServer" 
3. `cd PebbleImessageServer`
4. `sh start.sh` To run the server 

To keep the server running [screen](http://www.kinnetica.com/2011/05/29/using-screen-on-mac-os-x/) can be used. 
### Configuration 
Inside the `PebbleImessageServer` folder there is a file `config.json` which included everything that needs to configured. The file looks like: 

```json 
{
"key":"abc",
"port":5000,
"contacts":[
	{
		"buddyName":"Demo",
		"displayName":"Demo" 
	}

]
}
```
The `"key"` is generated in the watch app and must be set to the same value. The `"port"` is what port the server runs on and `"contacts"` 
is the list of everyone the watch app can message. Each contact has two fields `"buddyName"` which is the exact name as displayed on the Mac
in iMessages. The `"displayName"` is what name will be displayed in the watch app. As many contacts as needed can be added to `config.json`
below is an example of a config file on port 2020 with 3 contacts. 

```json 
{
"key":"abc",
"port":2020,
"contacts":[
	{
		"buddyName":"Homer Simpson",
		"displayName":"Homer" 
	},
  {
		"buddyName":"Marge Simpson",
		"displayName":"Marge" 
	},
	{
		"buddyName":"Bart Simpson",
		"displayName":"Bart" 
	}
]
}
```

