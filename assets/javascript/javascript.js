var container = document.getElementById('game-container');

var myGameArea = {
    canvas : document.createElement('canvas'),
    start : function() {
        container.insertBefore(this.canvas, container.children[0]);
        this.canvas.style.position = "relative";
        this.canvas.style.marginLeft = "20px";
        this.canvas.style.height = "75%";
        this.canvas.style.width = "75%";
        this.canvas.style.cssFloat = "left";
        this.context = this.canvas.getContext("2d");
    },
};

myGameArea.start();

const canSize = (myGameArea.canvas.height)-10;

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

        if (type == "image") {
            ctx.drawImage(this.image,
                this.x,
                this.y,
                this.width,
                this.height);
        }
        else if (type == "text") {
            ctx.font = this.width + " " + this.height;
            ctx.fillStyle = appearance;
            //Hover effect
            this.textWidth = ctx.measureText(this.text).width
            if (this.hover && mouse.x && mouse.y) {
                if (this.x+12 <= mouse.x && (this.x+12)+(this.textWidth) >= mouse.x 
                    && this.y-(parseInt(ctx.font.replace("px",''))/2) <= mouse.y && this.y+(parseInt(ctx.font.replace("px",''))/2) >= mouse.y) {                        ctx.fillStyle = "red";
                }
            }
            ctx.fillText(this.text, this.x, this.y);
        }
        else if (type == "circle") {
            ctx.beginPath();
            ctx.arc(this.x,this.y,this.width,this.height,2*Math.PI);
            ctx.fillStyle = appearance;
            ctx.fill();
        }
        else {
        ctx.fillStyle = appearance;
        ctx.fillRect(this.x, this.y, this.width, this.height);
        }
        //Reset angle of canvas
        if (angle) {
            ctx.rotate(-angle);
        }
    };
};

function createStand() {
    var arr = Object.keys(hangman.stand);
    for (var i = 0; i < arr.length; i++) {
        hangman.stand[arr[i]].update();
    };
};

createStand();
