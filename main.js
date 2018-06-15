
var screen = [];
var repeatOperation=[];
var decimalUsed = false;

function clearAll(){
    screen = [];
    repeatOperation=[];
    decimalUsed = false;
    $('#display').html(screen);

}

$(document).ready(function() {
    $(".btn").on('click', clickedNumber);
    $(".operator").on('click', clickedOperator);
    $(".decimal").on('click', decimalClicked);
    $(".equals").on('click', equalsClicked);

});

function clickedNumber(){

    if (this.innerHTML === 'C') {
        clearAll();
        return;
    }
    else if (this.innerHTML === 'DEL'){
        screen.splice(-1,1)
    }
    else if (typeof screen[0] === 'number' && screen.length === 1) {
        clearAll();
        screen.push(this.innerHTML);
    }
    else if (this.innerHTML === '.'){
        decimalClicked();
        return;
    }

    else if (screen.length >= 0){
        if(isNaN(screen[screen.length - 1])) {
            screen.push(this.innerHTML);
        }else{
            screen[screen.length - 1] = screen[screen.length - 1] + this.innerHTML;
        }
    }
    $('#display').html(screen);
}

function clickedOperator() {
    decimalUsed = false;
    if (this.innerHTML === '=' && screen.length >= 3) {
        repeatOperation = screen.slice(screen[screen.length-2]);
        equalsClicked();
        $('#display').html(screen);
    }

    else if (this.innerHTML === '=' && screen.length < 3){
        repeatOperation.push(screen[0]);
        repeatOperation.push(screen[1]);
        repeatOperation.push(screen[0]);
        specialEqualsClickedOperation();
        $('#display').html(screen);
    }

    else if(isNaN(screen[screen.length-1])){
        screen[screen.length-1] = this.innerHTML;
        $('#display').html(screen);

    }else{
        screen.push(this.innerHTML);
        $('#display').html(screen);
    }
}

function decimalClicked(){
    var lastNum = "";
    if (decimalUsed === true) {
        return;
    } else {
        lastNum = screen[screen.length - 1];
        if(lastNum === undefined || isNaN(lastNum)){
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
    var doMathPEMDAS = [];
    var returnValue = [];
    var i = 0;
    if (screen.length >= 3) {
        for (i=0; i<=screen.length-1; i++) {
            if (screen[i] === '^') {
                doMathPEMDAS = screen.splice(i - 1, 3, 'placeHolder');
                returnValue = Math.pow(doMathPEMDAS[0], doMathPEMDAS[2]);
                screen[i - 1] = returnValue;
            }
        }
        for (i=0; i<=screen.length-1; i++){
            if(screen[i] === '*' || screen[i] === '/' ){
                doMathPEMDAS = screen.splice(i-1, 3, 'placeHolder');
                returnValue = doMath(doMathPEMDAS[0], doMathPEMDAS[1], doMathPEMDAS[2]);
                screen[i-1] = returnValue;
            }
        }
        for (i=0; i<=screen.length-1; i++){
            if(screen[i] === '+' || screen[i] === '-' ) {
                doMathPEMDAS = screen.splice(i - 1, 3, 'placeHolder');
                returnValue = doMath(doMathPEMDAS[0], doMathPEMDAS[1], doMathPEMDAS[2]);
                if (isNaN(returnValue)){
                     screen = 'ERROR';
                }else {
                    screen[i - 1] = returnValue;
                }
            }
        }
    }
    if (screen[0] === 1/0 || isNaN(screen[0])){
        screen = 'ERROR'
    }
    $('#display').html(screen);
}

function specialEqualsClickedOperation() {

    if (screen.length === 1 && repeatOperation.length>=2) {
        screen[0] = doMath(screen[0], repeatOperation[1], repeatOperation[2]);
    }
    else if(screen.length === 1){
        screen[0] = screen[0];
    }
    else if (screen[1] === '^'){
        screen = Math.pow(screen[0],screen[0]);
    }
    else if (screen.length === 2) {
        screen = [doMath(screen[0], screen[1], screen[0])];
    }
    else if(screen.length === 0 || screen[0] === 0){
        screen[0] = 0;

    } else {
        screen = 'ERROR';
    }
}
function doMath(num1, opp, num2) {
    var output;
    switch(opp) {
        case '+':
            output = parseFloat(num1) + parseFloat(num2);
            break;
        case '-':
            output = parseFloat(num1) - parseFloat(num2);
            break;
        case '/':
            output = parseFloat(num1) / parseFloat(num2);
            break;
        case '*':
            output = parseFloat(num1) * parseFloat(num2);
    }
    return output;
}