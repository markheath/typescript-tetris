var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
// shim layer with setTimeout fallback
var requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 60);
        };
})();
var Point = /** @class */ (function () {
    function Point(x, y) {
        this.x = x;
        this.y = y;
    }
    return Point;
}());
var Shape = /** @class */ (function () {
    function Shape() {
        this.rotation = 0; // what rotation 0,1,2,3
    }
    Shape.prototype.move = function (x, y) {
        var newPoints = [];
        for (var i = 0; i < this.points.length; i++) {
            newPoints.push(new Point(this.points[i].x + x, this.points[i].y + y));
        }
        return newPoints;
    };
    Shape.prototype.setPos = function (newPoints) {
        this.points = newPoints;
    };
    // return a set of points showing where this shape would be if we dropped it one
    Shape.prototype.drop = function () {
        return this.move(0, 1);
    };
    // return a set of points showing where this shape would be if we moved left one
    Shape.prototype.moveLeft = function () {
        return this.move(-1, 0);
    };
    // return a set of points showing where this shape would be if we moved right one
    Shape.prototype.moveRight = function () {
        return this.move(1, 0);
    };
    // override these
    // return a set of points showing where this shape would be if we rotate it
    Shape.prototype.rotate = function (clockwise) {
        throw new Error("This method is abstract");
    };
    return Shape;
}());
var SquareShape = /** @class */ (function (_super) {
    __extends(SquareShape, _super);
    function SquareShape(cols) {
        var _this = _super.call(this) || this;
        _this.fillColor = 'green';
        var x = cols / 2;
        var y = -2;
        _this.points = [];
        _this.points.push(new Point(x, y));
        _this.points.push(new Point(x + 1, y));
        _this.points.push(new Point(x, y + 1));
        _this.points.push(new Point(x + 1, y + 1));
        return _this;
    }
    SquareShape.prototype.rotate = function (clockwise) {
        // this shape does not rotate
        return this.points;
    };
    return SquareShape;
}(Shape));
var LShape = /** @class */ (function (_super) {
    __extends(LShape, _super);
    function LShape(leftHanded, cols) {
        var _this = _super.call(this) || this;
        _this.leftHanded = leftHanded;
        if (leftHanded)
            _this.fillColor = 'yellow';
        else
            _this.fillColor = 'white';
        var x = cols / 2;
        var y = -2;
        _this.points = [];
        _this.points.push(new Point(x, y - 1));
        _this.points.push(new Point(x, y)); // 1 is our base point
        _this.points.push(new Point(x, y + 1));
        _this.points.push(new Point(x + (leftHanded ? -1 : 1), y + 1));
        return _this;
    }
    LShape.prototype.rotate = function (clockwise) {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? -1 : 1), this.points[1].y + 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y + (this.leftHanded ? -1 : 1)));
                break;
            case 2:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? 1 : -1), this.points[1].y - 1));
                break;
            case 3:
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y + (this.leftHanded ? 1 : -1)));
                break;
        }
        return newPoints;
    };
    return LShape;
}(Shape));
var StepShape = /** @class */ (function (_super) {
    __extends(StepShape, _super);
    function StepShape(leftHanded, cols) {
        var _this = _super.call(this) || this;
        if (leftHanded)
            _this.fillColor = 'cyan';
        else
            _this.fillColor = 'magenta';
        _this.leftHanded = leftHanded;
        var x = cols / 2;
        var y = -1;
        _this.points = [];
        _this.points.push(new Point(x + (leftHanded ? 1 : -1), y));
        _this.points.push(new Point(x, y)); // point 1 is our base point
        _this.points.push(new Point(x, y - 1));
        _this.points.push(new Point(x + (leftHanded ? -1 : 1), y - 1));
        return _this;
    }
    StepShape.prototype.rotate = function (clockwise) {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? 1 : -1), this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + (this.leftHanded ? -1 : 1), this.points[1].y - 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + (this.leftHanded ? 1 : -1)));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y + (this.leftHanded ? -1 : 1)));
                break;
        }
        return newPoints;
    };
    return StepShape;
}(Shape));
var StraightShape = /** @class */ (function (_super) {
    __extends(StraightShape, _super);
    function StraightShape(cols) {
        var _this = _super.call(this) || this;
        _this.fillColor = 'blue';
        var x = cols / 2;
        var y = -2;
        _this.points = [];
        _this.points.push(new Point(x, y - 2));
        _this.points.push(new Point(x, y - 1));
        _this.points.push(new Point(x, y)); // point 2 is our base point
        _this.points.push(new Point(x, y + 1));
        return _this;
    }
    StraightShape.prototype.rotate = function (clockwise) {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints[0] = new Point(this.points[2].x, this.points[2].y - 2);
                newPoints[1] = new Point(this.points[2].x, this.points[2].y - 1);
                newPoints[2] = new Point(this.points[2].x, this.points[2].y);
                newPoints[3] = new Point(this.points[2].x, this.points[2].y + 1);
                break;
            case 1:
                newPoints[0] = new Point(this.points[2].x + 2, this.points[2].y);
                newPoints[1] = new Point(this.points[2].x + 1, this.points[2].y);
                newPoints[2] = new Point(this.points[2].x, this.points[2].y);
                newPoints[3] = new Point(this.points[2].x - 1, this.points[2].y);
                break;
        }
        return newPoints;
    };
    return StraightShape;
}(Shape));
var TShape = /** @class */ (function (_super) {
    __extends(TShape, _super);
    function TShape(cols) {
        var _this = _super.call(this) || this;
        _this.fillColor = 'red';
        _this.points = [];
        var x = cols / 2;
        var y = -2;
        _this.points.push(new Point(x - 1, y));
        _this.points.push(new Point(x, y)); // point 1 is our base point
        _this.points.push(new Point(x + 1, y));
        _this.points.push(new Point(x, y + 1));
        return _this;
    }
    TShape.prototype.rotate = function (clockwise) {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 4;
        var newPoints = [];
        switch (this.rotation) {
            case 0:
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                break;
            case 1:
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                break;
            case 2:
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x - 1, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                break;
            case 3:
                newPoints.push(new Point(this.points[1].x, this.points[1].y + 1));
                newPoints.push(new Point(this.points[1].x, this.points[1].y));
                newPoints.push(new Point(this.points[1].x, this.points[1].y - 1));
                newPoints.push(new Point(this.points[1].x + 1, this.points[1].y));
                break;
        }
        return newPoints;
    };
    return TShape;
}(Shape));
var Grid = /** @class */ (function () {
    function Grid(rows, cols, blockSize, backColor, context) {
        this.context = context;
        this.blockSize = blockSize;
        this.blockColor = new Array(rows);
        this.backColor = backColor;
        this.cols = cols;
        this.rows = rows;
        for (var r = 0; r < rows; r++) {
            this.blockColor[r] = new Array(cols);
        }
        this.xOffset = 20;
        this.yOffset = 20;
    }
    Grid.prototype.draw = function (shape) {
        this.paintShape(shape, shape.fillColor);
    };
    Grid.prototype.erase = function (shape) {
        this.paintShape(shape, this.backColor);
    };
    Grid.prototype.paintShape = function (shape, color) {
        var _this = this;
        shape.points.forEach(function (p) { return _this.paintSquare(p.y, p.x, color); });
    };
    Grid.prototype.getPreferredSize = function () {
        return new Point(this.blockSize * this.cols, this.blockSize * this.rows);
    };
    // check the set of points to see if they are all free
    Grid.prototype.isPosValid = function (points) {
        var valid = true;
        for (var i = 0; i < points.length; i++) {
            if ((points[i].x < 0) ||
                (points[i].x >= this.cols) ||
                (points[i].y >= this.rows)) {
                valid = false;
                break;
            }
            if (points[i].y >= 0) {
                if (this.blockColor[points[i].y][points[i].x] != this.backColor) {
                    valid = false;
                    break;
                }
            }
        }
        return valid;
    };
    Grid.prototype.addShape = function (shape) {
        for (var i = 0; i < shape.points.length; i++) {
            if (shape.points[i].y < 0) {
                // a block has landed and it isn't even fully on the grid yet
                return false;
            }
            this.blockColor[shape.points[i].y][shape.points[i].x] = shape.fillColor;
        }
        return true;
    };
    Grid.prototype.eraseGrid = function () {
        this.context.fillStyle = this.backColor;
        var width = this.cols * this.blockSize;
        var height = this.rows * this.blockSize;
        this.context.fillRect(this.xOffset, this.yOffset, width, height);
    };
    Grid.prototype.clearGrid = function () {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                this.blockColor[row][col] = this.backColor;
            }
        }
        this.eraseGrid();
    };
    Grid.prototype.paintSquare = function (row, col, color) {
        if (row >= 0) { // don't paint rows that are above the grid
            this.context.fillStyle = color;
            this.context.fillRect(this.xOffset + col * this.blockSize, this.yOffset + row * this.blockSize, this.blockSize - 1, this.blockSize - 1);
        }
    };
    Grid.prototype.drawGrid = function () {
        for (var row = 0; row < this.rows; row++) {
            for (var col = 0; col < this.cols; col++) {
                if (this.blockColor[row][col] !== this.backColor) {
                    this.paintSquare(row, col, this.blockColor[row][col]);
                }
            }
        }
    };
    Grid.prototype.paint = function () {
        this.eraseGrid();
        this.drawGrid();
    };
    // only the rows in last shape could have been filled
    Grid.prototype.checkRows = function (lastShape) {
        var rowMin = lastShape.points[0].y;
        var rowMax = lastShape.points[0].y;
        var rowComplete;
        var rowsRemoved = 0;
        for (var i = 1; i < lastShape.points.length; i++) {
            if (lastShape.points[i].y < rowMin) {
                rowMin = lastShape.points[i].y;
            }
            if (lastShape.points[i].y > rowMax) {
                rowMax = lastShape.points[i].y;
            }
        }
        if (rowMin < 0) {
            rowMin = 0;
        }
        while (rowMax >= rowMin) {
            rowComplete = true;
            for (var col = 0; col < this.cols; col++) {
                if (this.blockColor[rowMax][col] == this.backColor) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) {
                rowsRemoved++;
                // shuffle down, stay on this row
                for (var r = rowMax; r >= 0; r--) {
                    for (col = 0; col < this.cols; col++) {
                        if (r > 0)
                            this.blockColor[r][col] = this.blockColor[r - 1][col];
                        else
                            this.blockColor[r][col] = this.backColor;
                    }
                }
                rowMin++;
            }
            else {
                // move up a row
                rowMax--;
            }
        }
        if (rowsRemoved > 0) {
            this.eraseGrid();
            this.paint();
        }
        return rowsRemoved;
    };
    return Grid;
}());
var Game = /** @class */ (function () {
    function Game() {
        var _a;
        this.running = false;
        this.phase = Game.gameState.initial;
        this.scoreLabel = document.getElementById('scoreLabel');
        this.rowsLabel = document.getElementById('rowsLabel');
        this.levelLabel = document.getElementById('levelLabel');
        this.messageLabel = document.getElementById('floatingMessage');
        this.canvas = document.getElementById('gameCanvas');
        this.context = (_a = this.canvas.getContext("2d")) !== null && _a !== void 0 ? _a : (function () { throw new Error("Canvas not supported"); })();
        this.grid = new Grid(16, 10, 20, 'gray', this.context);
        this.grid.eraseGrid();
        this.speed = 1000;
        var x = this;
        document.onkeydown = function (e) { x.keyHandler(e); }; // gets the wrong thing as this, so capturing the right this
        this.showMessage("Press F2 to start");
    }
    Game.prototype.draw = function () {
        if (this.phase == Game.gameState.playing) {
            this.grid.paint();
            this.grid.draw(this.currentShape);
            // recursive render loop
            requestAnimFrame((function (self) {
                return function () { self.draw(); };
            })(this));
        }
    };
    Game.prototype.newGame = function () {
        this.messageLabel.style.display = 'none'; // hide();
        this.grid.clearGrid();
        this.currentShape = this.newShape();
        this.score = 0;
        this.rowsCompleted = 0;
        this.score = 0;
        this.level = -1;
        this.speed = 1000;
        this.phase = Game.gameState.playing;
        // kick off the render loop
        requestAnimFrame((function (self) {
            return function () { self.draw(); };
        })(this));
        this.incrementLevel(); // will start the game timer & update the labels
    };
    Game.prototype.updateLabels = function () {
        this.scoreLabel.innerText = this.score.toString();
        this.rowsLabel.innerText = this.rowsCompleted.toString();
        this.levelLabel.innerText = this.level.toString();
    };
    Game.prototype.gameTimer = function () {
        if (this.phase == Game.gameState.playing) {
            var points = this.currentShape.drop();
            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
            }
            else {
                this.shapeFinished();
            }
        }
    };
    Game.prototype.keyHandler = function (event) {
        var points;
        if (this.phase == Game.gameState.playing) {
            switch (event.key) {
                case "ArrowRight": // right
                    points = this.currentShape.moveRight();
                    break;
                case "ArrowLeft": // left
                    points = this.currentShape.moveLeft();
                    break;
                case "ArrowUp": // up arrow
                    points = this.currentShape.rotate(true);
                    break;
                case "ArrowDown": // down arrow
                    // erase ourself first
                    points = this.currentShape.drop();
                    while (this.grid.isPosValid(points)) {
                        this.currentShape.setPos(points);
                        points = this.currentShape.drop();
                    }
                    this.shapeFinished();
                    break;
            }
            switch (event.key) {
                case "ArrowRight": // right
                case "ArrowLeft": // left
                case "ArrowUp": // up
                    if (this.grid.isPosValid(points)) {
                        this.currentShape.setPos(points);
                    }
                    break;
            }
        }
        if (event.key === "F2") { // F2
            this.newGame();
        }
        else if (event.key === "p" || event.key === "P") { // P = Pause
            this.togglePause();
        }
        else if (event.key === "f" || event.key === "F") { // F = Faster
            if ((this.level < 10) && (this.phase == Game.gameState.playing) || (this.phase == Game.gameState.paused)) {
                this.incrementLevel();
            }
        }
    };
    Game.prototype.togglePause = function () {
        if (this.phase == Game.gameState.paused) {
            this.messageLabel.style.display = 'none'; // hide();
            this.phase = Game.gameState.playing;
            this.draw(); // kick the render loop off again
        }
        else if (this.phase == Game.gameState.playing) {
            this.phase = Game.gameState.paused;
            this.showMessage("PAUSED");
        }
    };
    Game.prototype.showMessage = function (message) {
        this.messageLabel.style.display = 'block'; //show();
        this.messageLabel.innerText = message;
    };
    Game.prototype.incrementLevel = function () {
        this.level++;
        if (this.level < 10) {
            this.speed = 1000 - (this.level * 100);
            clearTimeout(this.timerToken);
            this.timerToken = setInterval((function (self) {
                return function () { self.gameTimer(); };
            })(this), this.speed);
        }
        this.updateLabels();
    };
    Game.prototype.shapeFinished = function () {
        if (this.grid.addShape(this.currentShape)) {
            this.grid.draw(this.currentShape);
            var completed = this.grid.checkRows(this.currentShape); // and erase them
            this.rowsCompleted += completed;
            this.score += (completed * (this.level + 1) * 10);
            if (this.rowsCompleted > ((this.level + 1) * 10)) {
                this.incrementLevel();
            }
            this.updateLabels();
            this.currentShape = this.newShape();
        }
        else {
            // game over!
            if (window.console)
                console.log("Game over");
            this.phase = Game.gameState.gameOver;
            this.showMessage("GAME OVER\nPress F2 to Start");
            clearTimeout(this.timerToken);
        }
    };
    Game.prototype.newShape = function () {
        // 7 shapes
        var randomShape = Math.floor(Math.random() * 7);
        var newShape;
        switch (randomShape) {
            case 0:
                newShape = new LShape(false, this.grid.cols);
                break;
            case 1:
                newShape = new LShape(true, this.grid.cols);
                break;
            case 2:
                newShape = new TShape(this.grid.cols);
                break;
            case 3:
                newShape = new StepShape(false, this.grid.cols);
                break;
            case 4:
                newShape = new StepShape(true, this.grid.cols);
                break;
            case 5:
                newShape = new SquareShape(this.grid.cols);
                break;
            case 6:
                newShape = new StraightShape(this.grid.cols);
                break;
            default:
                throw new Error("Unknown shape");
        }
        return newShape;
    };
    Game.gameState = { initial: 0, playing: 1, paused: 2, gameOver: 3 };
    return Game;
}());
(function () {
    "use strict";
    function init() {
        var game = new Game();
    }
    window.addEventListener('DOMContentLoaded', init, false);
})();
//# sourceMappingURL=app.js.map