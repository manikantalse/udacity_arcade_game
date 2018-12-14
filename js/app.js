"use strict";

const WIDTH = 505;
const HEIGHT = 606;

// positions for the bugs across pavement
const magicalPositions = [1, 2.4, 3.8];

// modal div for reset
const modal = document.querySelector(".modal");

// variables
let spawner, lost = false, allEnemies = [];


class Entity {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
    // drawing it onto the canvas
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    };
}

// Enemy class

class Enemy extends Entity {

    // initialization
    constructor(x, y) {
        super(x,y);
        this.sprite = 'images/enemy-bug.png';

        // some random speed
        this.speed = random(5, 15);
    }

    // update the enemy position
    update(dt) {
        this.x += this.speed;

        // remove the bugs after they cross the screen as they are unwanted
        if (this.x > WIDTH) {
            allEnemies.splice(allEnemies.indexOf(this), 1);
        }
    };
};


// Player class 

class Player extends Entity {

    // initialization
    constructor(x, y) {
        super(x,y);
        this.sprite = 'images/char-boy.png'; 
    }

    // handling arrow inputs
    handleInput(direction) {
        if (!direction || lost) return;

        switch (direction) {
            case 'left': player.x > 0 ? player.x -= 101 : 0; break;
            case 'up': player.y > 0 ? (player.y < 80 ? (player.y -= 80, setTimeout(() => { reset("won") }, 100)) : player.y -= 80) : 0; break;
            case 'right': player.x < 404 ? player.x += 101 : 0; break;
            case 'down': player.y < 303 ? player.y += 80 : 0; break;
            default: break;
        }
    }

    // checking for collisions in update func...nothing more
    update() {
        for (const enemy of allEnemies) {
            if ((this.x + 20) < enemy.x + 101 && (this.x + 20) + 60 > enemy.x && (this.y + 120) < (enemy.y + 60) + 100 && (this.y + 120) + 10 > (this.y + 60)) {
                lost = true;
                setTimeout(() => { reset("lost") }, 5);
            }
        }
    }
}

// we will be using single player until the end
const player = new Player(2 * 101, 5 * 75);

// arrow key handling
document.addEventListener('keyup', function (e) {

    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});

// start the game 
start();

// start function definition for assigning few game restart variables
function start() {
    lost = false;
    [player.x, player.y] = [2 * 101, 5 * 75];
    modal.style.display = 'none';
    document.querySelectorAll(".status").forEach(function (elem) {
        elem.style.display = "none";
    })

    // added 3 enemies at the start so player won't have time to quickly move across the pavement during the first 500 ms
    for (let i = 0; i < 3; i++) {
        allEnemies.push(new Enemy(-101, magicalPositions[random(3)] * 60));
    }

    // restart the counter for bugs spawning
    spawner = setInterval(function () {
        allEnemies.push(new Enemy(-101, magicalPositions[random(3)] * 60));
    }, 500);
}

// function random returns between integers including r1 and excluding r2
function random(r1, r2) {
    let rand = Math.random();
    return r2 ? Math.floor(rand * r2) + r1 : Math.floor(rand * r1);
}


// resetting the game after winning or losing
function reset(status) {
    clearInterval(spawner);
    allEnemies = [];
    modal.style.display = "block";
    document.querySelectorAll("." + status).forEach(function (elem) {
        elem.style.display = "block";
    })
}
