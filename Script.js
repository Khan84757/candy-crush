const grid = document.getElementById('grid');
const scoreDisplay = document.getElementById('score');

const width = 8;
const candies = ['red', 'yellow', 'green', 'blue', 'purple'];
let score = 0;
let squares = [];

// Create the game board
function createBoard() {
    for (let i = 0; i < width * width; i++) {
        const square = document.createElement('div');
        const randomCandy = Math.floor(Math.random() * candies.length);
        square.setAttribute('draggable', true);
        square.setAttribute('id', i);
        square.classList.add('candy', candies[randomCandy]);
        grid.appendChild(square);
        squares.push(square);
    }
}
createBoard();

// Dragging logic
let colorBeingDragged;
let colorBeingReplaced;
let squareIdBeingDragged;
let squareIdBeingReplaced;

squares.forEach(square => square.addEventListener('dragstart', dragStart));
squares.forEach(square => square.addEventListener('dragend', dragEnd));
squares.forEach(square => square.addEventListener('dragover', dragOver));
squares.forEach(square => square.addEventListener('dragenter', dragEnter));
squares.forEach(square => square.addEventListener('dragleave', dragLeave));
squares.forEach(square => square.addEventListener('drop', dragDrop));

function dragStart() {
    colorBeingDragged = this.className;
    squareIdBeingDragged = parseInt(this.id);
}

function dragDrop() {
    colorBeingReplaced = this.className;
    squareIdBeingReplaced = parseInt(this.id);
    squares[squareIdBeingDragged].className = colorBeingReplaced;
    squares[squareIdBeingReplaced].className = colorBeingDragged;
}

function dragEnd() {
    const validMoves = [
        squareIdBeingDragged - 1,
        squareIdBeingDragged + 1,
        squareIdBeingDragged - width,
        squareIdBeingDragged + width,
    ];
    const validMove = validMoves.includes(squareIdBeingReplaced);

    if (squareIdBeingReplaced && validMove) {
        squareIdBeingReplaced = null;
    } else if (squareIdBeingReplaced && !validMove) {
        squares[squareIdBeingDragged].className = colorBeingDragged;
        squares[squareIdBeingReplaced].className = colorBeingReplaced;
    } else squares[squareIdBeingDragged].className = colorBeingDragged;

    checkMatches();
}

// Check for matches
function checkMatches() {
    // Check for rows of three
    for (let i = 0; i < width * width; i++) {
        const rowOfThree = [i, i + 1, i + 2];
        const decidedColor = squares[i].className;
        const isBlank = !squares[i].classList.contains('candy');

        if (rowOfThree.every(index => squares[index]?.className === decidedColor && !isBlank)) {
            score += 3;
            scoreDisplay.textContent = score;
            rowOfThree.forEach(index => {
                squares[index].className = '';
            });
        }
    }

    // Check for columns of three
    for (let i = 0; i < width * (width - 2); i++) {
        const columnOfThree = [i, i + width, i + width * 2];
        const decidedColor = squares[i].className;
        const isBlank = !squares[i].classList.contains('candy');

        if (columnOfThree.every(index => squares[index]?.className === decidedColor && !isBlank)) {
            score += 3;
            scoreDisplay.textContent = score;
            columnOfThree.forEach(index => {
                squares[index].className = '';
            });
        }
    }
}

window.setInterval(() => {
    checkMatches();
    moveDown();
}, 100);

// Move candies down
function moveDown() {
    for (let i = 0; i < width * (width - 1); i++) {
        if (squares[i + width]?.className === '') {
            squares[i + width].className = squares[i].className;
            squares[i].className = '';
        }

        // Refill top row
        if (i < width && squares[i]?.className === '') {
            const randomCandy = Math.floor(Math.random() * candies.length);
            squares[i].className = `candy ${candies[randomCandy]}`;
        }
    }
}
