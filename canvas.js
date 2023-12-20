const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.height = 200;
canvas.width = canvas.height * 2;
var check = 0;
var index = 0;
var maxbullets = 1000;
var speed = 1;
if(confirm("do you want easy mode?")) {
    var maxenemys = 20;
} {
    maxenemys = 50;
    speed = 1.5;
}
var maxdistance = 10;
var reaction = 0.05;
var player1 = {
    x: Math.round(canvas.width / 2),
    y: Math.round(canvas.height / 2),
    x2: this.x,
    y2: this.y,
    ox: this.x,
    oy: this.y,
    goalX: -1,
    goalY: 1,
    speedX: 1,
    speedY: 1,
    speed: 2,
    changespeed: 5,
    currentspeed: 2,
    gunlength: 20,
    maxhealth: 40
}
var mouse = {
    x: 0,
    y: 0
}
function RB(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min)
}

var pos = (a) => {
    if(a < 0) {
        return (0-a);
    } else if(a >= 0) {
        return a;
    }
}
var distance = (x1,y1,x2,y2) => {
    //d=√((x_2-x_1)²+(y_2-y_1)²)
    return Math.sqrt((x2-x1)**2+(y2-y1)**2);
}
var dif = (a,b) => {
    if(a > b) {
        return a - b;
    } else if(b > a) {
        return b - a;
    } else if(b == a) {
        return 0;
    }
}
var test = (x,y,x2,y2,XorY) => {
    let aX = x - x2;
    let aY = y - y2;
    let sumX = 0 - aX;
    let sumY = 0 - aY;
    let division = (pos(aX) + pos(aY));
    if(XorY == "X") {
        return sumX / division;
    } else if(XorY == "Y") {
        return sumY / division;
    }
}
class bullet {
    constructor(x,y,speedX,speedY,index) {
        this.x = x;
        this.y = y;
        this.speedX = speedX;
        this.speedY = speedY;
        this.index = index;
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
    }
    end() {
        this.x = canvas.width * 1.5;
        this.y = canvas.height * 1.5;
        this.speedX = 0;
        this.speedY = 0;
    }
    new(x1,y1,speedX1,speedY1,index1,speed) {
        this.x = x1;
        this.y = y1;
        this.speedX = speedX1 * speed;
        this.speedY = speedY1 * speed;
        this.index = index1;
    }
}
class enemy {
    constructor(x,y,x2,y2,reaction,clump,supe) {
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.x2 = x2;
        this.y2 = y2;
        this.attack = 1;
        this.supe = supe;
        this.reaction = reaction;
        this.speedX = test(this.x,this.y,this.x2,this.y2,"X");
        this.speedY = test(this.x,this.y,this.x2,this.y2,"Y");
        this.goalX = test(this.x,this.y,this.x2,this.y2,"X");
        this.goalY = test(this.x,this.y,this.x2,this.y2,"Y");
        this.clump = clump;
    }
    update(x2,y2,speed) {
        this.ox = this.x;
        this.oy = this.y;
        this.x2 = x2;
        this.y2 = y2;
        this.goalX = test(this.x,this.y,this.x2,this.y2,"X");
        this.goalY = test(this.x,this.y,this.x2,this.y2,"Y");
        if(this.speedX < this.goalX) {
            this.speedX += this.reaction;
        } else if(this.speedX > this.goalX) {
            this.speedX -= this.reaction;
        }
        if(this.speedY < this.goalY) {
            this.speedY += this.reaction;
        } else if(this.speedY > this.goalY) {
            this.speedY -= this.reaction;
        }
        if(this.supe == 1) {
            this.x += this.speedX * speed * 2;
            this.y += this.speedY * speed * 2;
        } else {
            this.x += this.speedX * speed;
            this.y += this.speedY * speed;
        }
    }
    new(x,y,x2,y2,reaction,clump) {
        this.x = x;
        this.y = y;
        this.ox = x;
        this.oy = y;
        this.x2 = x2;
        this.y2 = y2;
        this.supe = 0;
        this.reaction = reaction;
        this.speedX = test(this.x,this.y,this.x2,this.y2,"X");
        this.speedY = test(this.x,this.y,this.x2,this.y2,"Y");
        this.goalX = test(this.x,this.y,this.x2,this.y2,"X");
        this.goalY = test(this.x,this.y,this.x2,this.y2,"Y");
        this.clump = clump;
    }
}
var enemys = []
var bullets = [];
for(let i = 0; i < maxbullets; i++) {
    bullets[i] = new bullet(-5,-5,0,0,0);
}
for(let i = 0; i < maxenemys; i++) {
    let a = RB(1,4)
    if(a == 1) {
        enemys[i] = new enemy(0,RB(0,canvas.height),player1.x,player1.y,reaction,RB(1,3));
    } else if(a == 2) {
        enemys[i] = new enemy(canvas.width,RB(0,canvas.height),player1.x,player1.y,reaction,RB(1,3));
    } else if(a == 3) {
        enemys[i] = new enemy(RB(0,canvas.width),0,player1.x,player1.y,reaction,RB(1,3));
    } else if(a == 4) {
        enemys[i] = new enemy(RB(0,canvas.width),canvas.height,player1.x,player1.y,reaction,RB(1,3));
    }
}

