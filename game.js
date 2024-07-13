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
    }
};

const game = new Phaser.Game(config);
let snake;
let food;
let cursors;
let score = 0;
let scoreText;

function preload() {
    this.load.image('snake', 'https://yourwebsite.com/path/to/snake.png');
    this.load.image('food', 'https://yourwebsite.com/path/to/apple.gif');
}

function create() {
    snake = this.physics.add.group();

    // Initial snake body
    for (let i = 0; i < 3; i++) {
        snake.create(300 + i * 20, 300, 'snake');
    }

    food = this.physics.add.image(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 600), 'food');
    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });
}

function update() {
    let head = snake.getChildren()[0];

    if (cursors.left.isDown && head.direction !== 'right') {
        head.direction = 'left';
    } else if (cursors.right.isDown && head.direction !== 'left') {
        head.direction = 'right';
    } else if (cursors.up.isDown && head.direction !== 'down') {
        head.direction = 'up';
    } else if (cursors.down.isDown && head.direction !== 'up') {
        head.direction = 'down';
    }

    if (head.direction) {
        moveSnake(head.direction);
    }

    if (Phaser.Geom.Intersects.RectangleToRectangle(head.getBounds(), food.getBounds())) {
        food.setPosition(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 600));
        score += 10;
        scoreText.setText('Score: ' + score);
        addSegment();
    }
}

function moveSnake(direction) {
    let head = snake.getChildren()[0];
    let x = head.x;
    let y = head.y;

    if (direction === 'left') {
        x -= 20;
    } else if (direction === 'right') {
        x += 20;
    } else if (direction === 'up') {
        y -= 20;
    } else if (direction === 'down') {
        y += 20;
    }

    head.setPosition(x, y);
}

function addSegment() {
    let newSegment = snake.create(0, 0, 'snake');
    newSegment.setPosition(snake.getChildren()[snake.getLength() - 1].x, snake.getChildren()[snake.getLength() - 1].y);
}
