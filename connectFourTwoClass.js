const readline = require("readline");
var rl = readline.createInterface(process.stdin, process.stdout);

class ConnectView {
    constructor (boardSize) {
        this.boardSize = boardSize;
    }

    display = (data) => {
        const boardSizeStr = boardSize + "";
        let boardDisplayString = " " + this.addSpace("", boardSizeStr) + "| ";
        for (let i = 0; i < this.boardSize; i++) {
            boardDisplayString += this.addSpace(i + "", boardSizeStr) + "| "
        }
        const dividerLength = boardDisplayString.length;
        let dash = "";
        for (let i = 0; i < dividerLength; i++) {
            dash += "-";
        }
        boardDisplayString += "\n" + dash + "\n ";
        for (let i = 0; i < this.boardSize; i++) {
            boardDisplayString += this.addSpace(i + "", boardSizeStr) + "| ";
            for (let j = 0; j < this.boardSize; j++) {
                //this needs to be printing model data;
                boardDisplayString += this.addSpace(data.board[i][j], boardSizeStr) + "| ";
            }
            boardDisplayString += "\n" + dash + "\n ";
        }
        console.log(boardDisplayString);
    }

    addSpace = (current, target) => {
        while (current.length <= target.length) {
            current += " ";
        }
        return current;
    }

    isWithinBounds = (x, y) => x >=0 && x < this.boardSize && y >= 0 && y < this.boardSize;

    validateInput = (position) => {
        const res = position.split(",");
        if (res.length !== 2) throw new Error("Please enter a valid input.");
        const y = res[0];
        const x = res[1];
        if(isNaN(x) || isNaN(y)) throw new Error("Please enter a valid input.");
        if(!this.isWithinBounds(x, y)) throw new Error("Please enter a valid input.");
        return {x, y};
    }

    run = () => {
        rl.question('Please place your move in a space: ', (position) => {
            try {
                const { x , y } = this.validateInput(position);
                const data = model.playerMove(x, y);
                if (!data) throw new Error("Please enter a valid input.")
                this.display(data);
                if(data.state === "win") {
                    console.log(`${data.player} has won! Please play again.`)
                    return rl.close();
                } else if (data.state === "draw") {
                    console.log("Tie game! Please play again.")
                    return rl.close();
                }
            } catch (err) {
                console.log(err.message);
            }
            this.run();
        });
    }
};

class ConnectModel {
    constructor (boardSize) {
        this.boardSize = boardSize;
        this.state = "ongoing"; //draw, win
        this.board = this.createBoard();
        this.player = "X";
    }

    createBoard = () => {
        let board = new Array(this.boardSize);
        for (let i = 0; i < this.boardSize; i++) {
            board[i] = new Array(this.boardSize);
            for (let j = 0; j < this.boardSize; j++) {
                board[i][j] = " ";
            }
        }
        return board;
    }

    validMove = (x, y) => this.board[x][y] === " ";

    playerMove = (x, y) => {
        if(!this.validMove(x, y)) return null;
        this.board[x][y] = this.player;
        this.isWin();
        this.isDraw();
        if (this.state !== "win") this.changePlayer();
        console.log(this.board);
        console.log(this.player);
        console.log(this.state);
        return {
            board: this.board,
            player: this.player,
            state: this.state
        }
    }

    changePlayer = () => {
        if (this.player === "X") {
            this.player = "O";
        } else {
            this.player = "X";
        }
    }

    isDraw = () => {
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === " ") {
                    return;
                }
            }
        }
        this.state = "draw";
    }

    isWin = () => {
        //horizontal win
        let winCheck = 0;
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[i][j] === this.player) {
                    winCheck++;
                } else {
                    winCheck = 0;
                }
                if (winCheck === 4) return this.state = "win";
            }
            winCheck = 0;
        }

        //vertical win
        for (let i = 0; i < this.boardSize; i++) {
            for (let j = 0; j < this.boardSize; j++) {
                if (this.board[j][i] === this.player) {
                    winCheck++;
                } else {
                    winCheck = 0;
                }
                if (winCheck === 4) return this.state = "win";
            }
            winCheck = 0;
        }

        //diagonal win 1
        let currX = 0;
        let currY = 0;
        let x = 0;
        let y = 0;
        for (let i = 0; i < this.boardSize*2 - 2; i++) {
            while(this.isWithinBounds(x, y)) {
                if (this.board[x][y] === this.player) {
                    winCheck++;
                } else {
                    winCheck = 0;
                }
                x += 1;
                y -= 1;
                if (winCheck === 4) return this.state = "win";
            }
            if (i >= this.boardSize - 1) {
                currX += 1
            } else {
                currY += 1;
            }
            x = currX;
            y = currY;
            winCheck = 0;
        }

        //diagonal win 2
        currX = 0;
        currY = this.boardSize - 1;
        x = 0;
        y = this.boardSize - 1;
        for (let i = 0; i < this.boardSize*2 - 2; i++) {
            while(this.isWithinBounds(x, y)) {
                if (this.board[x][y] === this.player) {
                    winCheck++;
                } else {
                    winCheck = 0;
                }
                x -= 1;
                y -= 1;
                if (winCheck === 4) return this.state = "win";
            }
            if (i >= this.boardSize - 1) {
                currY -= 1;
            } else {
                currX += 1
            }
            x = currX;
            y = currY;
            winCheck = 0;
        }
    }

    isWithinBounds = (x, y) => x >=0 && x < this.boardSize && y >=0 && y < this.boardSize;

}

const boardSize = 5;

let view = new ConnectView(boardSize);
let model = new ConnectModel(boardSize);

view.run();