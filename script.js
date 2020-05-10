var tapelength = 5;
var leftmost = 1000;

var turingMachineRules = [];

var currentState = "I";
var accept = false;
var halt = false;

var fuelLevel = 10000;
var autoSpeed = 100;
var autoRunning = false;
var regla = "";

function moveL() {
    var element = document.getElementsByClassName("head")[0];
    if ((Number(element.id) - 1) >= leftmost) {
        element.classList.remove("head");
        var next = Number(element.id) - 1;
        var nextel = document.getElementById(next);
        nextel.classList.add("head");
    } else {
        prependCell();
        prependCell();
        prependCell();
        prependCell();
        moveL();
    }
}

function moveR() {
    var element = document.getElementsByClassName("head")[0];
    if ((Number(element.id) + 1) < (leftmost + tapelength)) {
        element.classList.remove("head");
        var next = Number(element.id) + 1;
        var nextel = document.getElementById(next);
        nextel.classList.add("head");
    } else {
        appendCell();
        appendCell();
        appendCell();
        appendCell();
        moveR();
    }
}

function move(direction) {
    if (direction == "L") moveL();
    if (direction == "R") moveR();
}

function tmWriter(ele) {
    var head = document.getElementsByClassName("head")[0];
    head.innerHTML = ele;
}

function tmReader() {
    var head = document.getElementsByClassName("head")[0];
    return head.innerHTML;
}

function prependCell() {
    var machine = document.getElementById("machine");
    var baby = document.createElement('DIV');
    baby.id = String(leftmost - 1);
    baby.classList.add("cell");
    machine.prepend(baby);
    leftmost -= 1;
    tapelength += 1;
}

function appendCell() {
    var machine = document.getElementById("machine");
    var baby = document.createElement('DIV');
    baby.id = String(leftmost + tapelength);
    baby.classList.add("cell");
    machine.append(baby);
    tapelength += 1;
}

function updateState() {
    document.getElementById("state").innerHTML = currentState;
}

function setup() {
    cleartm();
    var startingString = document.getElementById("startString").value.toUpperCase();
    for (var i = 0; i < startingString.length; i++) {
        tmWriter(startingString[i]);
        moveR();
    }
    var element = document.getElementsByClassName("head")[0];
    element.classList.remove("head");
    var nextel = document.getElementById(leftmost);
    nextel.classList.add("head");

    var markdown = "";
    markdown = regla.toUpperCase();
    markdown = markdown.replace(/\n\s*\n/g, "\n");
    var rules = markdown.split("\n");
    for (var i = 0; i < rules.length; i++) {
        parseRule(rules[i]);
    }

    document.getElementById("state").innerHTML = currentState;

    moveR();
}

function findComment(element) {
    return element == "!";
}

function parseRule(e) {
    if (e.charAt(0) != "!") {
        e = e.replace(/ +(?= )/g, '');
        var parts = e.split(" ");
        var commentPosition = parts.findIndex(findComment); // finding more comments
        if (commentPosition >= 0) {
            parts.length = commentPosition;
        }
        turingMachineRules.push(parts);
    }
}

function cleartm() {
    document.getElementById("state").innerHTML = "";
    document.getElementById("machine").innerHTML = "";

    leftmost = 1000;
    turingMachineRules = [];
    currentState = "I";
    accept = false;
    halt = false;

    var baby = document.createElement('DIV');
    baby.id = String(leftmost);
    baby.classList.add("cell");
    baby.classList.add("head");

    document.getElementById("machine").append(baby)
    tapelength = 1;

    appendCell();
    appendCell();
    appendCell();
    prependCell();
}

function same(ele, read) {
    if (ele == "_" && read == "") {
        console.log("por aca me voy 1");
        return true;
    } else if (ele == read) {
        console.log("por aca me voy 2");
        return true;
    } else {
        console.log("por aca me voy 3");
        return false;
    }
}

function step() {
    if (!halt) {
        var notfound = true;
        console.log(turingMachineRules);
        for (var i = 0; i < turingMachineRules.length; i++) {
            var element = turingMachineRules[i];
            if (element[0] == currentState && same(element[1], tmReader())) {
                currentState = element[2];
                tmWriter(element[3]);
                move(element[4]);
                notfound = false;
                break;
            }
        }

        if (notfound) { halt = true; }

        if (halt) {
            if (currentState == "ACCEPT") {
                accept = true;
                document.getElementById("state").innerHTML = "ACC";
            } else {
                accept = false;
                document.getElementById("state").innerHTML = "HALT";
            }
        }
        updateState();

    }
}

function run() {
    autoSpeed = document.getElementById("autoSpeed").value;

    if (!autoRunning) {
        autoRunning = true;
        setup();
        setTimeout(function() {
            stepWithFuel();
        }, 200);
    }
}

function stepWithFuel() {
    if (!halt) {
        document.getElementById("stepbutton").click();
        setTimeout(function() {
            stepWithFuel();
        }, autoSpeed);
    } else if (!halt) {
        halt = true;
        accept = false;
        document.getElementById("state").innerHTML = "NO FUEL";
        autoRunning = false;
    } else {
        // done
        autoRunning = false;
    }
}


function addMachine() {
    var markdownBox = document.getElementById("markdown");
    var startStringBox = document.getElementById("startString");
    regla = "i b i a r\ni a back b l\n\nback a back a l\nback _ i _ r\n\ni _ accept _ s"
    startStringBox.value = "bbba".toUpperCase();
}

function onload() {
    addMachine();
}