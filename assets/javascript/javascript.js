///Where my canvas and important texts are held
var myGameArea = {
    container : document.getElementById('game-container'),
    phrase : document.getElementById('phrase'),
    guesses : document.getElementById('guesses'),
    remainder : document.getElementById('remainder'),
    losses : document.getElementById("losses"),
    wins : document.getElementById('wins'),
    cover : document.getElementById('current'),
    title : document.getElementById('song-title'),
    audio : document.createElement('audio'),
    canvas : document.createElement('canvas'),
    start : function() {
        this.container.insertBefore(this.canvas, this.container.children[0]);
        this.canvas.style.position = "relative";
        this.canvas.style.marginLeft = "20px";
        this.canvas.style.height = "70%";
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
    currentSong: [],
    guesses : [],
    remainder : 6,
    losses : 0,
    wins : 0,
    reset : function() {
        for (var i = 0; i < arguments.length; i++) {
            switch (arguments[i]) {
                case "guesses":
                    this.guesses = [];
                break;
                case "remainder":
                    this.remainder = 6;
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
    {artist:"Michael Jackson",name:"Pretty Young Thing",audio:"assets/audio/pretty.mp3",cover:"assets/images/pretty.jpg"},
    {artist:"Michael Jackson",name:"Thriller",audio:"assets/audio/thriller.mp3",cover:"assets/images/thriller.jpg"},
    {artist:"Michael Jackson",name:"Remember The Time",audio:"assets/audio/remember.mp3",cover:"assets/images/remember.jpg"},
    {artist:"Michael Jackson",name:"Man In The Mirror",audio:"assets/audio/mirror.mp3",cover:"assets/images/mirror.jpg"},
    {artist:"Michael Jackson",name:"Rock With You",audio:"assets/audio/rock.mp3",cover:"assets/images/rock.jpg"},
    {artist:"Michael Jackson",name:"Dont Stop Til You Get Enough",audio:"assets/audio/dont-stop.mp3",cover:"assets/images/dont-stop.jpg"},
    {artist:"Michael Jackson",name:"Billie Jean",audio:"assets/audio/billie.mp3",cover:"assets/images/billie.jpg"},
];

//Size of canvas used for positioning of stand
const canSize = (myGameArea.canvas.height)-10;

//The current song's index
var songIndex = 0;

//Creating Hangman's stand and stick figure
var hangman = {
    stand: {
        bottom : new component(100, 5, "black", 1, canSize),
        middle : new component(5, 100, "black", 45, canSize-100),
        topPart : new component(100, 5, "black", 40, canSize-105),
        topPart2 : new component(2, 10, "black", 135, canSize-105),
    },
    figure: [
        new component(10, 0, "black", 136, (canSize-85),"circle"), //Head
        new component(3, 27, "black", 135, (canSize-75)), //Torso
        new component(20, 3, "black", 160, -35,undefined,(Math.PI*45/180)), //Right Leg
        new component(20, 3, "black", 12, 158,undefined,(Math.PI*45/-180)), //Left Leg
        new component(20, 3, "black", 147, -48,undefined,(Math.PI*45/180)), //Right Arm
        new component(20, 3, "black", 26, 145,undefined,(Math.PI*45/-180)), //Left Arm
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

//To randomize the song list
function shuffle(array) {
    var currentIndex = array.length; 
    var temporaryValue, randomIndex;
  
    //While there remain elements to shuffle...
    while (0 !== currentIndex) {
        //Pick a random number 0 through the index length
        randomIndex = Math.floor(Math.random() * currentIndex);
        
        //Grab current index
        currentIndex -= 1;
    
        //Swap current value with the random value.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }
  
    return array;
}

//Takes song object and sets up the gameplay for it
function songSetUp(song) {
    myGameStats.currentSong = song.name.split(" ");
    myGameStats.currentSong.forEach(function(word) {
        var newWord = document.createElement('h1');
        word.split("").forEach(function() {
            newWord.textContent += "_";
        });
        myGameArea.phrase.appendChild(newWord);
    }); 
};

function soundEffect(name) {
    const location = "assets/audio/fx_";
    var fx = document.createElement('audio');
    fx.src = location + name;
    fx.play();
    fx.remove();
    fx = null;
}

var debounce = false; //Waits for win/loss to finish registering
//Checks each word for the guessed letter
function checkGuess(guess) {
    if (debounce) { return; }; //If currently doing lose/win effect then stop running function
    var wordIndex = 0;
    var correct = false;
    var filledWords = 0;
    myGameStats.currentSong.forEach(function(word) {
        for (var i = 0; i < word.length; i++) {
            if (word[i].toLowerCase() == guess) {
                correct = true;
                const text = myGameArea.phrase.children[wordIndex].textContent;
                if (text[i] != "_") { //Checks if correct letter was already guessed earlier
                    correct = "checkedAlready";
                };
                myGameArea.phrase.children[wordIndex].textContent = text.substring(0,i) + myGameStats.currentSong[wordIndex][i] + text.substr(i+1);
            };
        };
        //Checking for any remaining underscores
        if (myGameArea.phrase.children[wordIndex].textContent.indexOf("_") < 0) {
            filledWords++;
        }
        wordIndex++;
    });

    guess = guess.toUpperCase();
    //Reduce remainder while added onto hangman figure
    if (!correct && myGameStats.guesses.indexOf(guess) == -1) {
        myGameStats.guesses.unshift(guess);
        myGameArea.guesses.textContent = myGameStats.guesses;
        hangman.figure[6-myGameStats.remainder].update();
        myGameStats.remainder--;
        myGameArea.remainder.textContent = myGameStats.remainder;
        soundEffect('zap.mp3');
    }
    else if (correct == true) {
        soundEffect('blop.mp3');
    } 

    //Checks if all words are complete, then gives win 
    if (filledWords >= wordIndex) {
        debounce = true;
        myGameStats.wins++;
        myGameArea.wins.textContent = myGameStats.wins;
        myGameArea.title.textContent = songs[songIndex-1].artist + " - " + songs[songIndex-1].name;
        myGameArea.cover.style.backgroundImage = "url(" + songs[songIndex-1].cover + ")";
        myGameArea.cover.style.visibility = "visible";
        myGameArea.audio.src = songs[songIndex-1].audio;
        myGameArea.audio.volume = 0.8;
        myGameArea.audio.play();
        myGameArea.phrase.style.color = "green";
        soundEffect('correct.mp3');
        setTimeout(function() {
            restart();
            myGameArea.phrase.style.color = "black";
            debounce = false;
        },3000);
    }
    else if (myGameStats.remainder <= 0) { //Gives loss if remaining guesses is 0
        debounce = true;
        myGameStats.losses++;
        myGameArea.losses.textContent = myGameStats.losses;
        myGameArea.phrase.style.color = "red";
        soundEffect('incorrect.mp3');
        setTimeout(function() {
            restart();
            myGameArea.phrase.style.color = "black";
            debounce = false;
        },3000);
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
        shuffle(songs);
    };
    if (songIndex >= songs.length) {
        songIndex = 0;
    };
    songSetUp(songs[songIndex]);
    songIndex++;
};

restart(true);

document.onkeyup = function(event) {
    if (event.keyCode >= 65 && event.keyCode <= 90) {
        checkGuess(event.key);
    };
};