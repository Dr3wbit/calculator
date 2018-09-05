
let screen = [];
let repeatOperation = [];
let decimalUsed = false;

function clearAll() {
    screen = [];
    repeatOperation = [];
    decimalUsed = false;
    $('.mathdisplay').remove();
    $('#display').html(screen);
}

$(document).ready(function () {
    $(window).on('keydown', (event) => { keyPressHandeler(event.key) })
    $(".nonoperator").on('click', entryHandler);
    $(".operator").on('click', clickedOperator);
    $(".decimal").on('click', decimalClicked);
    $(".equals").on('click', equalsClicked);
});

function keyPressHandeler(keyPress) {
    let keyValue = checkKeyPress(keyPress);
    if (keyValue) {
        if (isNaN(keyPress) && keyPress !== '.' && keyPress !== 'Backspace') {
            clickedOperator(keyPress);
        } else {
            entryHandler(keyPress);
        }
    }
}

function checkKeyPress(key) {
    return /[0-9]|=|\+|\^|\*|\-|\.|\/|Backspace|Enter/.test(key)
    // (key >= '0' && key <= '9') || key == '+' || key == '^' || key == '*' || key == '-' ||
    //     key == '.' || key == '/' || key == '=' || key == 'Backspace' || key == 'Enter';
}


function entryHandler(keyEntry) {
    let entry
    if (keyEntry.type !== 'click') {
        entry = keyEntry;
    } else {
        entry = this.innerText;
    }

    if (entry === 'C') {
        clearAll();
        return;
    }
    else if (entry === 'CE' || entry === 'Backspace') {
        screen.splice(-1, 1)
    }
    else if (typeof screen[0] === 'number' && screen.length === 1) {
        clearAll();
        screen.push(entry);
    }
    else if (entry === '.') {
        decimalClicked();
        return;
    }
    else if (screen.length >= 0) {
        if (isNaN(screen[screen.length - 1])) {
            screen.push(entry);
        } else {
            screen[screen.length - 1] = screen[screen.length - 1] + entry;
        }
    }
    $('#display').html(screen);
}

function extraOperatorRemoval(){
    if (screen.length === 2 && isNaN(screen[screen.length - 1])) {
        screen.pop();
    }
}

function clickedOperator(keyEntry) {
    extraOperatorRemoval();

    let oppEntry
    if (keyEntry.type !== 'click') {
        oppEntry = keyEntry;
    } else {
        oppEntry = this.innerText;
    }
    decimalUsed = false;

    if ((oppEntry === '=' || oppEntry === 'Enter') && screen.length >= 3) {
        oppEntry === '=';
        equalsClicked();
        $('#display').html(screen);
    }

    else if ((oppEntry === '=' || oppEntry === 'Enter') && screen.length === 3) {
        oppEntry === '=';
            repeatOperation.push(screen[0]);
            repeatOperation.push(screen[1]);
            repeatOperation.push(screen[0]);
        specialEqualsClickedOperation();
        $('#display').html(screen);
    }

    else if (isNaN(screen[screen.length - 1])) {
        screen[screen.length - 1] = oppEntry;
        $('#display').html(screen);

    } else {
        screen.push(oppEntry);
        $('#display').html(screen);
    }
}

function decimalClicked() {
    let lastNum = "";
    if (decimalUsed === true) {
        return;
    } else {
        lastNum = screen[screen.length - 1];
        if (lastNum === undefined || isNaN(lastNum)) {
            screen.push(0 + '.');
            $('#display').html(screen);
            decimalUsed = true;
            return;
        }
        screen.splice(-1, 1);
        screen.push(lastNum + '.');
        decimalUsed = true;
        $('#display').html(screen);
    }
}

function equalsClicked() {
    let doMathPEMDAS = [];
    let returnValue = [];
    extraOperatorRemoval();
    if (screen.length >= 3) {
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
    if (screen.length > 2) {
        equalsClicked();
    }
    if (screen[0] === 1 / 0 || isNaN(screen[0])) {
        screen = 'ERROR'
    }
    $('#display').html(screen);
}

function specialEqualsClickedOperation() {

    if (screen.length === 1 && repeatOperation.length >= 2) {
        screen[0] = doMath(screen[0], repeatOperation[1], repeatOperation[2]);
    }
    else if (screen.length === 1) {
        screen[0] = screen[0];
    }
    else if (screen[1] === '^') {
        screen = Math.pow(screen[0], screen[0]);
    }
    else if (screen.length === 2) {
        screen = [doMath(screen[0], screen[1], screen[0])];
    }
    else if (screen.length === 0 || screen[0] === 0) {
        screen[0] = 0;

    } else {
        screen = 'ERROR';
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
    let maths = ($('<div>', {
        class: "mathdisplay",
        text: `${num1} ${opp} ${num2} = ${output}`
    }));
    let historyLimit = $('div.mathdisplay').length;
    if (historyLimit > 14) {
        $('#rightSideDisplay').children().last().remove();
    }

    $('#rightSideDisplay').prepend(maths)
    changeColor();
    return parseFloat(output);
}

function changeColor() {
    let lastCalculation = $('#rightSideDisplay').children()[0].innerHTML;
    let answerColorChanger = lastCalculation.replace(/\=.*/g, (answer) => {
        return answer.fontcolor('gold')
    })
    $('#rightSideDisplay').children()[0].innerHTML = answerColorChanger;
}