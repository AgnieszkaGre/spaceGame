$(document).ready(function(){
    $(".startButton").on("click", function() {
        var player = new Player(3, 1);
    })
});

class Player {
    constructor(lives, level) {
        this.lives = lives;
        this.level = level;
        this.score = 0;
        this.board = new Board("board");
        this.level1Score = 0;
        this.level2Score = 0;
        this.level3Score = 0;
        this.level4Score = 0;
        this.level5Score = 0;
        this.game;
        this.createGame();
        this.update();
    }
    
    update() {
        var that = this;
        var int = window.setInterval(function(){
            that.checkGameResult();
            that.countScore();
            that.displayPlayerData();
        }, 20);  
    }
    
    countScore() {
        var board = $("#board");
        if (this.level === 1) this.level1Score = this.game.levelScore;
        if (this.level === 2) this.level2Score = this.game.levelScore;
        if (this.level === 3) this.level3Score = this.game.levelScore;
        if (this.level === 4) this.level4Score = this.game.levelScore;
        if (this.level === 5) this.level5Score = this.game.levelScore;
        
        this.score = this.level1Score + this.level2Score + this.level3Score + this.level4Score + this.level5Score;
    }
    
    displayPlayerData() {
        $("#lives").html("Lives: " + this.lives);
        $("#score").html("Score: " + this.score);
        $("#level").html("Level: " + this.level);
    }
    
    checkGameResult() {
        if (this.game.result === -1) {
            this.lives--;
            if (this.lives > 0) {
                var that = this;
                this.board.lostLevelMessage();
                $(".startButton").on("click", function() {
                    that.createGame();
                });
                this.game.result = 0;
                return;
            } else {
                this.game.result = 0;
                this.board.gameoverMessage();
                $(".startButton").on("click", function() {
                    window.location.reload();
                });
            }
        }
        
        if (this.game.result === 1) {
            if (this.level < 5) {
                var that = this;
                this.board.wonLevelMessage();
                $(".startButton").on("click", function() {
                    that.level++;    
                    that.createGame();
                });
                this.game.result = 0;
            } else {
                this.game.result = 0;
                this.board.winMessage();
                $(".startButton").on("click", function() {
                    window.location.reload();
                });
            }
        }   
    }
    
    createGame() {
        if (this.level === 1) this.game = new Game(this.board, 10, 0, 22);        
        if (this.level === 2) this.game = new Game(this.board, 10, 5, 20);
        if (this.level === 3) this.game = new Game(this.board, 15, 5, 18);
        if (this.level === 4) this.game = new Game(this.board, 15, 10, 16);
        if (this.level === 5) this.game = new Game(this.board, 20, 10, 14);
    }
}

class GameObject {
    constructor(id) {
        this.id = id;
    } 
    
    top() {
        return this.htmlElement.offsetTop;
    }
    
    bottom() {
        return this.htmlElement.offsetTop + this.htmlElement.offsetHeight;
    }
    
    left() {
        return this.htmlElement.offsetLeft;
    }
    
    right() {
        return this.htmlElement.offsetLeft + this.htmlElement.offsetWidth;
    }
}

class Board extends GameObject {
    constructor(id) {
        super(id);
        this.htmlElement = document.getElementById(id);
        this.width = this.htmlElement.offsetWidth;
        this.height = this.htmlElement.offsetHeight;
    }
    
    lostLevelMessage() {
        $("#board").html("<div class='message'>You have another chance, don't waste it!. <br>Press the button when you're ready to play!<br><br><button class='startButton'>START</button></div>");
    }
    
    wonLevelMessage() {
        $("#board").html("<div class='message'>GREAT JOB!<br>Get ready for next level and press the button to play!<br><br><button class='startButton'>START</button></div>");
    }
    
    gameoverMessage() {
        $("#board").html("<div class='message'>GAME OVER!<br>You lost, but you can always try again! Press the button to start over!<br><br><button class='startButton'>PLAY AGAIN</button></div>");
    }
    
    winMessage() {
        $("#board").html("<div class='message'>CONGRATULATIONS!<br>You won!<br>Press the button if you want to start over.<br><br><button class='startButton'>PLAY AGAIN</button></div>");
    }
}

