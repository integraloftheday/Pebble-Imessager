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
2. [x] Add Canned Responses 
3. [ ] Add Https for non-local connections
4. [ ] Create a web interface for `config.json`



## Updates

* **7-25-20** : Created ability for Canned Responses. This depends on editing `config.json`  and changing the array `"responses"` within the `"quickReplyies"` object. This can be updated to any length of array responses and appear in such order inside the app. However for those who want direct acess to voice commands `"on"` in `config.json` when set to `"false"` removes all response. With the addition of these Canned Respones `"Current"` in settings was updated to display them and `Contact Fetch` was changed to `Data Fetch`  
* **7-26-20** : Allowed for the Canned Response menu to be fully customizable (allowing setting location of `voice` and `keyboard`. The `keyboard` allows for text input which uses [PebbleJS Keyboard](https://github.com/jor3l/pebblejs-keyboard) as the keyboard module. 

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
4. `curl -o install.sh https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/installer.sh` 
5. `sh install.sh` The server should install inside a folder called "PebbleImessageServer" 
6. `cd PebbleImessageServer`
7. `sh start.sh` To run the server 

To keep the server running [screen](http://www.kinnetica.com/2011/05/29/using-screen-on-mac-os-x/) can be used. 

### Configuration

Inside the `PebbleImessageServer` folder there is a file `config.json` which included everything that needs to configured. The file looks like: 

```json
{
"key":"abc",
"port":5000,
"quickReplies":{
	"on":"true", 
	"responses":[
		"yes",
		"no"	
	]
},
"contacts":[
	{
		"buddyName":"Demo",
		"displayName":"Demo" 
	}
]
}

```

* `"key"` is generated in the watch app and must be set to the same value.

* `"port"` is what port the server runs on

* `"quickReplies"` is for configuring quick replies (canned responses) to messages 
  
  * `"on"` when set to `"true"` enables quick replies `"false"` only uses voice
  
  * `"responses"` is the array of all canned responses

* `"contacts"` is the list of everyone the watch app can message. 
  
  * `"buddyName"` is the name displayed on the Mac in iMessages (On the top where it says "To:Some Name")
  
  * `"displayName"`  is what will be displayed in the WatchApp
  
  **Note** when editing `config.json` restarting the server is not needed
  unless the `"port"` has be edited.

```json
{
"key":"abc",
"port":2020,
"quickReplies":{
	"on":"true", 
	"responses":[
		"yes",
		"no"	
	]
},
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
3. Downloaded the latest .pbw file from the [releases](https://github.com/integraloftheday/Pebble-Imessager/releases) on your phone. 
4. Click the share icon then "more" then select "Copy to Pebble"

The pebble app then will install the watch app. 

### Watch App Configuration

These steps must be done before the watch app can be used. 

1. Click "Settings" and scroll to "Server IP" select and enter the Server's IP address and Port Number
2. Click "key Generate" and updated `config.json` to match the key displayed on the watch app 
3. Click "Data Fetch" to update the watches internal contacts and canned responses. This can be done after any update to `config.json`
4. Click "Current" if everything was entered correctly and working the server IP the key and any contacts should be displayed.
5. Send Messages! by clicking on the contacts name on the main menu. 
