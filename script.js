// Define HTML elements
const board = document.getElementById('game-board');
const instructionText = document.getElementById('instruction-text');
const logo = document.getElementById('logo');
const score = document.getElementById('score');
const highScoreText = document.getElementById('highScore');


// Define game variables
const GRID_SIZE = 30;
let snake = [{x: 10, y:10}];
let food = generateFood();
let gameStarted = false;
let highScore = 0;
let direction = 'right';
let gameInterval;
let gameSpeedDelay = 200;
const eatSound = new Audio('audio/eat-sound.mp3');
const collisionSound = new Audio('audio/game-over.mp3')

// Draw game map, snake, food
function draw() {
    board.innerHTML = '';
    drawSnake();
    if (gameStarted) {
        drawFood();
    }
    updateScore();
    updateHighScore();
}

// Draw snake 
function drawSnake() {
    snake.forEach((segment) => {
        const snakeElement = createGameElement('div', 'snake');
        setPosition(snakeElement, segment);
        board.appendChild(snakeElement);
    })
}

// Create a snake or food cube/div
function createGameElement(tag, className) {
    const element = document.createElement(tag);
    element.className = className; 
    return element;
}

// Set the position of the snake or the food
function setPosition(element, position) {
    element.style.gridColumn = position.x;
    element.style.gridRow = position.y;
}

// Draw food function
function drawFood() {
    const foodElement = createGameElement('div', 'food');
    setPosition(foodElement, food);
    board.appendChild(foodElement);
}

// Generate food at a random position
function generateFood() {
    const x = Math.floor(Math.random() * GRID_SIZE) + 1;
    const y = Math.floor(Math.random() * GRID_SIZE) + 1;
    return { x, y }; 
}

// Moving the snake
function move() {
    const head = { ...snake[0] }; // soft copy of original head
    switch (direction) {
        case 'up':
            head.y--;
            break;
        case 'down':
            head.y++;
            break;
        case 'left':
            head.x--;
            break;
        case 'right':
            head.x++;
            break;
    }
    // unshift adds a head object to the start of the snake array
    snake.unshift(head);
    
    if (head.x === food.x && head.y === food.y) {
        eatSound.play(); // Play sound on eating food
        food = generateFood(); // generate new food
        increaseSpeed();
        clearInterval(gameInterval); // clear past interval
        gameInterval = setInterval(() => {
            move();
            checkCollision();
            draw();
        }, gameSpeedDelay);
    } else {
        // removing the previous head object not to extend the snake
        snake.pop();
    }
}

// Start game function
function startGame() {
    gameStarted = true; // Keep track of a running game
    instructionText.style.display = 'none';
    logo.style.display = 'none';

    gameInterval = setInterval(() => {
        move();
        checkCollision();
        draw();
    }, gameSpeedDelay);
}

// Keypress event listener
function handleKeyPress(event) {
    if ( 
        (!gameStarted && event.code === 'Space') || 
        (!gameStarted && event.key === ' ') 
    ) {
        startGame();
    } else {
        switch (event.key) {
            case 'ArrowUp':
                direction = 'up';
                break;
            case 'ArrowDown':
                direction = 'down';
                break;
            case 'ArrowLeft':
                direction = 'left';
                break;
            case 'ArrowRight':
                direction = 'right';
                break; 
        }
    }
}

document.addEventListener('keydown', handleKeyPress);

// Gradually increase the speed the snake moves at
function increaseSpeed() {
    if (gameSpeedDelay > 150) {
        gameSpeedDelay -= 5;
    } else if (gameSpeedDelay > 100) {
        gameSpeedDelay -= 3;
    } else if (gameSpeedDelay > 50) {
        gameSpeedDelay -= 2;
    } else if (gameSpeedDelay > 20) {
        gameSpeedDelay -= 1;
    }
}

// Snake collision Logic with board edge or with itself
function checkCollision() {
    const head = snake[0];

    if ( head.x < 1 || head.x > GRID_SIZE || 
        head.y < 1 || head.y > GRID_SIZE
    ) {
        collisionSound.play(); // Play sound on collisioin with wall
        resetGame();
    }

    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            collisionSound.play(); // Play sound on collisioin with wall
            resetGame();
        }
    }
}

// Game Reset
function resetGame() {
    snake = [{ x: 10, y:10 }];
    food = generateFood();
    direction = 'right';
    gameSpeedDelay = 200;
    updateScore();
    updateHighScore();
    stopGame();
}

// Updates the score
function updateScore() {
    const currentScore = snake.length - 1;
    score.textContent = currentScore.toString().padStart(3, '0');
}

// Updates the highscore at the end of each game.
function updateHighScore() {
    const currentScore = snake.length - 1;
    if (currentScore > highScore) {
        highScore = currentScore;
        highScoreText.textContent = highScore.toString().padStart(3, '0');
    }
    highScoreText.style.display = 'block';
}

// Stops the game 
function stopGame() {
    clearInterval(gameInterval);
    gameStarted = false;
    instructionText.style.display = 'block';
    logo.style.display = 'block';
}
// draw();
// Test moving
// setInterval(() => {
//     move(); // Move head first
//     draw(); // Then draw again in the new position
// },200);