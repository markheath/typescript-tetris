class Point {
    public x: number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }
}

class Shape {
    public points: Point[]; // points that make up this shape
    public rotation = 0; // what rotation 0,1,2,3
    public fillColor: string;

    private move(x: number, y: number): Point[] {
        return this.points.map(p => new Point(p.x + x, p.y + y));
    }

    public setPos(newPoints: Point[]) {
        this.points = newPoints;
    }

    // return a set of points showing where this shape would be if we dropped it one
    public drop(): Point[] {
        return this.move(0, 1);
    }

    // return a set of points showing where this shape would be if we moved left one
    public moveLeft(): Point[] {
        return this.move(-1, 0);
    }

    // return a set of points showing where this shape would be if we moved right one
    public moveRight(): Point[] {
        return this.move(1, 0);
    }

    // override these
    // return a set of points showing where this shape would be if we rotate it
    public rotate(clockwise: boolean): Point[] {
        throw new Error("This method is abstract");
    }
}


class SquareShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = 'green';
        const x = cols / 2;
        const y = -2;
        this.points = [
            new Point(x, y),
            new Point(x + 1, y),
            new Point(x, y + 1),
            new Point(x + 1, y + 1)
        ];
    }

    public rotate(clockwise: boolean): Point[] {
        // this shape does not rotate
        return this.points;
    }
}

class LShape extends Shape {
    private leftHanded: boolean;

    constructor(leftHanded: boolean, cols: number) {
        super();
        this.leftHanded = leftHanded;
        this.fillColor = leftHanded ? 'yellow' : 'white';

        const x = cols / 2;
        const y = -2;
        const offsets = [[0,-1], [0,0], [0,1], [leftHanded ? -1 : 1, 1]];
        this.points = offsets.map(([dx,dy]) => new Point(x + dx, y + dy));
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1) + 4) % 4;
        const sign = this.leftHanded ? -1 : 1;
    
        const rotationOffsets = [
            [[0, -1], [0, 0], [0, 1], [sign, 1]],
            [[1, 0], [0, 0], [-1, 0], [-1, sign]],
            [[0, 1], [0, 0], [0, -1], [-sign, -1]],
            [[-1, 0], [0, 0], [1, 0], [1, -sign]]
        ];
    
        return rotationOffsets[this.rotation].map(([dx, dy]) => 
            new Point(this.points[1].x + dx, this.points[1].y + dy)
        );
    }
}

class StepShape extends Shape {
    private leftHanded: boolean;
    constructor(leftHanded: boolean, cols: number) {
        super();
        this.fillColor = leftHanded ? 'cyan' : 'magenta';

        this.leftHanded = leftHanded;
        const x = cols / 2;
        const y = -1;

        const sign = leftHanded ? 1 : -1;
        this.points = [
            new Point(x + sign, y),     
            new Point(x, y), // point 1 is our base point
            new Point(x, y - 1),
            new Point(x - sign, y - 1)
        ];
    }


    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
        const sign = this.leftHanded ? 1 : -1;
        
        const rotationOffsets = [
            [[sign, 0], [0, 0], [0, -1], [-sign, -1]],
            [[0, sign], [0, 0], [1, 0], [1, -sign]]
        ];
    
        return rotationOffsets[this.rotation].map(([dx, dy]) => 
            new Point(this.points[1].x + dx, this.points[1].y + dy)
        );
    }
}

class StraightShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = 'blue';
        const x = cols / 2;
        const y = -2;
        this.points = [
            new Point(x, y - 2),
            new Point(x, y - 1),
            new Point(x, y),     // point 2 is our base point
            new Point(x, y + 1)
        ];
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1)) % 2;
        
        const rotationOffsets = [
            [[0, -2], [0, -1], [0, 0], [0, 1]],  // vertical
            [[2, 0], [1, 0], [0, 0], [-1, 0]]    // horizontal
        ];
    
        return rotationOffsets[this.rotation].map(([dx, dy]) => 
            new Point(this.points[2].x + dx, this.points[2].y + dy)
        );
    }
}

class TShape extends Shape {
    constructor(cols: number) {
        super();
        this.fillColor = 'red';
        const x = cols / 2;
        const y = -2;
        this.points = [
            new Point(x - 1, y),
            new Point(x, y),     // point 1 is our base point
            new Point(x + 1, y),
            new Point(x, y + 1)
        ];    
    }

    public rotate(clockwise: boolean): Point[] {
        this.rotation = (this.rotation + (clockwise ? 1 : -1) + 4) % 4;
        
        const rotationOffsets = [
            [[-1, 0], [0, 0], [1, 0], [0, 1]],   // 0 degrees
            [[0, -1], [0, 0], [0, 1], [-1, 0]],  // 90 degrees
            [[1, 0], [0, 0], [-1, 0], [0, -1]],  // 180 degrees
            [[0, 1], [0, 0], [0, -1], [1, 0]]    // 270 degrees
        ];
    
        return rotationOffsets[this.rotation].map(([dx, dy]) => 
            new Point(this.points[1].x + dx, this.points[1].y + dy)
        );
    }
}