var array2D = (y,x) => {
    var array = [];
    for(let i = 0 - y; i < y; i++) {
        array[i] = [];
        for(let j = 0 - x; j < x; j++) {
            array[i][j] = null;
        }
    }
    return array;
}
var map = array2D(canvas.height * 3,canvas.width * 3);
var map2 = array2D(canvas.height * 3,canvas.width * 3);



window.addEventListener('resize', () => {
    drawing();
})

var drawing = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0; i < canvas.height; i++) {
        for(let j = 0; j < canvas.width; j++) {
            if(map[i][j] == 1) {
                ctx.fillStyle = "red";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 2) {
                ctx.fillStyle = "white";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 3) {
                ctx.fillStyle = "blue";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 4) {
                ctx.fillStyle = "grey";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 5) {
                ctx.fillStyle = "white";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 6) {
                ctx.fillStyle = "green";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 7) {
                ctx.fillStyle = "red";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            }
        }
    }
    
}

var reset = () => {
    for(let i = 0; i < maxenemys; i++) {
        let a = RB(1,4);
            let b = RB(1,3);
            if(a == 1 && b != 1) {
                enemys[i].new(0 - canvas.width,RB(0,canvas.height),player1.x,player1.y,reaction,0);
            } else if(a == 2 && b != 1) {
                enemys[i].new(canvas.width * 2,RB(0,canvas.height),player1.x,player1.y,reaction,0);
            } else if(a == 3 && b != 1) {
                enemys[i].new(RB(0,canvas.width),0 - canvas.height,player1.x,player1.y,reaction,0);
            } else if(a == 4 && b != 1) {
                enemys[i].new(RB(0,canvas.width),canvas.height * 2,player1.x,player1.y,reaction,0);
            } else if(a == 1 && b == 1) { // clumps
                enemys[i].new(0,RB(0,canvas.height),player1.x,player1.y,reaction,1);
            } else if(a == 2) {
                enemys[i].new(canvas.width,RB(0,canvas.height),player1.x,player1.y,reaction,1);
            } else if(a == 3) {
                enemys[i].new(RB(0,canvas.width),0,player1.x,player1.y,reaction,1);
            } else if(a == 4) {
                enemys[i].new(RB(0,canvas.width),canvas.height,player1.x,player1.y,reaction,1);
            }
    }
    player1.gunlength = 20;
    player1.x = Math.floor(canvas.width / 2);
    player1.y = Math.floor(canvas.height / 2);
    alert("YOU LOSE!");
}

var keys = [];
onkeydown = onkeyup = (e) => {
    keys[e.keyCode] = e.type == 'keydown';
    if(keys[32]) {
            if(player1.currentspeed == 0) {
                player1.currentspeed = 2;
            } else if(player1.currentspeed > 0) {
                player1.currentspeed = 0;
            }
        keys[32] = 0;
    }
}

