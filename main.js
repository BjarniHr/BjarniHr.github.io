// const { debug } = require("console");

// const { start } = require("repl");

var canvas = document.querySelector('canvas');
var ctx = canvas.getContext('2d');

const width = canvas.width = window.innerWidth;
const height = canvas.height = window.innerHeight;
const fullScreenButton = document.getElementById("fullScreenButton");

class Circle {
    constructor(x, y, velocity, radius, friction) {
        this.x = x;
        this.y = y;
        this.velocity = velocity;
        this.radius = radius
        this.velocityX = 0;
        this.velocityY = 0;
        this.friction = friction;

        window.addEventListener('keydown', (e) => {
            if (e.key == "a") {
                this.velocityX = -this.velocity.x;
            }
            if (e.key == "d") {
                this.velocityX = this.velocity.x;
            }
            if (e.key == "w") {
                this.velocityY = -this.velocity.y;
            }
            if (e.key == "s") {
                this.velocityY = this.velocity.y;
            }
        });
    }

    restart() {
        this.x = width / 2;
        this.y = height / 2;
        this.velocityX = this.velocityY = 0;
    }

    draw = () => {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "purple";
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.stroke();
        // console.log("draw function");
    }

    update() {
        this.draw();
        this.velocityX *= this.friction;
        this.velocityY *= this.friction;
        this.x += this.velocityX;
        this.y += this.velocityY;

        if (this.x <= 0) {
            this.x = width;
        }
        else if (this.x >= width) {
            this.x = 0;
        }
        if (this.y <= 0) {
            this.y = height;
        }
        else if (this.y >= height) {
            this.y = 0;
        }
    }
}

class Projectile {
    constructor(x, y, velocity, radius) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "white";
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;
    }
}

class Enemy {
    constructor(x, y, velocity, radius, friction) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.friction = friction;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "grey";
        ctx.fill();
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x <= 0) {
            this.x = width;
        }
        else if (this.x >= width) {
            this.x = 0;
        }
        if (this.y <= 0) {
            this.y = height;
        }
        else if (this.y >= height) {
            this.y = 0;
        }
    }
}

class EnemySquare {
    constructor(x, y, velocity, radius, friction) {
        this.x = x;
        this.y = y;
        this.radius = radius * 2;
        this.velocity = velocity;
        this.friction = friction;
    }

    draw() {
        ctx.fillStyle = "grey";
        ctx.fillRect(this.x - (this.radius / 2), this.y - (this.radius / 2), this.radius, this.radius);
    }

    update() {
        this.draw();
        this.x += this.velocity.x;
        this.y += this.velocity.y;

        if (this.x <= 0) {
            this.x = width;
        }
        else if (this.x >= width) {
            this.x = 0;
        }
        if (this.y <= 0) {
            this.y = height;
        }
        else if (this.y >= height) {
            this.y = 0;
        }
    }
}

class Particle {
    constructor(x, y, radius, velocity) {
        this.x = x;
        this.y = y;
        this.radius = radius;
        this.velocity = velocity;
        this.alpha = 1;
    }

    draw() {
        ctx.save();
        ctx.globalAlpha = this.alpha;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, false);
        ctx.fillStyle = "grey";
        ctx.fill();
        ctx.restore();
    }

    update() {
        this.draw();
        this.velocity.x *= friction
        this.velocity.y *= friction
        this.x += this.velocity.x;
        this.y += this.velocity.y;
        this.alpha -= 0.01
    }
}

let score = 0;

const friction = 0.98;
const posX = width / 2;
const posY = height / 2;
const velocity = {
    x: 5,
    y: 5
}
const radius = 30;

let player = new Circle(posX, posY, velocity, radius, friction);

const spawnRadiusDir = 100;
let enemies = [];
let projectiles = [];
let particles = [];

function toggleFullScreen() {
    console.log(document.fullscreenElement);
    if (!document.fullscreenElement) {
        canvas.requestFullscreen().then().catch(err => {
            alert(`Error, can't enable full-screen mode: ${err.message}`);
        });
    } else {
        document.exitFullscreen();
    }
}
fullScreenButton.addEventListener('click', toggleFullScreen);


// -----------------------------

let touchY = 0;
let touchX = 0;
const touchThreshold = 30;

window.addEventListener("touchstart", (e) => {
    touchY = e.changedTouches[0].pageY;
    touchX = e.changedTouches[0].pageX;
});
/* window.addEventListener("touchmove", (e) => {
    console.log(e.changedTouches[0].pageY)
}); */
window.addEventListener("touchend", (e) => {
    let distanceY = e.changedTouches[0].pageY - touchY;
    let distanceX = e.changedTouches[0].pageX - touchX;
    console.log(`X: ${distanceX} & Y: ${distanceY}`);
    if (-touchThreshold < distanceY && distanceY < touchThreshold && -touchThreshold < distanceX && distanceX < touchThreshold) {
        const angle = Math.atan2(e.changedTouches[0].pageY - player.y, e.changedTouches[0].pageX - player.x)
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }
        projectiles.push(new Projectile(
            player.x, player.y, velocity, 5
        ))
    }
    else {
        const angle = Math.atan2(e.changedTouches[0].pageY - touchY, e.changedTouches[0].pageX - touchX)
        const velocity = {
            x: Math.cos(angle) * 5,
            y: Math.sin(angle) * 5
        }
        player.velocityX = velocity.x;
        player.velocityY = velocity.y;
    }
});

