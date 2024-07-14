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
let scoreText;

function preload() {
    this.load.image('food', 'apple.gif');  // Ensure this path is correct
}

function create() {
    // Create the snake head
    snake = this.add.group();
    const head = this.add.rectangle(300, 300, 20, 20, 0x00ff00);
    this.physics.add.existing(head);
    head.body.setCollideWorldBounds(true);
    head.direction = null;
    snake.add(head);

    // Create food
    food = this.physics.add.image(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 600), 'food');
    this.physics.add.collider(head, food, eatFood, null, this);

    // Create cursors for keyboard input
    cursors = this.input.keyboard.createCursorKeys();

    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    // Make sure food gets eaten
    this.physics.add.overlap(head, food, eatFood, null, this);
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
        eatFood(head, food);
    }
}

function eatFood(head, food) {
    food.setPosition(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 600));
    score += 10;
    scoreText.setText('Score: ' + score);
    addSegment();
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
    const lastSegment = snake.getChildren()[snake.getLength() - 1];
    const newSegment = this.add.rectangle(lastSegment.x, lastSegment.y, 20, 20, 0x00ff00);
    this.physics.add.existing(newSegment);
    snake.add(newSegment);
}