class Grid {
    private context: CanvasRenderingContext2D;
    private rows: number;
    public cols: number;
    public blockSize: number;
    private blockColor: string[][];
    public backColor: string;
    private xOffset: number;
    private yOffset: number;

    constructor(rows: number, cols: number, blockSize: number, backColor: string, context: CanvasRenderingContext2D) {
        this.context = context;
        this.blockSize = blockSize;
        this.blockColor = new Array(rows);
        this.backColor = backColor;
        this.cols = cols;
        this.rows = rows;
        for (let r = 0; r < rows; r++) {
            this.blockColor[r] = new Array(cols);
        }
        this.xOffset = 20;
        this.yOffset = 20;
    }

    public draw(shape: Shape) {
        this.paintShape(shape, shape.fillColor);
    }

    public erase(shape: Shape) {
        this.paintShape(shape, this.backColor);
    }

    private paintShape(shape: Shape, color) {
        shape.points.forEach(p=> this.paintSquare(p.y, p.x, color));
    }

    public getPreferredSize(): Point {
        return new Point(this.blockSize * this.cols, this.blockSize * this.rows);
    }

    // check the set of points to see if they are all free
    public isPosValid(points: Point[]) {
        let valid: boolean = true;
        for (let i = 0; i < points.length; i++) {
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
    }

    public addShape(shape: Shape) {
        for (let i = 0; i < shape.points.length; i++) {
            if (shape.points[i].y < 0) {
                // a block has landed and it isn't even fully on the grid yet
                return false;
            }
            this.blockColor[shape.points[i].y][shape.points[i].x] = shape.fillColor;
        }
        return true;
    }

    public eraseGrid() {
        this.context.fillStyle = this.backColor;
        const width = this.cols * this.blockSize;
        const height = this.rows * this.blockSize;

        this.context.fillRect(this.xOffset, this.yOffset, width, height);
    }

    public clearGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                this.blockColor[row][col] = this.backColor;
            }
        }
        this.eraseGrid();
    }

    private paintSquare(row: number, col: number, color: string) {
        if (row >= 0) { // don't paint rows that are above the grid
            this.context.fillStyle = color;
            this.context.fillRect(this.xOffset + col * this.blockSize, this.yOffset + row * this.blockSize, this.blockSize - 1, this.blockSize - 1);
        }
    }

    public drawGrid() {
        for (let row = 0; row < this.rows; row++) {
            for (let col = 0; col < this.cols; col++) {
                if (this.blockColor[row][col] !== this.backColor) {
                    this.paintSquare(row, col, this.blockColor[row][col]);
                }
            }
        }
    }

    public paint() {
        this.eraseGrid();
        this.drawGrid();
    }

    // only the rows in last shape could have been filled
    public checkRows(lastShape: Shape) {
        let rowMin = lastShape.points[0].y;
        let rowMax = lastShape.points[0].y;
        let rowComplete: boolean;
        let rowsRemoved = 0;
        for (let i = 1; i < lastShape.points.length; i++) {
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
            for (let col = 0; col < this.cols; col++) {
                if (this.blockColor[rowMax][col] == this.backColor) {
                    rowComplete = false;
                    break;
                }
            }
            if (rowComplete) {
                rowsRemoved++;
                // shuffle down, stay on this row
                for (let r = rowMax; r >= 0; r--) {
                    for (let col = 0; col < this.cols; col++) {
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
    }
}

class Game {
    private canvas: HTMLCanvasElement;
    private context: CanvasRenderingContext2D;
    private running: boolean = false;
    private currentShape: Shape;
    private grid: Grid;
    private speed: number; // in milliseconds
    private level: number;
    private rowsCompleted: number;
    static gameState = { initial: 0, playing: 1, paused: 2, gameOver: 3 };
    private phase = Game.gameState.initial;
    private score: number;
    private scoreLabel = <HTMLSpanElement>document.getElementById('scoreLabel');
    private rowsLabel = <HTMLSpanElement>document.getElementById('rowsLabel');
    private levelLabel = <HTMLSpanElement>document.getElementById('levelLabel');
    private messageLabel = <HTMLDivElement>document.getElementById('floatingMessage');
    private timerToken: number;
    private pausedImage: HTMLImageElement;
    private paintScheduled = false;
    private softDrop = false;
    private static readonly softDropSpeed = 50;

    constructor() {
        this.canvas = <HTMLCanvasElement>document.getElementById('gameCanvas');
        this.context = this.canvas.getContext("2d", { alpha: false }) ?? (() => { throw new Error("Canvas not supported"); })();
        this.context.fillStyle = 'cornflowerblue';
        this.context.fillRect(0, 0, this.canvas.width, this.canvas.height);
        this.grid = new Grid(16, 10, 20, 'gray', this.context);
        this.grid.eraseGrid();
        this.speed = 1000;
        document.addEventListener('keydown', e => this.keyHandler(e));
        document.addEventListener('keyup', e => this.keyUpHandler(e));
        this.showMessage("Press F2 to start");
    }

    private requestPaint() {
        if (this.paintScheduled) return;
        this.paintScheduled = true;
        requestAnimationFrame(() => {
            this.paintScheduled = false;
            if (this.phase == Game.gameState.playing) {
                this.grid.paint();
                this.grid.draw(this.currentShape);
            }
        });
    }

    private newGame() {
        this.messageLabel.style.display = 'none'; // hide();
        this.grid.clearGrid();
        this.currentShape = this.newShape();
        this.score = 0;
        this.rowsCompleted = 0;
        this.score = 0;
        this.level = -1;
        this.speed = 1000;
        this.softDrop = false;
        this.phase = Game.gameState.playing;
        this.requestPaint();
        this.incrementLevel(); // will start the game timer & update the labels
    }

    private updateLabels() {
        this.scoreLabel.innerText = this.score.toString();
        this.rowsLabel.innerText = this.rowsCompleted.toString();
        this.levelLabel.innerText = this.level.toString();
    }

    private gameTimer() {
        if (this.phase == Game.gameState.playing) {
            const points = this.currentShape.drop();
            if (this.grid.isPosValid(points)) {
                this.currentShape.setPos(points);
            }
            else {
                this.shapeFinished();
            }
            this.requestPaint();
        }
    }

    private keyHandler(event: KeyboardEvent) {
        let points: Point[] = [];
        if (this.phase == Game.gameState.playing) {
            switch (event.key) {
                case "ArrowRight": // right
                    points = this.currentShape.moveRight();
                    event.preventDefault();
                    break;
                case "ArrowLeft": // left
                    points = this.currentShape.moveLeft();
                    event.preventDefault();
                    break;
                case "ArrowUp": // up arrow
                    points = this.currentShape.rotate(true);
                    event.preventDefault();
                    break;
                case "ArrowDown": // soft drop (accelerated gravity while held)
                    if (!event.repeat && !this.softDrop) {
                        this.softDrop = true;
                        this.restartTimer();
                    }
                    event.preventDefault();
                    break;
                case " ": // Space = hard drop
                    points = this.currentShape.drop();
                    while (this.grid.isPosValid(points)) {
                        this.currentShape.setPos(points);
                        points = this.currentShape.drop();
                    }
                    this.shapeFinished();
                    event.preventDefault();
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
            this.requestPaint();
        }

        if (event.key === "F2") { // F2
            this.newGame();
        } else if (event.key === "p" || event.key === "P") { // P = Pause
            this.togglePause();
        } else if (event.key === "f" || event.key === "F") { // F = Faster
            if ((this.level < 10) && (this.phase == Game.gameState.playing) || (this.phase == Game.gameState.paused)) {
                this.incrementLevel();
            }
        } else if (event.key === "s" || event.key === "S") { // S = Slower (secret)
            if ((this.phase == Game.gameState.playing) || (this.phase == Game.gameState.paused)) {
                this.decrementLevel();
            }
        }
    }

    private keyUpHandler(event: KeyboardEvent) {
        if (event.key === "ArrowDown" && this.softDrop) {
            this.softDrop = false;
            this.restartTimer();
        }
    }

    private restartTimer() {
        clearInterval(this.timerToken);
        if (this.phase != Game.gameState.playing && this.phase != Game.gameState.paused) return;
        const tickMs = this.softDrop ? Game.softDropSpeed : this.speed;
        this.timerToken = setInterval(() => this.gameTimer(), tickMs);
    }

    private togglePause() {
        if (this.phase == Game.gameState.paused) {
            this.messageLabel.style.display = 'none'; // hide();
            this.phase = Game.gameState.playing;
            this.requestPaint();
        }
        else if (this.phase == Game.gameState.playing) {
            this.phase = Game.gameState.paused;
            this.showMessage("PAUSED");
        }
    }

    private showMessage(message: string) {
        this.messageLabel.style.display = 'block'; //show();
        this.messageLabel.innerText = message;
    }

    private incrementLevel() {
        this.level++;
        if (this.level < 10) {
            this.speed = 1000 - (this.level * 100);
            this.restartTimer();
        }
        this.updateLabels();
    }

    private decrementLevel() {
        if (this.level <= 0) return;
        this.level--;
        this.speed = 1000 - (this.level * 100);
        this.restartTimer();
        this.updateLabels();
    }

    private shapeFinished() {
        if (this.grid.addShape(this.currentShape)) {
            this.grid.draw(this.currentShape);
            const completed = this.grid.checkRows(this.currentShape); // and erase them
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
            if (window.console) console.log("Game over");
            this.phase = Game.gameState.gameOver;
            this.showMessage("GAME OVER\nPress F2 to Start");
            this.softDrop = false;
            clearInterval(this.timerToken);
        }
    }

    private newShape(): Shape {
        // 7 shapes
        const randomShape = Math.floor(Math.random() * 7);
        let newShape: Shape;
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
    }
}

(function () {
    "use strict";

    function init() {
        new Game();
    }

    window.addEventListener('DOMContentLoaded', init, false);
})();

