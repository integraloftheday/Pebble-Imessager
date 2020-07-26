/*
  On-screen keyboard implementation
  Created by @jor3l.

  For info, keyboard usage and instructions go to http://github.com/jor3l/pebblejs-keyboard
  
  @author @jor3l
  @version 0.1 RC
  @date 2015.
*/

var UI = require('ui');
var Vector2 = require('vector2');
var availableCharacters = {
    lowerCase: 'abcdefghijklmnopqrstuvwxyz',
    upperCase: 'ABCDEFHIJKLMNOPQRSTUVWXYZ',
    numbers: '0123456789',
    symbols: ' .,:-!?@#'
};

// Vars
var self = null;

// Theming
var letter_y = 138;
var thick_y  = 164;
var bar_y    = 142;
var letter_box = 14;
var thick_left = 126;

var bar_hidden = new Vector2(0, 168);
var bar_visible = new Vector2(0, bar_y);

var Keyboard = function(w) {
  this.winObj = w || false;
  this.activeMode = 'lowerCase';
  this.activeChar = 0;
  this.phrase = '';
  this.callbacks = {};
  this.timer = false;
  
  this.phraseElement = new UI.Text({
    size: new Vector2(124, 10),
    position: new Vector2(4, letter_y),
    text: '',
    color: 'black',
    textOverflow: 'fill',
    textAlign: 'left'
  });
  
  this.charElement = new UI.Text({
    size: new Vector2(letter_box + 1, letter_box),
    position: new Vector2(4, letter_y),
    text: 'a',
    color: 'black',
    textOverflow: 'fill',
    textAlign: 'center'
  });
  
  this.barElement = new UI.Rect({
      size: new Vector2(144, 27),
      position: bar_hidden
  });
  
  if(this.winObj) this.winObj.add(this.barElement);
  self = this;
};

Keyboard.prototype.window = function(w) {
  this.winObj = w;
};

Keyboard.prototype.show = function() {
  if(!this.winObj) return false;
  
  this._bottomBar(); // Displays the area where the user types
  
  // Waits for the bar animation to run
  this._ticker(); // The little line that shows the current letter
  this._showLetter(); // Adds the letter to the screen
  this._bind(); // Binds the event
};

Keyboard.prototype.on = function(ev, callback) {
  this.callbacks[ev] = callback;
};

Keyboard.prototype.upKey = function() {
  this.activeChar -= 1;
  if(this.activeChar < 0) this.activeChar = availableCharacters[this.activeMode].length - 1;
  this.showChar();
};

Keyboard.prototype.downKey = function() {
  this.activeChar += 1;
  if(this.activeChar == availableCharacters[this.activeMode].length) this.activeChar = 0;
  this.showChar();
};

// Shows the active character in the input
Keyboard.prototype.showChar = function() {
  var char = availableCharacters[this.activeMode].substr(this.activeChar, 1);
  this.charElement.text(char);
};

// Displays a white bar at the bottom where the user types
Keyboard.prototype._bottomBar = function() {
  this.barElement.animate({size: this.barElement.size(), position: bar_visible}, 1000);
};

// The ticker is the little line under the active letter
Keyboard.prototype._ticker = function() {
  this.tick = new UI.Rect({
      size: new Vector2(letter_box, 2),
      position: new Vector2(thick_left, 164)
  });
  
  this.winObj.add(this.tick);
  
  setTimeout(function() { timerFunc(); }, 500);
};

Keyboard.prototype._showLetter = function() {
  if(this.winObj) {
    this.winObj.add(this.charElement);
    this.winObj.add(this.phraseElement);
  }
};

Keyboard.prototype.deleteLast = function() {
  this.phrase = this.phrase.substr(0, this.phrase.length - 1);
  this.phraseElement.text(this.phrase);
};

Keyboard.prototype.switchMode = function() {
  this.activeChar = 0;
  
  if(this.activeMode == 'lowerCase') {
    this.activeMode = 'upperCase';
  } else if(this.activeMode == 'upperCase') {
    this.activeMode = 'numbers';
  } else if(this.activeMode == 'numbers') {
    this.activeMode = 'symbols';
  } else { this.activeMode = 'lowerCase'; }
  
  this.showChar();
};

Keyboard.prototype.hide = function() {
  this.activeChar = 0;
  this.activeMode = 'lowerCase';
  this.charElement.text('');
  this.phrase = '';
  this.phraseElement.text('');
  this.callbacks = {};
  this.timer = false;
  
  this.winObj.remove(this.charElement);
  this.winObj.remove(this.barElement);
  this.winObj.remove(this.phraseElement);
};

// Binds the buttons to use the keyboard
Keyboard.prototype._bind = function() {
  this.winObj.on('click', 'up', function() {
    self.upKey();
  });
  
  this.winObj.on('longClick', 'up', function() {
    self.deleteLast();
  });
  
  this.winObj.on('click', 'select', function() {
    var char = availableCharacters[self.activeMode].substr(self.activeChar, 1);
  
    self.phrase += char;
    self.phraseElement.text(self.phrase); // Adds a character to the phrase element
  });
  
  this.winObj.on('longClick', 'select', function() {
    if('text' in self.callbacks) {
      self.callbacks.text(self.phrase);
      // Hides the keyboard
      self.hide();
    }
  });
  
  this.winObj.on('click', 'down', function() {
    self.downKey();
  });
  
  this.winObj.on('longClick', 'down', function() {
    self.switchMode();
  });
};

function timerFunc() {
    self.tick.position(new Vector2(thick_left, thick_y));
    self.charElement.position(new Vector2(thick_left, letter_y));
    
    var color = self.tick.backgroundColor();
    
    if(color == 'white') self.tick.backgroundColor('black');
    else self.tick.backgroundColor('white');
  
    if(self.timer) {
      setTimeout(function() { timerFunc(); }, 500);
    }
}

if (typeof module !== 'undefined') {
  module.exports = Keyboard;
}