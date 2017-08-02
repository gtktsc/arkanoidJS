 "use strict";

(function() {
    var canvas = document.getElementById('canvas'),
        context = canvas.getContext('2d');
    var canvasWidth = document.getElementById('canvas-wrapper').offsetWidth;
    var canvasHeight = document.getElementById('canvas-wrapper').offsetHeight;
    var head;
    var ball;
    var tail = [];
    var block=[];
    var animation;
    var ballMove;
    var color;
    var blockSize = Math.floor(canvasWidth/30);
    var backgroundTile=[];
    var backgroundColor = "white";
    var backgroundLine = blockSize/3;
    var backgroundLineColor = "#505A69";
    var sumX = (Math.floor(canvasWidth / blockSize)%2==0?sumX = Math.floor(canvasWidth / blockSize) : sumX = Math.floor(canvasWidth / blockSize)-1);
    var sumY = (Math.floor(canvasHeight / blockSize)%2==0?sumY = Math.floor(canvasHeight / blockSize) : sumY = Math.floor(canvasHeight / blockSize)-1);

    function restart(){
        head = new Rectangle ( (Math.floor(sumX)/2) * blockSize , (sumY)* blockSize-blockSize , "#A6A099" , -1);
        setColor();
        ball= new Ball((Math.floor(sumX)/2) * blockSize,blockSize*6,0);

        var nrblock=0;
        for(var nrX=0;nrX<Math.floor(sumX)/3;nrX+=1.5){
            for(var nrY=0;nrY<6;nrY+=2){
            block[nrblock]= new Rectangle (blockSize*3*nrX,blockSize*nrY,color,nrblock);
            nrblock++;
            };
        setColor();
        };

        var nr=0;
        for(var nrX=0;nrX<sumX;nrX++){
            for(var nrY=0;nrY<sumY;nrY++){
            backgroundTile[nr]= new Rectangle (blockSize*nrX,blockSize*nrY,backgroundColor,nr);
            backgroundTile[nr].isBackground=true;
            backgroundTile[nr].direction="none";
            nr++;
            };
        };
        clearInterval(ballMove);
        clearInterval(animation);
        animation = setInterval(draw , 20);
        ballMove = setInterval(moveObjects , 30);
    };
    function setColor(){
        switch(Math.floor(Math.random() * (5))){
            case 0:
                color = "#FA575C";
            break;
            case 1:
                color = "#47ADA0";
            break;
            case 2:
                color = "#8F63BF";
            break;
            case 3:
                color = "#FFC90A";
            break;
            case 4:
                color = "#FF823B";
            break;
        };
    };
    function resizeCanvas() {
        canvasWidth = document.getElementById('canvas-wrapper').offsetWidth;
        canvasHeight = document.getElementById('canvas-wrapper').offsetHeight;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
        sumX = (Math.floor(canvasWidth / blockSize)%2==0?sumX = Math.floor(canvasWidth / blockSize) : sumX = Math.floor(canvasWidth / blockSize)-1);
        sumY = (Math.floor(canvasHeight / blockSize)%2==0?sumY = Math.floor(canvasHeight / blockSize) : sumY = Math.floor(canvasHeight / blockSize)-1);

        restart();
    };
    function draw() {
        context.beginPath();
        context.clearRect(0 , 0 , canvasWidth , canvasHeight);
        context.rect(0 , 0 , canvasWidth , canvasHeight);
        context.fillStyle = 'white';
        context.fill();
        context.closePath();
        drawBackground();
        drawblock();
        ball.draw();
        head.draw();
    };
    function drawBackground(){
        for(var nr=0;nr<backgroundTile.length;nr++){
            backgroundTile[nr].draw();
        };
    }
    function drawblock(){
        for(var nr=0;nr<block.length;nr++){
            block[nr].draw();
        };
    }
    function Rectangle(x , y , color ,  number){
        this.x = x;
        this.y = y;
        this.isBackground=false;
        this.direction = "down";
        this.number = number;
        this.size = blockSize;
        this.centerX = x+this.size/2;
        this.centerY = y+this.size/2;
        this.color = color;
        this.visibility=true;
        this.draw = function() {
            if(this.visibility){
                context.beginPath();
                context.fillStyle = this.color;
                if(this.isBackground){
                    context.fillStyle = backgroundLineColor;
                    context.rect(this.x+backgroundLine , this.y+backgroundLine , blockSize-backgroundLine*2 , blockSize-backgroundLine*2);
                }else{
                    context.rect(this.x , this.y , this.size*3 , this.size);
                };
                context.fill();
                context.closePath();
            };
        };
    };
    function moveObjects(){
        if(ball.x<ball.r || ball.x>=sumX*blockSize){
            ball.direction=ball.direction*-1;
        }else if(ball.y<ball.r){
            ball.direction=180-ball.direction;
        }else if((ball.y+ball.r>=head.y && ball.y+ball.r<=head.y + blockSize/2) &&
             (ball.x+3*ball.r>=head.x && ball.x<=head.x+3*blockSize)){
            ball.direction=180-ball.direction;
            ball.v+=0.2;
        }else if(ball.y>head.y+ blockSize){
            restart();
        }
        for(var paddle in block){
            if(block[paddle].visibility &&
                (ball.y+2*ball.r>=block[paddle].y && ball.y-ball.r<=block[paddle].y+blockSize) &&
                (ball.x>=block[paddle].x && ball.x<=block[paddle].x+3*blockSize)){
                ball.direction=180-ball.direction;
                block[paddle].visibility=false;
            };
        }
        ball.move();
    };
    function Ball(x , y ,  number){
        this.x = x;
        this.y = y;
        this.v = 7;
        this.direction = 135;
        this.number = number;
        this.r = 10;
        this.color = color;
        this.draw = function() {
            context.beginPath();
            context.fillStyle = this.color;
            context.arc(this.x , this.y , this.r ,0*Math.PI, 2*Math.PI);
            context.fill();
            context.closePath();
        };
        this.move=function(){
            this.x=this.x+Math.sin(this.direction*(Math.PI/180))*this.v;
            this.y=this.y-Math.cos(this.direction*(Math.PI/180))*this.v;
        };
    };
    window.addEventListener('resize' , resizeCanvas , false);
    window.addEventListener('keydown', function(event) {
        switch (event.keyCode) {
            case 68: // D
            case 39: // right
                head.x+=blockSize;
            break;
            case 65: // A
            case 37: // left
                head.x-=blockSize;
            break;
        };
    });
    resizeCanvas();
    restart();

})();