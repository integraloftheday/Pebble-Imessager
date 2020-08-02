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
3. [x] Add https for non-local connections. ~~Problem [Apple Certificates](https://support.apple.com/en-us/HT210176)~~
4. [ ] Create a web interface for `config.json`

## Updates

* **7-25-20** : Created ability for Canned Responses. This depends on editing `config.json`  and changing the array `"responses"` within the `"quickReplyies"` object. This can be updated to any length of array responses and appear in such order inside the app. However for those who want direct acess to voice commands `"on"` in `config.json` when set to `"false"` removes all response. With the addition of these Canned Respones `"Current"` in settings was updated to display them and `Contact Fetch` was changed to `Data Fetch`  
* **7-26-20** : Allowed for the Canned Response menu to be fully customizable (allowing setting location of `voice` and `keyboard`. The `keyboard` allows for text input which uses [PebbleJS Keyboard](https://github.com/jor3l/pebblejs-keyboard) as the keyboard module. 
* **8-2-20** : Added https support using [openssl](https://www.openssl.org/) following this [IOS 13 SSL guide](https://jaanus.com/ios-13-certificates/). The installer now has an https option. This option creates the required self-signed certificates needed to encrypt an ip address. After the install is done the user now has to install `iMessager-ca.crt` as a trusted certificate to their iphone. This includeds enabling root acess. 

## A Security Note

~~In the current state all server requests are sent over http which is not encrypted.~~ During install there is an https option which generates self-signed certificates to encrypt all message data. This is the recommended option when installing the software (even on local networks). However, please understand these certificates are self-signed and require the user to install a certificate on their iPhone. Please understand the risks of using self-signed certificates before port forwarding and allowing global acess. 

## Server Installation

### Requirments

1. A Mac or [emulated Mac](https://github.com/foxlet/macOS-Simple-KVM) with iMessage signed in 

2. Xcode Command Line Tools, Can be installed by typeing `xcode-select --install` in terminal 

3. Python3 (sometimes included in Xcode Command Line Tools or can be installed at [python.org](https://www.python.org/))
   
   ### Steps
   
   The simplest way is to use the install.sh script. It only downloads the required files. 

1. `curl -o install.sh https://raw.githubusercontent.com/integraloftheday/Pebble-Imessager/master/installer.sh` 

2. `sh install.sh` Follow the steps on screen answering the prompts as they arise (For https make sure you enter the infromation prompted including the common name which could be something like `"Pebble-Imessager"`. The server should install inside a folder called "PebbleImessageServer" 

3. `cd PebbleImessageServer`

5. **NOTE** if **https** was picked during installation then you have to open `PebbleImessageServer/certs` and send the file `iMessager-ca.crt` to your iPhone. This allows for secure https encryption. To send the file you can email it and then install it by following [this guide](https://help.clouduss.com/ws-knowledge-base/installing-an-ssl-certificate-on-i-os-13). Please make sure the infromation in details is the same as what was entered in step 2. Once installed you can check if it is working by going to `https://yourLocalIp:port` and making sure the `404 page` loads and not a browser error.  

4. `sh start.sh` To run the server 

To keep the server running [screen](http://www.kinnetica.com/2011/05/29/using-screen-on-mac-os-x/) can be used. 
* `screen` then press enter 
* `sh start.sh` then to exit press the keys `[Ctrl] a d` 

### Configuration

Inside the `PebbleImessageServer` folder there is a file `config.json` which included everything that needs to configured. The file looks like: 

```json
{
"key":"abc",
"port":5000,
"quickReplies":{
    "on":"true", 
    "responses":[
        "<Voice>",
        "yes",
        "no",
        "<Keyboard>"    
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
  
  * `"responses"` is the array of all canned responses. (Show up in order)
    
    * `"<Voice>"` is where the voice input option is displayed
    
    * `"<Keyboard>"` is where the keyboard option ins displayed

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
        "<Voice>",
        "yes",
        "no",
        "<Keyboard>"  
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

2. ~~A [rebble voice subscription](https://rebble.io)~~ (Only required for voice respones)
   
### Side Loading

1. Downloaded the latest .pbw file from the [releases](https://github.com/integraloftheday/Pebble-Imessager/releases) on your phone. 

2. Click the share icon then "more" then select "Copy to Pebble"

The pebble app then will install the watch app. 

### Watch App Configuration

These steps must be done before the watch app can be used. 

1. Click "Settings" and scroll to "Server IP" select and enter the Server's IP address and Port Number. **NOTE** when choosing http or https it must match the server configuration set up above.
2. Click "key Generate" and updated `config.json` to match the key displayed on the watch app 
3. Click "Data Fetch" to update the watches internal contacts and canned responses. This can be done after any update to `config.json`
4. Click "Current" if everything was entered correctly and working the server IP the key and any contacts should be displayed.
5. Send Messages! by clicking on the contacts name on the main menu. 
