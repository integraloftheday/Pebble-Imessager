/**
 * digit-input for PebbleJS 1.0
 *
 * Usage and license:
 * http://github.com/modrzew/pebblejs-digit-input
 **/

var UI = require('ui');
var Vector2 = require('vector2');

var WIDTH = 144;  // viewport width
var HEIGHT = 168;  // viewport height
var MARGIN = 10;  // left and right margin
var PADDING = 5;  // top and bottom padding
var GAP = 5;  // gap between inputs


function digitInput (options, callback) {
    options = {
        backgroundColor: options.backgroundColor || 'mintGreen',
        fieldTextColor: options.textColor || 'white',
        fieldBackgroundColor: options.fieldBackgroundColor || 'vividCerulean',
        selectedFieldBackgroundColor: options.selectedFieldBackgroundColor || 'shockingPink',
        selectedFieldTextColor: options.selectedFieldTextColor || 'black',
        count: options.count || 5,
        defaultValue: options.defaultValue || 0,
        font: options.font || 'gothic-24-bold'
    };
    options.fontSize = parseInt(options.font.split('-')[1]);
    // Main object
    var window = new UI.Window({
        fullscreen: true,
    });
    // Background
    var windowBackground = new UI.Rect({
        size: new Vector2(144, 168),
        position: new Vector2(0, 0),
        backgroundColor: options.backgroundColor
    });
    window.add(windowBackground);

    var digits = [];  // actual values
    var fields = [];  // UI.Text objects
    var fieldWidth = Math.round((WIDTH - 2 * MARGIN - (options.count - 1) * GAP) / options.count);
    var fieldHeight = options.fontSize + 2 * PADDING;
    var posY = (HEIGHT - fieldHeight) / 2;
    for (var i=0; i<options.count; i++) {
        digits.push(options.defaultValue);
        var posX = MARGIN + i * fieldWidth;
        if (i > 0) {
            posX += GAP * i;
        }
        var field = new UI.Text({
            size: new Vector2(fieldWidth, fieldHeight),
            position: new Vector2(posX, posY),
            font: options.font,
            color: options.fieldTextColor,
            backgroundColor: options.fieldBackgroundColor,
            textOverflow: 'wrap',
            textAlign: 'center',
            text: options.defaultValue
        });
        fields.push(field);
        window.add(field);
    }

    function makeCurrent (index, previousIndex) {
        if (previousIndex !== undefined) {
            fields[previousIndex].backgroundColor(options.fieldBackgroundColor);
            fields[previousIndex].color(options.fieldTextColor);
        }
        fields[index].backgroundColor(options.selectedFieldBackgroundColor);
        fields[index].color(options.selectedFieldTextColor);
    }

    var currentField = 0;
    makeCurrent(currentField);

    function changeValue(index, difference) {
        var newValue = digits[currentField] + difference;
        if (newValue < 0) {
            newValue = 9;
        } else if (newValue > 9) {
            newValue = 0;
        }
        digits[currentField] = newValue;
        fields[currentField].text(newValue);
    }

    window.on('click', 'select', function () {
        if (currentField < options.count - 1) {
            currentField++;
            makeCurrent(currentField, currentField - 1);
        } else {
            callback(digits.join(''));
        }
    });
    window.on('click', 'back', function () {
        if (currentField > 0) {
            currentField--;
            makeCurrent(currentField, currentField + 1);
        } else {
            window.hide();
        }
    });
    window.on('click', 'up', function () {
        changeValue(currentField, 1);
    });
    window.on('click', 'down', function () {
        changeValue(currentField, -1);
    });
    return window;
}


module.exports = {
    digitInput: digitInput
}
