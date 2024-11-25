// Set up the game parameters
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scale = 20; // size of each snake segment and food
const rows = canvas.height / scale;
const columns = canvas.width / scale;

// Initialize the snake and food
let snake = [{ x: 5 * scale, y: 5 * scale }];
let direction = 'right'; // initial movement direction
let food = generateFood();
let gameInterval; // to store the interval ID for the game loop
let isPaused = false; // track the pause state
let countdownTimer; // track the countdown timer
let timeoutId;

function addKeyListener() {
  // Set up event listener for keypresses to control the snake
  document.addEventListener('keydown', changeDirection);
}

function removeKeyListener() {
  // Remove event listener for keypresses to control the snake
  document.removeEventListener('keydown', changeDirection);
}

// Start button functionality
document.getElementById('startButton').addEventListener('click', startGame);

// Stop button functionality
document.getElementById('stopButton').addEventListener('click', stopGame);

// Pause button functionality
document.getElementById('pauseButton').addEventListener('click', togglePause);

// Countdown function
function startCountdown() {
  let countdownValue = 3; // Countdown starts from 3 seconds
  document.getElementById('startButton').disabled = true; // Disable start button during countdown
  document.getElementById('stopButton').disabled = true; // Disable stop button during countdown
  document.getElementById('pauseButton').disabled = true; // Disable pause button during countdown

  // Display countdown message
  const countdownDisplay = document.createElement('div');
  countdownDisplay.innerText = `Starting in: ${countdownValue}`;
  document.body.appendChild(countdownDisplay);

  countdownTimer = setInterval(function () {
    countdownValue--;
    countdownDisplay.innerText = `Starting in: ${countdownValue}`;
    if (countdownValue <= 0) {
      clearInterval(countdownTimer);
      countdownDisplay.remove(); // Remove countdown display

      document.getElementById('stopButton').disabled = false; // Enable stop button during countdown
      document.getElementById('pauseButton').disabled = false; // Enable pause button during countdown
      gameLoop(); // Start the game after countdown
    }
  }, 1000);
}

// The game loop (runs every 100 ms)
function gameLoop() {
  if (gameOver()) {
    clearTimeout(timeoutId);
    alert('Game Over!');
    stopGame();
    return;
  }

  timeoutId = setTimeout(function () {
    if (isPaused) {
      return;
    }
    clearCanvas();
    drawFood();
    moveSnake();
    drawSnake();
    gameLoop();
  }, 100);
}

// Clear the canvas
function clearCanvas() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// Draw the snake
function drawSnake() {
  ctx.fillStyle = 'green';
  for (let i = 0; i < snake.length; i++) {
    ctx.fillRect(snake[i].x, snake[i].y, scale, scale);
  }
}

// Draw the food
function drawFood() {
  ctx.fillStyle = 'red';
  ctx.fillRect(food.x, food.y, scale, scale);
}

// Generate a new food position
function generateFood() {
  let x = Math.floor(Math.random() * columns) * scale;
  let y = Math.floor(Math.random() * rows) * scale;
  return { x, y };
}

// Move the snake based on its current direction
function moveSnake() {
  const head = { ...snake[0] };

  if (direction === 'left') head.x -= scale;
  if (direction === 'right') head.x += scale;
  if (direction === 'up') head.y -= scale;
  if (direction === 'down') head.y += scale;

  // Add the new head to the snake
  snake.unshift(head);

  // Check if snake eats the food
  if (head.x === food.x && head.y === food.y) {
    food = generateFood(); // Generate new food
  } else {
    snake.pop(); // Remove the last segment
  }
}

// Change the snake's direction based on user input
function changeDirection(event) {
  if (event.keyCode === 37 && direction !== 'right') direction = 'left';
  if (event.keyCode === 38 && direction !== 'down') direction = 'up';
  if (event.keyCode === 39 && direction !== 'left') direction = 'right';
  if (event.keyCode === 40 && direction !== 'up') direction = 'down';
}

// Check for game over conditions
function gameOver() {
  const head = snake[0];

  // Check if snake hits the walls
  if (head.x < 0 || head.x >= canvas.width || head.y < 0 || head.y >= canvas.height) {
    return true;
  }

  // Check if snake hits itself
  for (let i = 1; i < snake.length; i++) {
    if (head.x === snake[i].x && head.y === snake[i].y) {
      return true;
    }
  }

  return false;
}

// Reset the game state
function resetGame() {
  snake = [{ x: 5 * scale, y: 5 * scale }];
  direction = 'right';
  food = generateFood();
  isPaused = false;
  document.getElementById('pauseButton').innerText = 'Pause';
}

// Start the game
function startGame() {
  resetGame();
  addKeyListener();
  document.getElementById('startButton').disabled = true;
  document.getElementById('stopButton').disabled = false;
  document.getElementById('pauseButton').disabled = false;
  startCountdown(); // Begin countdown before the game starts
}

// Stop the game
function stopGame() {
  isPaused = true;
  removeKeyListener();
  document.getElementById('startButton').disabled = false;
  document.getElementById('stopButton').disabled = true;
  document.getElementById('pauseButton').disabled = true;
}

// Toggle the pause state
function togglePause() {
  if (isPaused) {
    isPaused = false;
    addKeyListener();
    gameLoop();
  } else {
    isPaused = true;
    removeKeyListener();
  }
  document.getElementById('pauseButton').innerText = isPaused ? 'Resume' : 'Pause';
}

// Initial setup (Make sure the game is stopped)
document.getElementById('stopButton').disabled = true;
document.getElementById('pauseButton').disabled = true;