// ----------------------------------
/* const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x)
const velocity = {
    x: Math.cos(angle) * 5,
    y: Math.sin(angle) * 5
}
projectiles.push(new Projectile(
    player.x, player.y, velocity, 5
)) */
// ----------------------------------

function restartGame() {
    player.restart();
    enemies = [];
    projectiles = [];
    particles = [];
    score = 0;

    gameOver = false;
    loop();
    spawnEnemies();
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function startingScreen() {
    let startButton = document.createElement("button");
    startButton.innerHTML = "Start Game";
    startButton.id = "button"
    document.body.appendChild(startButton);

    startButton.addEventListener("click", function () {
        startButton.style.display = "none";
        restartGame();
    })
}

function endScreen() {
    canvas.style.display = "hidden";
    ctx.font = "32px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, posX - 50, posY - 20);
    let startButton = document.createElement("button");
    startButton.innerHTML = "Start Game";
    startButton.id = "button"
    document.body.appendChild(startButton);

    startButton.addEventListener("click", function () {
        startButton.style.display = "none";
        restartGame();
    })
}

function spawnEnemies() {
    setInterval(() => {
        const radius = Math.random() * 25 + 15;
        let x;
        let y;
        if (Math.random() < 0.5) {
            x = Math.random() < 0.5
                ? 0 - radius
                : width + radius;
            y = Math.random() * height;
        }
        else {
            y = Math.random() < 0.5
                ? 0 - radius
                : height + radius;
            x = Math.random() * width;
        }
        /* if (Math.random() < 0.5) {
            addRndX = Math.random() * spawnRadiusDir;
        }
        else {
            addRndX = Math.random() * spawnRadiusDir;
        }
        if (Math.random() < 0.5) {
            addRndY = Math.random() * spawnRadiusDir;
        }
        else {
            addRndY = Math.random() * spawnRadiusDir;
        }
        const angle = Math.atan2(
            (height / 2 + addRndY) - y,
            (width / 2 + addRndX) - x)
        const velocity = {
            x: Math.cos(angle),
            y: Math.sin(angle)
        }
        */

        if (Math.random() < 0.5) {
            velX = Math.random();
        }
        else {
            velX = -Math.random();
        }
        if (Math.random() < 0.5) {
            velY = Math.random();
        }
        else {
            velY = -Math.random();
        }
        const velocity = {
            x: velX,
            y: velY
        }

        rndShape = Math.random()

        if (rndShape <= 0.5) {
            enemies.push(new Enemy(x, y, velocity, radius))
        } else {
            enemies.push(new EnemySquare(x, y, velocity, radius))
        }
    }, 800)
}

let gameOver = false;
let animationId;
function loop() {
    animationId = requestAnimationFrame(loop);
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fillRect(0, 0, width, height);
    drawScore();
    score += 1;

    player.update();

    particles.forEach((particle, partIndex) => {
        if (particle.alpha <= 0) {
            particles.splice(partIndex, 1);
        } else {
            particle.update();
        }
    })

    projectiles.forEach((projectile, projIndex) => {
        projectile.update();

        if (projectile.x + projectile.radius < 0 ||
            projectile.x - projectile.radius > width ||
            projectile.y + projectile.radius < 0 ||
            projectile.y - projectile.radius > height) {
            setTimeout(() => {
                projectiles.splice(projIndex, 1)
            }, 0)
        }
    })
    enemies.forEach((enemy, index) => {
        enemy.update();

        const dist = Math.hypot(player.x - enemy.x, player.y - enemy.y);

        if (dist - enemy.radius - player.radius < 1) {
            console.log("End Game!")
            gameOver = true;
            cancelAnimationFrame(animationId);
            endScreen();
        }

        projectiles.forEach((projectile, projIndex) => {
            const dist = Math.hypot(projectile.x - enemy.x, projectile.y - enemy.y);

            if (dist - enemy.radius - projectile.radius < 1) {

                for (let i = 0; i < enemy.radius * 2; i++) {

                    particles.push(
                        new Particle(
                            projectile.x,
                            projectile.y,
                            Math.random() * 3,
                            {
                                x: (Math.random() - 0.5) * (Math.random() * 6),
                                y: (Math.random() - 0.5) * (Math.random() * 6)
                            }
                        )
                    )
                }

                if (enemy.radius - 10 > 10) {
                    gsap.to(enemy, {
                        radius: enemy.radius - 10
                    })
                    setTimeout(() => {
                        projectiles.splice(projIndex, 1)
                    }, 0)
                } else {
                    setTimeout(() => {
                        navigator.vibrate(200);
                        score += 200;
                        enemies.splice(index, 1);
                        projectiles.splice(projIndex, 1)
                    }, 0)
                }
            }
        })
    })
}


addEventListener('click', (event) => {
    const angle = Math.atan2(event.clientY - player.y, event.clientX - player.x)
    const velocity = {
        x: Math.cos(angle) * 5,
        y: Math.sin(angle) * 5
    }
    projectiles.push(new Projectile(
        player.x, player.y, velocity, 5
    ))
})


startingScreen();