class Ball extends GameObject {
    constructor(id, startLeft, startTop, directionLeft, directionTop, board) {
        super(id);
        this.createHtmlElement(id);
        this.htmlElement = document.getElementById(id);
        this.directionLeft = directionLeft;
        this.directionTop = directionTop;
        this.setPositionLeft(startLeft);  
        this.setPositionTop(startTop);  
        this.width = this.htmlElement.offsetWidth;
        this.board = board;
    }
    
    createHtmlElement(id) {
        $("#board").append("<div class='ball' id=" + id + "></div>")
    }
    
    setPositionLeft(position) {
        this.htmlElement.style.left = position + "px";
    }
    
    setPositionTop(position) {
        this.htmlElement.style.top = position + "px";
    }
    
    changeDirectionLeft() {
        this.directionLeft = -this.directionLeft;
    }
    
    changeDirectionTop() {
        this.directionTop = -this.directionTop;
    }
    
    move() {
        this.htmlElement.style.left = this.startPositionLeft  + this.directionLeft  + "px";
        this.htmlElement.style.top = this.startPositionTop + this.directionTop + "px";
        this.startPositionLeft = this.left();
        this.startPositionTop = this.top();
            
        if (this.startPositionLeft > this.board.width - this.width) {
            this.changeDirectionLeft();
            this.startPositionLeft = this.board.width - this.width;
        }
        if (this.startPositionLeft < 0) {
            this.changeDirectionLeft();
            this.startPositionLeft = 0;
        }  
        if (this.startPositionTop > this.board.height - this.width) {
            this.changeDirectionTop();   
            this.startPositionTop = this.board.height - this.width;
        }
        if (this.startPositionTop < 0) {
            this.changeDirectionTop(); 
            this.startPositionTop = 0;
        }
    }
} 


class Ship extends GameObject {
    constructor(id) {
        super(id);   
        this.createHtmlElement(id);
        this.htmlElement = document.getElementById(id);
        this.width = this.htmlElement.offsetWidth;
    }
    
    createHtmlElement(id) {
        $("#board").append("<div class='ship' id=" + id + "></div>")
    }
}

class ShipStrong extends GameObject {
    constructor(id) {
        super(id);   
        this.createHtmlElement(id);
        this.htmlElement = document.getElementById(id);
        this.width = this.htmlElement.offsetWidth;
    }
    
    createHtmlElement(id) {
        $("#board").append("<div class='shipStrong' id=" + id + "></div>")
    }
}


class Paddle extends GameObject {
    constructor(id, board) {
        super(id);
        this.createHtmlElement(id);
        this.htmlElement = document.getElementById(id);
        this.width = this.htmlElement.offsetWidth;
        this.height = this.htmlElement.offsetHeight;
        this.board = board;
        this.setStartPosition();
        this.move();
    }
    
    createHtmlElement(id) {
        $("#board").append("<div class='paddle' id=" + id + "></div>")
    }
    
    setStartPosition() {
        this.htmlElement.style.left = "200px";
        this.htmlElement.style.top = "450px";
    }
    
    move(board) {
        var that = this;
        document.onkeydown = function(e) {
            var positionPaddle = that.left();   
            if(e.keyCode == 37) {
                if (positionPaddle > 0) {
                    positionPaddle -= 10;
                    that.htmlElement.style.left = positionPaddle + "px"; 
                }
            }
            else if(e.keyCode == 39) {
                if (positionPaddle < that.board.width - that.width) {
                    positionPaddle += 10;
                    that.htmlElement.style.left = positionPaddle + "px"; 
                }
            }
        }
    }
}

class Game {
    constructor(board, shipsNumber, shipsStrongNumber, speed) {
        this.clearBoard();
        this.board = board;
        this.shipsNumber = shipsNumber;
        this.shipsStrongNumber = shipsStrongNumber;
        this.ships = this.createShips();
        this.ball = new Ball("ball", 200, 300, 1, 5, this.board);
        this.paddle = new Paddle("paddle", this.board);
        this.speed = speed;
        this.gameDynamics();
        this.result = 0;
        this.levelScore = 0;
    }
    
