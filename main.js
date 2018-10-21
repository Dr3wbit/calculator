
let screen = [];
let lastOperation = '';
let lastOpperand = '';
let decimalUsed = false;
let equalsUsed = false;

function clearAll() {
    screen = [];
    lastOperation = '';
    lastOpperand = '';
    decimalUsed = false;
    equalsUsed = false;
    $('.mathdisplay').remove();
}

function updateScreen() {
    if (screen[0] === Infinity || screen[0] === "NaN"){
        $('#display').html("ERROR");
        clearAll();
        $('.mathdisplay').remove();
    }
    else if ($('#display')[0].innerText === "ERROR" || screen[0] === undefined) {
        $('#display').html(0)
    }else{
        $('#display').html(screen);
    }
}

$(document).ready(function () {
    $(window).on('keydown', (event) => { keyPressHandeler(event.key) })
    $(".nonoperator, .operator, .decimal, .equals").on('mousedown', entryHandler);
});

function keyPressHandeler(keyPress) {
    let keyValue = checkKeyPress(keyPress);
    if (keyValue) {
        entryHandler(keyPress)
    }
}

function checkKeyPress(key) {
    return /[0-9]|=|\+|\^|\*|\-|\.|\/|Backspace|Enter/.test(key)
}

function entryHandler(keyEntry) {
    let entry = null;
    if (keyEntry.type !== 'mousedown') {
        entry = keyEntry;
    } else {
        entry = this.value;
    }
    switch (entry) {
        case 'C':
            clearAll();
            break;
        case ('Backspace'):
            if (screen.length === 1){
                screen[0] = 0
            }else{
                screen.splice(-1, 1)
            }
            break;
        case '.':
            decimalClicked(entry);
            break;
        case 'Enter':
            equalsClicked();
            break;
        default:
            if ($.isNumeric(entry)) {
                numberHandler(entry);
            } else {
                operatorHandler(entry);
            }
    }
    updateScreen();
}

function numberHandler(number) {
    if (equalsUsed === true){
        screen = [];
    }
    if (screen[0] === "0" && screen.length < 2 ){
        screen[0] = number;
    }
    else if(screen.length >= 0) {
        if (isNaN(screen[screen.length - 1])) {
            screen.push(number);
        } else {
            screen[screen.length - 1] = screen[screen.length - 1] + number;
        }
    }
    lastOpperand = screen[screen.length - 1];
    equalsUsed = false;
}

function operatorHandler(opperator) {
    extraOperatorRemoval();
    decimalUsed = false;
    if (isNaN(screen[screen.length - 1])) {
        screen[screen.length - 1] = opperator;
    } else {
        screen.push(opperator);
    }
    lastOperation = opperator;
    equalsUsed = false;
}

function decimalClicked(decimal) {
    if (decimalUsed === true) {
        return;
    } else {
        let lastEntry = screen[screen.length - 1];
        if (lastEntry === undefined || isNaN(lastEntry)) {
            screen.push(0 + decimal);
            decimalUsed = true;
        } else {
            screen.splice(-1, 1);
            screen.push(lastEntry + decimal);
            decimalUsed = true;
        }
    }
}

function equalsClicked() {
    equalsUsed = true;
    let doMathPEMDAS = [];
    let returnValue = [];
    if ((lastOpperand || lastOperation) === "") {
        return;
    }
    checkForSpecialOperation();
    if (screen.length >= 3) {
        extraOperatorRemoval();
        for (let i = 0; i <= screen.length - 1; i++) {
            if (screen[i] === '^') {
                doMathPEMDAS = screen.splice(i - 1, 3, 'placeHolder');
                returnValue = doMath(doMathPEMDAS[0], doMathPEMDAS[1], doMathPEMDAS[2]);
                screen[i - 1] = returnValue;
            }
        }
        for (let i = 0; i <= screen.length - 1; i++) {
            if (screen[i] === '*' || screen[i] === '/') {
                doMathPEMDAS = screen.splice(i - 1, 3, 'placeHolder');
                returnValue = doMath(doMathPEMDAS[0], doMathPEMDAS[1], doMathPEMDAS[2]);
                screen[i - 1] = returnValue;
            }
        }
        for (let i = 0; i <= screen.length - 1; i++) {
            if (screen[i] === '+' || screen[i] === '-') {
                doMathPEMDAS = screen.splice(i - 1, 3, 'placeHolder');
                returnValue = doMath(doMathPEMDAS[0], doMathPEMDAS[1], doMathPEMDAS[2]);
                screen[i - 1] = returnValue;
            }
        }
    }
    if (screen.length >= 3) {
        equalsClicked();
    } 
}

function extraOperatorRemoval() {
    if (isNaN(screen[screen.length - 1])) {
        screen.pop();
        lastOperation = screen[screen.length - 2]
    }
}

function checkForSpecialOperation() {
    let returnValue = [];
    if (screen.length <= 2) {
        returnValue = doMath(screen[0], lastOperation, lastOpperand);
        if (returnValue === undefined) {
            return;
        } else {
            screen.pop()
            screen[0] = returnValue;
        }
    }
}

function doMath(num1, opp, num2) {
    let output;
    switch (opp) {
        case '+':
            output = (parseFloat(num1) + parseFloat(num2)).toFixed(2);
            break;
        case '-':
            output = (parseFloat(num1) - parseFloat(num2)).toFixed(2);
            break;
        case '/':
            output = (parseFloat(num1) / parseFloat(num2)).toFixed(2);
            break;
        case '*':
            output = (parseFloat(num1) * parseFloat(num2)).toFixed(2);
            break;
        case '^':
            output = Math.pow(parseFloat(num1), parseFloat(num2)).toFixed(2);
            break;
    }
    if (isNaN(output)) {
        return output;
    }
    appendMathHistory(num1,opp,num2,output);
    return parseFloat(output);
}

function appendMathHistory(num1,opp,num2,output){
    let maths = ($('<div>', {
        class: "mathdisplay",
        text: `${num1} ${opp} ${num2} = ${output}`
    }));
    let historyLimit = $('div.mathdisplay').length;
    if (historyLimit > 17) {
        $('#rightSideDisplay').children().last().remove();
    }
    $('#rightSideDisplay').prepend(maths)
    changeColor();
}

function changeColor() {
    let lastCalculation = $('#rightSideDisplay').children()[0].innerHTML;
    let answerColorChanger = lastCalculation.replace(/[^=]*$/, (answer) => {
        return answer.fontcolor('gold');
    })
    $('#rightSideDisplay').children()[0].innerHTML = answerColorChanger;
}