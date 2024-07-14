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
    // Load assets
    this.load.image('food', 'https://aryamazloomi.github.io/snake-js/apple.gifapple.gif');  // Ensure this path is correct
}

function create() {
    // Create the snake head
    snake = this.add.group();
    const head = this.add.rectangle(300, 300, 20, 20, 0x00ff00);
    this.physics.add.existing(head);
    snake.add(head);

    // Create food
    food = this.physics.add.image(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 600), 'food');
    this.physics.add.collider(head, food, eatFood, null, this);

    // Create cursors for keyboard input
    cursors = this.input.keyboard.createCursorKeys();

    // Create score text
    scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#000' });

    this.physics.add.overlap(head, food, eatFood, null, this);
}

function update() {
    let head = snake.getChildren()[0];

    if (cursors.left.isDown) {
        head.setVelocityX(-160);
        head.setVelocityY(0);
    } else if (cursors.right.isDown) {
        head.setVelocityX(160);
        head.setVelocityY(0);
    } else if (cursors.up.isDown) {
        head.setVelocityY(-160);
        head.setVelocityX(0);
    } else if (cursors.down.isDown) {
        head.setVelocityY(160);
        head.setVelocityX(0);
    }
}

function eatFood(head, food) {
    food.setPosition(Phaser.Math.Between(0, 600), Phaser.Math.Between(0, 600));
    score += 10;
    scoreText.setText('Score: ' + score);
    addSegment();
}

function addSegment() {
    const lastSegment = snake.getChildren()[snake.getLength() - 1];
    const newSegment = this.add.rectangle(lastSegment.x, lastSegment.y, 20, 20, 0x00ff00);
    this.physics.add.existing(newSegment);
    snake.add(newSegment);
}