var move = () => {
    mouse.y = Math.floor((e.y / window.innerHeight) * canvas.height);
    mouse.x = Math.floor((e.x / window.innerWidth) * canvas.width);
    player1.goalX = test(player1.x,player1.y,mouse.x,mouse.y,"X");
    player1.goalY = test(player1.x,player1.y,mouse.x,mouse.y,"Y");
}
var shoot = () => {
    index++;
    if(index >= maxbullets) {
        index = 0;
    }
    bullets[index].new(player1.x2,player1.y2,player1.speedX,player1.speedY,0,5);
}
var shooting = 0;
addEventListener("mousemove", (e) => {
    mouse.y = Math.floor((e.y / window.innerHeight) * canvas.height);
    mouse.x = Math.floor((e.x / window.innerWidth) * canvas.width);
    player1.goalX = test(player1.x,player1.y,mouse.x,mouse.y,"X");
    player1.goalY = test(player1.x,player1.y,mouse.x,mouse.y,"Y");
})
addEventListener("click", (e) => {
    shoot();
})
var handlebullets = () => {
        {for(let i = 0; i < maxbullets; i++) {
        bullets[i].update();
        if(bullets[i].x > canvas.width) {
            bullets[i].end();
            //bullets[i].x = 0;
        } else if(bullets[i].x < 0) {
            bullets[i].end();
            //bullets[i].x = canvas.width;
        }
        if(bullets[i].y > canvas.height) {
            bullets[i].end();
            //bullets[i].y = 0;
        } else if(bullets[i].y < 0) {
            bullets[i].end();
            //bullets[i].y = canvas.height;
        }
        for(let x = -1;x < 2; x++) {
            for(let y = -1; y < 2; y++) {
                map[Math.floor(bullets[i].y) + y][Math.floor(bullets[i].x) + x] = 5;
            }
        }
    }
    }
}
var handleEnemys = () => {
    for(let i = 0; i < maxenemys; i++) {
        enemys[i].update(player1.x,player1.y,speed);
        /*
        if(enemys[i].x > canvas.width) {
            //enemys[i].x = 0;
            enemys[i].speedX = 0 - enemys[i].speedX;
        } else if(enemys[i].x < 0) {
            //enemys[i].x = canvas.width;
            enemys[i].speedX = 0 - enemys[i].speedX;
        }
        if(enemys[i].y > canvas.height) {
            //enemys[i].y = 0;
            enemys[i].speedY = 0 - enemys[i].speedY;
        } else if(enemys[i].y < 0) {
            //enemys[i].y = canvas.height;
            enemys[i].speedY = 0 - enemys[i].speedY;
        }
        */
        for(let j = 0; j < maxenemys; j++) { //I think this is slower and maybe I could just check around the enemy somehow
            if(i != j) {
                if(distance(enemys[i].x,enemys[i].y,enemys[j].x,enemys[j].y) <= maxdistance && distance(enemys[i].x,enemys[i].y,player1.x,player1.y) > maxdistance * 1.5 && enemys[i].clump != 1 && enemys[j].clump != 1) {
                    let ispeedX = test(enemys[j].x,enemys[j].y,enemys[i].x,enemys[i].y,"X");
                    let ispeedY = test(enemys[j].x,enemys[j].y,enemys[i].x,enemys[i].y,"Y");
                    let jspeedX = test(enemys[i].x,enemys[i].y,enemys[j].x,enemys[j].y,"X");
                    let jspeedY = test(enemys[i].x,enemys[i].y,enemys[j].x,enemys[j].y,"Y");
                    enemys[i].speedX = (enemys[i].speedX + ispeedX) / 2;
                    enemys[i].speedY = (enemys[i].speedY + ispeedY) / 2;
                    enemys[j].speedX = (enemys[j].speedX + jspeedX) / 2;
                    enemys[j].speedY = (enemys[j].speedY + jspeedY) / 2;
                } else if(enemys[i].clump == 1 && enemys[j].clump == 1) {
                    if(distance(enemys[i].x,enemys[i].y,enemys[j].x,enemys[j].y) >= 2) {
                    let ispeedX = test(enemys[i].x,enemys[i].y,enemys[j].x,enemys[j].y,"X");
                    let ispeedY = test(enemys[i].x,enemys[i].y,enemys[j].x,enemys[j].y,"Y");
                    let jspeedX = test(enemys[j].x,enemys[j].y,enemys[i].x,enemys[i].y,"X");
                    let jspeedY = test(enemys[j].x,enemys[j].y,enemys[i].x,enemys[i].y,"Y");
                    enemys[i].speedX = (enemys[i].speedX + ispeedX) / 2;
                    enemys[i].speedY = (enemys[i].speedY + ispeedY) / 2;
                    enemys[j].speedX = (enemys[j].speedX + jspeedX) / 2;
                    enemys[j].speedY = (enemys[j].speedY + jspeedY) / 2;
                    } else {
                        let ispeedX = test(enemys[j].x,enemys[j].y,enemys[i].x,enemys[i].y,"X");
                    let ispeedY = test(enemys[j].x,enemys[j].y,enemys[i].x,enemys[i].y,"Y");
                    let jspeedX = test(enemys[i].x,enemys[i].y,enemys[j].x,enemys[j].y,"X");
                    let jspeedY = test(enemys[i].x,enemys[i].y,enemys[j].x,enemys[j].y,"Y");
                    enemys[i].speedX = (enemys[i].speedX + ispeedX) / 2;
                    enemys[i].speedY = (enemys[i].speedY + ispeedY) / 2;
                    enemys[j].speedX = (enemys[j].speedX + jspeedX) / 2;
                    enemys[j].speedY = (enemys[j].speedY + jspeedY) / 2;
                    if(RB(1,1000) == 1) {
                        enemys[i].clump = 0;
                        enemys[i].supe = 1;
                    } else if(RB(1,1000) == 2){
                        enemys[j].clump = 0;
                        enemys[j].supe = 1;
                    }
                    }
                }
            }
        }
        if(map[Math.floor(enemys[i].y)][Math.floor(enemys[i].x)] == 5 || map[Math.floor(enemys[i].y)][Math.floor(enemys[i].x)] == 2) {
            let a = RB(1,4);
            let b = RB(1,3);
            if(maxenemys > 20) b = RB(1,6);
            if(enemys[i].clump == 1 && player1.gunlength <= player1.maxhealth) player1.gunlength++;
            if(player1.gunlength >= player1.maxhealth && shooting == 0) {
                shooting = 1;
                var shooter = setInterval(() => {
                    shoot();
                    if(shooting == 0) {
                        clearInterval(shooter);
                        player1.gunlength = player1.maxhealth / 2;
                    }
                },1000/30)
                setTimeout(() => {
                    shooting = 0;
                },5000);
            }
            if(a == 1 && b != 1) {
                enemys[i].new(0 - canvas.width,RB(0,canvas.height),player1.x,player1.y,reaction,0);
            } else if(a == 2 && b != 1) {
                enemys[i].new(canvas.width * 2,RB(0,canvas.height),player1.x,player1.y,reaction,0);
            } else if(a == 3 && b != 1) {
                enemys[i].new(RB(0,canvas.width),0 - canvas.height,player1.x,player1.y,reaction,0);
            } else if(a == 4 && b != 1) {
                enemys[i].new(RB(0,canvas.width),canvas.height * 2,player1.x,player1.y,reaction,0);
            } else if(a == 1 && b == 1) { // clumps
                enemys[i].new(0,RB(0,canvas.height),player1.x,player1.y,reaction,1);
            } else if(a == 2) {
                enemys[i].new(canvas.width,RB(0,canvas.height),player1.x,player1.y,reaction,1);
            } else if(a == 3) {
                enemys[i].new(RB(0,canvas.width),0,player1.x,player1.y,reaction,1);
            } else if(a == 4) {
                enemys[i].new(RB(0,canvas.width),canvas.height,player1.x,player1.y,reaction,1);
            }
        }
        if(map[Math.floor(enemys[i].y)][Math.floor(enemys[i].x)] == 1 && enemys[i].attack == 1) {
            enemys[i].attack = 0;
            setTimeout(() => {
                enemys[i].attack = 1;
            },2000);
            player1.gunlength--;
            if(player1.gunlength <= 0) {
                reset();
            }
        }
        if(enemys[i].clump == 1) {
            map[Math.floor(enemys[i].y)][Math.floor(enemys[i].x)] = 7;
        } else if(enemys[i].supe == 1){
            for(let x = -1; x < 2; x++) {
                for(let y = -1; y < 2; y++) {
                    map[Math.floor(enemys[i].y) + y][Math.floor(enemys[i].x) + x] = 6;
                }
            }
        } else {
            map[Math.floor(enemys[i].y)][Math.floor(enemys[i].x)] = 6;
        }
    }
}

