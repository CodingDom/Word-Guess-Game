// function $(id) {
//     var type = id.substr(0,1);
//     console.log(type);
//     id = id.substr(1),id.length;
//     console.log(id);
//     if (type == "#") {
//         return document.getElementById(id);
//     }
// }

var myGameArea = {
    canvas : document.createElement('canvas'),
    start : function() {
        document.getElementById('game-container').appendChild(this.canvas);
        this.canvas.style.position = "relative";
        this.canvas.style.height = "100%";
        this.canvas.style.width = "100%";
        this.canvas.style.backgroundColor = "#F5EFE7";
        this.canvas.style.boxShadow = "0px 0px 3px 1px grey";
        this.context = this.canvas.getContext("2d");
    },
};

//Creating canvas objects
function component(width, height, appearance, x, y, type) {
    this.type = type;
    if (type == "image") {
        this.image = new Image();
        this.image.src = appearance;
    };
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.startX = x;
    this.startY = y;    
    this.update = function() {
        ctx = myGameArea.context;
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
    };
    this.newPos = function() {
        var right = 0;
        var left = 0;
        if ((this.x+this.right) < myGameArea.canvas.width-this.width) {
            right = this.right;
        };
        if ((this.x-this.left) > 5) {
            left = this.left;
        };
        this.x += right+left;
        this.y += (-this.up)+(-this.down); 
        return     
    };    
};


myGameArea.start();
//Hangman stand
console.log(myGameArea.canvas.offsetHeight);
var bottom = new component(100, 5, "black", 1, ((myGameArea.canvas.height)-10));
var middle = new component(5, 100, "black", 45, ((bottom.y))-100);
var topPart = new component(100, 5, "black", 40, ((middle.y))-5);
var topPart2 = new component(2, 10, "black", 135, (topPart.y));

var head = new component(10, 0, "black", 136, (topPart2.y+20),"circle");

console.log((myGameArea.canvas.offsetHeight)/2);
bottom.update();
middle.update();
topPart.update();
topPart2.update();
head.update();