    clearBoard() {
        $("#board").html("");
    }
    
    gameDynamics() {
        var that = this;
        var interval = window.setInterval(function() {
            that.ball.move();
            that.checkCollisionShips();
            that.checkCollisionShipsStrong();
            that.checkCollisionPaddle();
            that.lose(interval);
            that.win(interval);            
        }, this.speed);
    }
    
    createShips() {
        var shipsArray = [];
        for (var i = 0; i < this.shipsNumber; i++) {
            var shipId = "ship" + i;
            var ship = new Ship(shipId);
            shipsArray.push(ship);
        }
        for (var j = 0; j < this.shipsStrongNumber; j++) {
            var shipId = "shipStrong" + j;
            var shipStrong = new ShipStrong(shipId);
            shipsArray.push(shipStrong);
        }
        return (shipsArray);
    }
    
    
    checkCollisionShips() {
        for (var i = 0; i < this.shipsNumber; i++) {
            var shipId = "#ship" + i;
            var ship = document.getElementById("ship" + i);
            var shipTop = ship.offsetTop;
            var shipLeft = ship.offsetLeft;
                
            if (!$(shipId).hasClass("invisible")) {
                if (this.ball.right() > shipLeft && this.ball.left() < shipLeft + ship.offsetWidth && this.ball.top() < shipTop + ship.offsetHeight && this.ball.bottom() > shipTop) {
                    $(shipId).addClass("invisible");
                    this.ball.changeDirectionTop();
                    this.levelScore++;
                }
            }
        }
    }
    
    checkCollisionShipsStrong() {
        for (var i = 0; i < this.shipsStrongNumber; i++) {
            var shipId = "#shipStrong" + i;
            var ship = document.getElementById("shipStrong" + i);
            var shipTop = ship.offsetTop;
            var shipLeft = ship.offsetLeft;
                
            if (!$(shipId).hasClass("invisible") || !$(shipId).hasClass("weak")) {
                if (this.ball.right() > shipLeft && this.ball.left() < shipLeft + ship.offsetWidth && this.ball.top() < shipTop + ship.offsetHeight && this.ball.bottom() > shipTop) {
                        if ($(shipId).hasClass("weak")) {
                            $(shipId).addClass("invisible");
                        } else {
                            $(shipId).addClass("weak");
                        }
                        this.ball.changeDirectionTop();
                        this.levelScore++;
                }
            }
        }
    }
    
    checkCollisionPaddle() {
        var ballTop = this.ball.top();
        var ballLeft = this.ball.left();
        var ballBottom = this.ball.bottom();
        var ballRight = this.ball.right();
        var paddleTop = this.paddle.top();
        var paddleLeft = this.paddle.left();
        var paddleBottom = this.paddle.bottom();
        var paddleRight = this.paddle.right();
        
        if (ballBottom >= paddleTop && ballRight >= paddleLeft && ballLeft <= paddleRight && ballTop <= paddleBottom) {
            this.ball.changeDirectionTop();
            /* changing direction and angle of the ball in case corner of a paddle is used to bounce the ball */
            if (ballRight <= paddleLeft + 20) {
                this.ball.directionLeft = -2;
            }
            else if (ballLeft >= (paddleRight - 20)) {
                this.ball.directionLeft = 2;
            } 
            /* changing trajectory back in case the middle of a paddle is used to bouce the ball */
            else {
                if (this.ball.directionLeft === -2) this.ball.directionLeft = -1;
                if (this.ball.directionLeft === 2) this.ball.directionLeft = 1;
            }
            
            /* retrieving a ball in case it gets stuck inside the paddle */
            if (ballBottom > paddleTop && ballTop < paddleBottom) {
                this.ball.setPositionTop(paddleTop - this.ball.width);
            }
        }
    }
    
    lose(interval) {
        if (this.ball.bottom() >= this.board.height) {
            this.result = -1;
            window.clearInterval(interval);
        }
    }
    
    win(interval) {
        if ($("#board").children(".invisible").length === this.shipsNumber + this.shipsStrongNumber) {
            this.result = 1;
            window.clearInterval(interval);
        }
    }
}




