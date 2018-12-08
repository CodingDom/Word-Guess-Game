///Where my canvas and important texts are held
var myGameArea = {
    container : document.getElementById('game-container'),
    phrase : document.getElementById('phrase'),
    guesses : document.getElementById('guesses'),
    remainder : document.getElementById('remainder'),
    losses : document.getElementById("losses"),
    wins : document.getElementById('wins'),
    audio : document.createElement('audio'),
    canvas : document.createElement('canvas'),
    start : function() {
        this.container.insertBefore(this.canvas, this.container.children[0]);
        this.canvas.style.position = "relative";
        this.canvas.style.marginLeft = "20px";
        this.canvas.style.height = "75%";
        this.canvas.style.width = "75%";
        this.canvas.style.cssFloat = "left";
        this.context = this.canvas.getContext("2d");
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    },
};

myGameArea.start(); //Preps the canvas

//The player's statistics
var myGameStats = {
    guesses : [],
    remainder : 13,
    losses : 0,
    wins : 0,
    reset : function() {
        for (var i = 0; i < arguments.length; i++) {
            switch (arguments[i]) {
                case "guesses":
                    this.guesses = [];
                break;
                case "remainder":
                    this.remainder = 13;
                break;
                case "losses":
                    this.losses = 0;
                break;
                case "wins":
                    this.wins = 0;
                break;
            };
            //Reseting text
            if (myGameArea[arguments[i]]) {
                myGameArea[arguments[i]].textContent = this[arguments[i]];
            };
        };
    }
};

var songs = [
    {artist:"Michael Jackson",name:"Pretty Young Thing",audio:""},
    {artist:"Michael Jackson",name:"Thriller",audio:""},
    {artist:"Michael Jackson",name:"Remember The Time",audio:""},
    {artist:"Michael Jackson",name:"Man In The Mirror",audio:""},
];

//Size of canvas used for positioning of stand
const canSize = (myGameArea.canvas.height)-10;

//Creating Hangman's stand and stick figure
var hangman = {
    stand: {
        bottom : new component(100, 5, "black", 1, canSize),
        middle : new component(5, 100, "black", 45, canSize-100),
        topPart : new component(100, 5, "black", 40, canSize-105),
        topPart2 : new component(2, 10, "black", 135, canSize-105),
    },
    figure: [
        new component(10, 0, "black", 136, (canSize-85),"circle"),
        new component(3, 27, "black", 135, (canSize-75)),
        new component(20, 3, "black", 160, -35,undefined,(Math.PI*45/180)),
        new component(20, 3, "black", 12, 158,undefined,(Math.PI*45/-180)),
        new component(20, 3, "black", 147, -48,undefined,(Math.PI*45/180)),
        new component(20, 3, "black", 26, 145,undefined,(Math.PI*45/-180)),
    ]
};

//Creating canvas objects
function component(width, height, appearance, x, y, type, angle) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = appearance;
    };
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.update = function() {
        ctx = myGameArea.context;
        //Rotation used for legs/arms
        if (angle) {
            ctx.rotate(angle);
        };

        //Draw piece to canvas
        if (type == "circle") {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.width,this.height,2*Math.PI);
            ctx.fillStyle = appearance;
            ctx.fill();
        }
        else {
        ctx.fillStyle = appearance;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        };

        //Reset angle of canvas
        if (angle) {
            ctx.rotate(-angle);
        };
    };
};

//Draw stand onto canvas
function createStand() {
    var arr = Object.keys(hangman.stand);
    for (var i = 0; i < arr.length; i++) {
        hangman.stand[arr[i]].update();
    };
};

//Restart round
function restart(hardReset) {
    myGameArea.clear(); //Clearing hangman figure
    myGameArea.phrase.innerHTML = ""; //Clearing current word
    createStand();
    if (!hardReset) {
        myGameStats.reset("guesses","remainder");
    }
    else {
        myGameStats.reset("guesses","remainder","wins","losses");
    };
    
}

restart();