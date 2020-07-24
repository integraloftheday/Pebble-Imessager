# Pebble-Imessager
A [PebbleJs](https://github.com/pebble/pebblejs) and Server Application to allow iMessage texting on microphone enabled pebble smartwatches. 

## Demo 
![](Demo.gif)

## About 
Since the takeover by Fitbit pebble smartwatches could no longer send messages on iPhones. However, using this watch app and server 
applications users can once again send iMessage’s from iPhones. To accomplish this the application uses a server running on a Mac (or 
[emulated Mac](https://github.com/foxlet/macOS-Simple-KVM)) to send messages.

## Branch Notes 
This is the development branch of Pebble-Imessager to process changes before pusing to the main branch. 

## TO-DO 
1. [x] Create Documentation 
2. [ ] Add Canned Responses 
3. [ ] Add Https for non-local connections

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
below is an example of a config file on port 2020 with 3 contacts. **Note** when editing `config.json` restarting the server is not needed
unless the `"port"` has be edited. 

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
## Watch Installation 
Currently the watch app needs to be sideloaded but could be added to the rebble store in the future. 
### Requirements 
1. A microphone enabled pebble watch 
2. A [rebble voice subscription](https://rebble.io)
### Side Loading 
1. Downloaded the latest .pbw file from the [releases](https://github.com/integraloftheday/Pebble-Imessager/releases) on your phone. 
2. Click the share icon then "more" then select "Copy to Pebble"

The pebble app then will install the watch app. 
### Watch App Configuration 
These steps must be done before the watch app can be used. 
1. Click "Settings" and scroll to "Server IP" select and enter the Server's IP address and Port Number
2. Click "key Generate" and updated `config.json` to match the key displayed on the watch app 
3. Click "Contact Fetch" to update the watches internal contacts. This can be done after any update to `config.json`
4. Click "Current" if everything was entered correctly and working the server IP the key and any contacts should be displayed.
5. Send Messages! by clicking on the contacts name on the main menu. 

