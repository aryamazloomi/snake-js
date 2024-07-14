const config = {
    type: Phaser.AUTO,
    width: 600,
    height: 600,
    parent: 'game-container',
    backgroundColor: 'lightblue',
    scene: {
        preload: preload,
        create: create,
        update: update
    },
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
};

const game = new Phaser.Game(config);
let snake;
let food;
let cursors;
let score = 0;
let highScore = 0;
let scoreText;
let aiMode = false;
let running = false;

function preload() {
    this.load.image('food', 'apple.gif');  // Ensure this path is correct
}

function create() {
    // Create the snake head
    snake = this.physics.add.group();
    let head = this.add.rectangle(300, 300, 20, 20, 0x00ff00);
    this.physics.add.existing(head);
    head.body.setCollideWorldBounds(true);
    head.direction = 'stop';
    snake.add(head);

    // Create food
    food = this.physics.add.image(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 600), 'food');

    // Create cursors for keyboard input
    cursors = this.input.keyboard.createCursorKeys();
    this.input.keyboard.on('keydown-SPACE', startGame, this);
    this.input.keyboard.on('keydown-I', startAIMode, this);

    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0  High Score: 0', { fontSize: '32px', fill: '#000' });

    // Add overlap detection
    this.physics.add.overlap(snake, food, eatFood, null, this);

    showMenu();
}

function update() {
    if (!running) return;

    let head = snake.getChildren()[0];

    if (aiMode) {
        aiMove();
    } else {
        if (cursors.left.isDown && head.direction !== 'right') {
            head.direction = 'left';
        } else if (cursors.right.isDown && head.direction !== 'left') {
            head.direction = 'right';
        } else if (cursors.up.isDown && head.direction !== 'down') {
            head.direction = 'up';
        } else if (cursors.down.isDown && head.direction !== 'up') {
            head.direction = 'down';
        }
    }

    moveSnake(head);
    checkCollision(head);
}

function showMenu() {
    running = false;
    aiMode = false;
    scoreText.setText("Welcome to Snake Game\nPress 'Space' to Start\nPress 'I' for AI Mode");
}

function startGame() {
    running = true;
    aiMode = false;
    resetGame();
}

function startAIMode() {
    running = true;
    aiMode = true;
    resetGame();
}

function resetGame() {
    score = 0;
    snake.clear(true, true);

    let head = this.add.rectangle(300, 300, 20, 20, 0x00ff00);
    this.physics.add.existing(head);
    head.body.setCollideWorldBounds(true);
    head.direction = 'stop';
    snake.add(head);

    scoreText.setText('Score: 0  High Score: ' + highScore);
}

function moveSnake(head) {
    if (head.direction === 'left') {
        head.x -= 20;
    } else if (head.direction === 'right') {
        head.x += 20;
    } else if (head.direction === 'up') {
        head.y -= 20;
    } else if (head.direction === 'down') {
        head.y += 20;
    }
}

function eatFood(head, food) {
    food.setPosition(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 600));
    score += 10;
    scoreText.setText('Score: ' + score + '  High Score: ' + highScore);
}

function checkCollision(head) {
    if (head.x > 600 || head.x < 0 || head.y > 600 || head.y < 0) {
        showMenu();
    }
}

function aiMove() {
    let head = snake.getChildren()[0];
    let foodX = food.x;
    let foodY = food.y;

    let directions = ['left', 'right', 'up', 'down'];
    let moveDirection = null;
    let minDistance = Infinity;

    directions.forEach(dir => {
        let newX = head.x + (dir === 'left' ? -20 : dir === 'right' ? 20 : 0);
        let newY = head.y + (dir === 'up' ? -20 : dir === 'down' ? 20 : 0);

        if (newX < 0 || newX > 600 || newY < 0 || newY > 600) return;

        let distance = Phaser.Math.Distance.Between(newX, newY, foodX, foodY);

        if (distance < minDistance) {
            minDistance = distance;
            moveDirection = dir;
        }
    });

    head.direction = moveDirection;
}
