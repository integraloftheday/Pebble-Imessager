/**
 * Welcome to Pebble.js!
 *
 * This is where you write your app.
 */

var UI = require('ui');
var Vector2 = require('vector2');
var ajax = require('ajax');
var Voice = require('ui/voice');
var Settings = require('settings');
var digitInput = require('digit-input.js').digitInput;
//var Clay = require('clay'); removed clay support Could not figure Out how to get it working
//var clayConfig = require('config.json');
//var clay = new Clay(clayConfig, null, {autoHandleEvents:false});

var baseUrl = "http://";
var IP = [[0],[0],[0],[0]];
var Port = 0; 
var key = "ux4I8B8ZLGyPJY3QBAOx";
var sectionCons; 

//Ip functions
function IPget(){
	var inst = new UI.Card({
		title:"Instructions",
		style:"small",
		body:"Enter the server's IP address with 3 digit blocks, Port with 4 digits \"___.___.___.___:____\". Press select",
		scrollable:true
	}); 

	options = {backgroundColor:'white', textColor:'black',fieldBackgroundColor:'white', selectedFieldBackgroundColor:'black', selectedFieldTextColor:'white', count:3}
	var ipInput1 = digitInput(options, function (result) {
                IP[0] = Number(result);
		ipInput1.hide();
		var ipInput2 = digitInput(options, function(result){
			IP[1] = Number(result); 
			ipInput2.hide(); 
			var ipInput3 = digitInput(options,function(result){
				IP[2] = Number(result); 
				ipInput3.hide();
				var ipInput4 = digitInput(options,function(result){
					IP[3] = Number(result); 
					ipInput4.hide();
					optionsP = {backgroundColor:'white', textColor:'black',fieldBackgroundColor:'white', selectedFieldBackgroundColor:'black', selectedFieldTextColor:'white', count:4}
					var portInput = digitInput(optionsP, function(result){
						Port = Number(result); 
						portInput.hide(); 
						ipConf();
					});
					portInput.show();
				});
				ipInput4.show();
			});
			ipInput3.show();
		});
		ipInput2.show();
	});
	inst.show(); 
	inst.on('click','select', function(){
		inst.hide();
		ipInput1.show();
	});
        inst.on('click','back', function(){
                inst.hide();
                settingsMenu.show();
	});
}

function ipConf(){
 	var conf = new UI.Card({
		 title: 'IP:',
		 body:ipToString()+":"+String(Port),
	 	action:{
			select: 'images/checkMark.png'
		 }
	 });
	conf.on('click','select', function(){
		Settings.data('URL',{value:baseUrl+ipToString()+":"+String(Port)});
		conf.hide();
		//settingsMenu.show();
	});
	conf.on('click','back', function(){
		IPget();	
	});

	conf.show();
}

function ipToString(){
	return(String(IP[0]) +'.'+String(IP[1])+'.'+String(IP[2])+'.'+String(IP[3]));
}    

function init(){
	var url = Settings.data('URL');
        var key = Settings.data('key');

	if(url == null){
		IPget();
	}
	if(key == null){
		key.show();
	}

}

function getContacts(){
	var url = Settings.data('URL'); 
	var key = Settings.data('key');
	var postUrl = url.value + "/msg/api/v1/contacts"; 
	ajax({url:postUrl,type:'json',method:'post',data:{'key':key.value}},
		function(data,statusV){
			if(statusV==200){
				Settings.data('contacts',{value:data.contacts});
				sectionCons = menuSections();
        			menu.items(2,sectionCons);
			}
			else{
				errorCon.show();
			}
		},
		function(errorV,statusV){
			errorCon.show();
		}
	);
}

function menuSections(){
	try{
	var contactS = Settings.data('contacts');
	var contacts = contactS.value;
	var sections= []; 
	for(var i =0; i<contacts.length; i++){
		sections.push({
			title:contacts[i].displayName
		});
	}
	return(sections);
	}
	catch(error){
		return([{title:""}]);
	}
}

function keyGen(length){
   var result           = '';
   var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_=';
   var charactersLength = characters.length;
   for ( var i = 0; i < length; i++ ) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
   }
   Settings.data('key',{value:result})
   return result;
}


function msgSend(to){
	var url = Settings.data('URL');
	var key = Settings.data('key');
	var postUrl = url.value + "/msg/api/v1/send";
	Voice.dictate('start',true,function(e){
		if(e.err){
			console.log('Error:'+e.err);
			return; 
		}
		if(e.transcription!=""){
			var msg = e.transcription.replace("'","\'");
			
			ajax({url: postUrl,type:'json',method:'post',data:{"msg":msg,"to":to,"key":key.value}},
				function(data,status){
					//worked
					console.log("success");
				},
				function(errorV,status){
					//error
					//Error Handeling is still not working figure out
					errorMsg.show();
				}
			);}
		});
}
function dispCurrent(){
	var url = Settings.data('URL');
	var key = Settings.data('key');
	var contacts = Settings.data('contacts'); 
	var Current = new UI.Card({
		title:"IP & Key",
		style:'small',
		scrollable:true,
		body:"key:\n"+String(key.value)+"\nUrl:\n"+String(url.value)+"\n Contacts:\n"+JSON.stringify(contacts.value)
	});
	Current.show();
}

var about = new UI.Card({ 
	title:"About",
	body: "This is a simple app built with pebblejs to send sms on iphone", 
	titleColor:"blue" 
});

var errorMsg= new UI.Card({
        title:"Error",
        body: "Error the msg could not be sent. Make sure the server is on and IP and Key are correct."
});

var errorCon = new UI.Card({
	title:"Error",
	body:"Server cannot be reached. Make sure the server is on and IP and Key are correct."
});

function keyShow(){
	var keyV = keyGen(16); 
	var key = new UI.Card({
		title:"Key is:",
		style:'small',
		body:keyV
	});
	key.show(); 
}

var settingsMenu = new UI.Menu({
	sections:[{
		items:[{
			title:'Settings',
			icon:'images/pebble_msg_menu_icon.png'
		},
		{
			title:"Contact Fetch"
		},
		{
			title:'Server IP'
		},
		{
			title:'Key Generate'
		},
		{
			title:'Current'
		}

		]
	}]
});

settingsMenu.on('select',function(e){
	if(e.item.title == "Key Generate"){
		keyShow();
	}
	else if(e.item.title == "Server IP"){
		IPget();
	}
	else if(e.item.title == "Current"){
		dispCurrent();
	}
	else if(e.item.title =="Contact Fetch"){
		getContacts();
	}
});

var menu = new UI.Menu({
    sections: [{
      items: [{
        title: 'iMessager',
        icon: 'images/pebble_msg_menu_icon.png',
        subtitle: 'Settings'
      },
      ]
    }]
  });

menu.on('select',function(e){
	if(e.item.title == "iMessager"){
		//about page
		settingsMenu.show(); 
	}
	else{
		var contacts = Settings.data('contacts');
		msgSend(contacts.value[e.itemIndex].buddyName);	
	}
});

function main(){
	sectionCons = menuSections(); 
	menu.items(2,sectionCons);
	menu.show();
	//init();
}

//Main Start 

main();