//game
var game = () => {
    player1.ox = player1.x;
    player1.oy = player1.y;
    if(player1.speedX > player1.goalX) {
        player1.speedX -= dif(player1.speedX,player1.goalX) / player1.changespeed;
    } else if(player1.speedX < player1.goalX) {
        player1.speedX += dif(player1.speedX,player1.goalX) / player1.changespeed;
    }
    if(player1.speedY > player1.goalY) {
        player1.speedY -= dif(player1.speedY,player1.goalY) / player1.changespeed;
    } else if(player1.speedY < player1.goalY) {
        player1.speedY += dif(player1.speedY,player1.goalY) / player1.changespeed;
    }
    while(distance(player1.x,player1.y,player1.ox,player1.oy) <= player1.gunlength) {
        player1.x += player1.speedX;
        player1.y += player1.speedY;
        for(let x = -1; x < 2; x++) {
            for(let y = -1; y < 2; y++) {
                map[Math.floor(player1.y) + y][Math.floor(player1.x) + x] = 2;
            }
        }
    }
    player1.x2 = Math.floor(player1.x);
    player1.y2 = Math.floor(player1.y);
    player1.x = player1.ox;
    player1.y = player1.oy;
    player1.x += player1.speedX * player1.speed;
    player1.y += player1.speedY * player1.speed;
    if(player1.x > canvas.width) {
        player1.x = 0;
    } else if(player1.x < 0) {
        player1.x = canvas.width;
    }
    if(player1.y > canvas.height) {
        player1.y = 0;
    } else if(player1.y < 0) {
        player1.y = canvas.height;
    }
    for(let i = -2; i < 3; i++) {
       for(let j = -2; j < 3; j++) {
        map[Math.floor(player1.y) + i][Math.floor(player1.x) + j] = 1;
       }
    }
    if(distance(player1.x,player1.y,mouse.x,mouse.y) <= 1) {
        player1.speed = 0;
    } else player1.speed = player1.currentspeed;
    handlebullets();
    handleEnemys();
    map[player1.y2][player1.x2] = 3;
    setTimeout(() => {
        drawing();
        requestAnimationFrame(game());
    },1000/30);
}

game();
drawing();
