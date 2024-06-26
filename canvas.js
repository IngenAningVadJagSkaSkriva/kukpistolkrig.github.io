const canvas = document.getElementById("canvas1");
const ctx = canvas.getContext('2d');
canvas.height = 200;
canvas.width = canvas.height * 2;
var check = 0;
var index = 0;
var maxbullets = 5000;
var speed = 1;
var reset2 = 0;
var waves = 0;
var choose = 0;
var maxenemys = 0;
var damage = new Audio("damage.mp3");
var kill = new Audio("kill.mp3");
var heal = new Audio("heal.mp3");
var win = new Audio("win.mp3");
var eshoot = new Audio("eshoot.mp3");
var Sshoot = [];
var shooti = 0;
var p = 1;
var p2 = 1;
for(let i = 0; i < 20; i++) {
    Sshoot[i] = new Audio("shoot.mp3");
}
while(choose == 0) {
    if(confirm("Do you want easy mode?")) {
        maxenemys = 20;
        choose = 1;
    } else if(confirm("Do you want hard mode?")){
        maxenemys = 50;
        speed = 1.5;
        choose = 1;
    } else if(confirm("Do you want impossible mode?")) {
        maxenemys = 100;
        speed = 2;
        choose = 1;
    }
}
alert("To change difficulty just refresh the page!");
var upgrade = maxenemys * 3;
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
    recoilX: 0,
    recoilY: 0,
    speed: 2,
    changespeed: 5,
    currentspeed: 2,
    gunlength: 20,
    maxhealth: 40,
    twoswords: false,
    kills: 0,
    killsuntilupgrade: 0,
    sprite: [
        [2,1,1,1,2],
        [1,3,1,3,1],
        [1,1,1,1,1],
        [1,3,1,3,1],
        [2,1,1,1,2]
    ]
}
var bomb = {
    x: Math.floor(canvas.width / 4),
    y: Math.floor(canvas.height / 4),
    width: 2,
    height: 2,
    active: false
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
        this.size = 2;
        this.evil = 0;
        this.shotgun = 0;
        this.speed = pos(this.speedX) + pos(this.speedY);
    }
    update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if(this.speed < 0.05) {
            this.speedX = RB(-10,10) / 10;
            this.speedY = RB(-10,10) / 10;
            this.speed = pos(this.speedX) + pos(this.speedY);
        }
    }
    end() {
        this.x = canvas.width * 1.5;
        this.y = canvas.height * 1.5;
        this.speedX = 0;
        this.speedY = 0;
    }
    new(x1,y1,speedX1,speedY1,index1,speed,size,evil,shotgun) {
        this.x = x1;
        this.y = y1;
        this.shotgun = shotgun;
        this.evil = evil;
        this.speedX = speedX1 * speed;
        this.speedY = speedY1 * speed;
        this.index = index1;
        this.size = size;
        this.speed = pos(this.speedX) + pos(this.speedY);
    }
}
class enemy {
    constructor(x,y,x2,y2,reaction,clump,supe) {
        this.x = x;
        this.y = y;
        this.x22 = x;
        this.y22 = y;
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
        if(RB(1,30) == 1) {
            this.supe = 0;
            this.clump = 0;
            this.gunner = 1;
        } else {
            this.gunner = 0;
        }
    }
    update(x2,y2,speed) {
        if(this.gunner == 1) {
            speed = 0.5;
            if(this.x > canvas.width) {
                this.x = canvas.width - 10;
            } else if(this.x < 0) {
                this.x = 10;
            }
            if(this.y > canvas.height) {
                this.y = canvas.height - 10;
            } else if(this.y < 0) {
                this.y = 10;
            }
        }
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
        this.x22 = x;
        this.y22 = y;
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
        if(RB(1,20) == 1) {
            this.supe = 0;
            this.clump = 0;
            this.gunner = 1;

        } else {
            this.gunner = 0;
        }
    }
}
class boss {
    constructor(y,x,health,maxhealth,fight) {
        this.y = y;
        this.x = x;
        this.speedX = 0;
        this.speedY = 0;
        this.health = health;
        this.maxhealth = maxhealth;
        this.fight = fight;
        this.death = 0;
    }
    update(speedX,speedY) {
        this.speedX = speedX;
        this.speedY = speedY;
        this.x += this.speedX;
        this.y += this.speedY;
    }
}
var enemys = []
var bullets = [];
var boss1 = new boss(canvas.height * -1,canvas.width * -1,15,15,0);
for(let i = 0; i < maxbullets; i++) {
    bullets[i] = new bullet(-5,-5,0,0,0);
}
for(let i = 0; i < maxenemys; i++) {
    let a = RB(1,4)
    if(a == 1) {
        enemys[i] = new enemy(0,RB(0,canvas.height),player1.x,player1.y,reaction,RB(0,1));
    } else if(a == 2) {
        enemys[i] = new enemy(canvas.width,RB(0,canvas.height),player1.x,player1.y,reaction,RB(0,1));
    } else if(a == 3) {
        enemys[i] = new enemy(RB(0,canvas.width),0,player1.x,player1.y,reaction,RB(0,1));
    } else if(a == 4) {
        enemys[i] = new enemy(RB(0,canvas.width),canvas.height,player1.x,player1.y,reaction,RB(0,1));
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

var pause = () => {
    if(p == 0 && p2 == 0) {
        p2 = 1;
        p = 1;
    }
}

window.addEventListener('resize', () => {
    pause();
})

var drawing = () => {
    if(p == 1) {
        ctx.fillStyle = "yellow";
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText("KUK PISTOL KRIG!",canvas.width / 5, canvas.height / 4,(canvas.width / 4) * 3);
        ctx.fillStyle = "white";
        ctx.fillText("CLICK TO START!",canvas.width / 4,canvas.height / 2,(canvas.width / 4) * 3);
        ctx.fillStyle = "rgb("+RB(10,255)+","+RB(10,255)+","+RB(10,255)+")";
        ctx.fillText("CLICK TO SHOOT!",canvas.width / 1.5,canvas.height / 5,canvas.width);
        ctx.fillText("RIGHT CLICK FOR SHOTGUN AND SPEED!",canvas.width / 2.1,canvas.height / 4,canvas.width);
        ctx.fillText("SHOTGUN USES YOUR HEALTH AS AMMO!",canvas.width / 2.1,(canvas.height / 4) * 1.2,canvas.width); 
        return 0;
    }
    let see = false;
    let check = false;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "grey";
    if(maxenemys == 50) {
        ctx.fillText("WAVE: "+waves+", HARD MODE! "+"KILLS: "+player1.kills+", UPGRADE: "+player1.killsuntilupgrade+"/"+upgrade,0,canvas.height / 10,canvas.width);
    } else if(maxenemys == 100) {
        ctx.fillText("WAVE: "+waves+", IMPOSSIBLE! "+"KILLS: "+player1.kills+", UPGRADE: "+player1.killsuntilupgrade+"/"+upgrade,0,canvas.height / 10,canvas.width);
    } else {
        ctx.fillText("WAVE: "+waves+", easy, "+"KILLS: "+player1.kills+", UPGRADE: "+player1.killsuntilupgrade+"/"+upgrade,0,canvas.height / 10,canvas.width);
    }
    for(let i = 0; i < canvas.height; i++) {
        for(let j = 0; j < canvas.width; j++) {
            map2[i][j] = map[i][j];
            if(map[i][j] == 1) {
                if(check == false) {
                    for(let y = 0; y < 5; y++) {
                        for(let x = 0; x < 5; x++) {
                            switch(player1.sprite[x][y]) {
                                case 1:
                                    ctx.fillStyle = "rgb("+(player1.gunlength/player1.maxhealth)*255+", 0, 0)";
                                    break;
                                case 2:
                                    ctx.fillStyle = "white";
                                    break;
                                case 3:
                                    ctx.fillStyle = "rgb("+RB(0,255)+","+RB(0,255)+","+RB(0,255)+")";
                            }
                            if(player1.sprite != 0) ctx.fillRect(j + x, i + y,1,1);
                        }
                    }
                }
                check = true;
                map[i][j] = 0;
            } else if(map[i][j] == 2) {
                let count = 0;
                for(let y = -1; y < 2; y++) {
                    for(let x = -1; x < 2; x++) {
                        if((map2[i + y][j + x] == 2 || map[i + y][j + x] == 2) && (y != 0 && x != 0)) count++;
                    }
                }
                if(count >= 4) {
                    ctx.fillStyle = "white";
                } else ctx.fillStyle = "grey";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 3) {
                ctx.fillStyle = "blue";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 4) {
                if(RB(1,3) == 1) {
                    ctx.fillStyle = "white";
                } else if(RB(1,3) == 2){
                    ctx.fillStyle = "yellow";
                } else {
                    ctx.fillStyle = "red";
                }
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 5) {
                ctx.fillStyle = "white";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 6) {
                ctx.fillStyle = "green";
                see = true;
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 7) {
                ctx.fillStyle = "red";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 8) {
                ctx.fillStyle = "grey";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 9) {
                if(RB(1,2) == 1) {
                    ctx.fillStyle = "grey";
                } else {
                    ctx.fillStyle = "white";
                }
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            } else if(map[i][j] == 10) {
                ctx.fillStyle = "rgb("+RB(0,(boss1.health/boss1.maxhealth)*255)+",0,0)";
                ctx.fillRect(j,i,1,1);
                map[i][j] = 0;
            }
        }
    }
    if(see == false && reset2 == 0 && p2 == 0) {
        reset2 = 1;
        waves++;
        boss1.death = 0;
        setTimeout(() => {
            reset2 = 0;
        },5000)
        for(let i = canvas.height * -3; i < canvas.height * 3; i++) {
            for(let j = canvas.width * -3; j < canvas.width * 3; j++) {
                map[i][j] = 0;
            }
        }
        for(let i = 0; i < index; i++) {
            bullets[i].end();
        }
        shooting = 0;
        player1.killsuntilupgrade = 0;
        win.play();
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
    for(let i = 0; i < maxbullets; i++) {
        bullets[i].end();
    }
    player1.gunlength = 20;
    player1.x = Math.floor(canvas.width / 2);
    player1.y = Math.floor(canvas.height / 2);
    waves = 0;
    player1.kills = 0;
    player1.killsuntilupgrade = 0;
    boss1.fight = 0;
                        boss1.x = canvas.width * -1;
                        boss1.y = canvas.height * -1;
                        boss1.health = boss1.maxhealth;
                        boss1.death = 0;
    alert("YOU LOSE!");
}

var keys = [];
onkeydown = onkeyup = (e) => {
    keys[e.keyCode] = e.type == 'keydown';
    if(keys[13]) { //enter
            if(player1.currentspeed == 0) {
                player1.currentspeed = 2;
            } else if(player1.currentspeed > 0) {
                player1.currentspeed = 0;
            }
        keys[13] = 0;
    }
    if(keys[32]) { //space
        pause();
    }

}

var move = () => {
    mouse.y = Math.floor((e.y / window.innerHeight) * canvas.height);
    mouse.x = Math.floor((e.x / window.innerWidth) * canvas.width);
    player1.goalX = test(player1.x,player1.y,mouse.x,mouse.y,"X");
    player1.goalY = test(player1.x,player1.y,mouse.x,mouse.y,"Y");
}
var shoot = (x,y,speedX,speedY,size,evil,shotgun) => {
    if(shooti >= 20) shooti = 0;
    if(evil != 1 && size > 1) {
        Sshoot[shooti].currentTime = 0;
        Sshoot[shooti].play();
    } else if(size > 1){
        eshoot.currentTime = 0;
        eshoot.play();
    }
    shooti++;
    index++;
    if(index >= maxbullets) {
        index = 0;
    }
    bullets[index].new(x,y,speedX,speedY,0,5,size,evil,shotgun);
}
var shooting = 0;
addEventListener("mousemove", (e) => {
    mouse.y = Math.floor((e.y / window.innerHeight) * canvas.height);
    mouse.x = Math.floor((e.x / window.innerWidth) * canvas.width);
    player1.goalX = test(player1.x,player1.y,mouse.x,mouse.y,"X");
    player1.goalY = test(player1.x,player1.y,mouse.x,mouse.y,"Y");
})
addEventListener("click", (e) => {
    if(p == 1) {
        p = 0;
        setTimeout(() => {
            map[1][1] = 6;
            game();
            drawing();
        },500)
        setTimeout(() => {
            p2 = 0;
        },2500)
    } else if(p2 != 1){
        shoot(player1.x2,player1.y2,player1.speedX,player1.speedY,2,0);
    }
})
addEventListener("contextmenu",(e) => {
    e.preventDefault();
    player1.recoilX = player1.speedX * -8;
    player1.recoilY = player1.speedY * -8;
    player1.gunlength -= 0.3;
    damage.currentTime = 0;
            damage.play();
            if(player1.gunlength <= 0) {
                reset();
            }
    for(let i = 0; i < player1.gunlength / 5; i++) {
        shoot(player1.x2,player1.y2,player1.speedX + RB(-5,5) / 100,player1.speedY + RB(-5,5) / 100,1,0,1);
    }
    return false;
},false)
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
        if(bullets[i].evil == 1) {
            if((map[Math.floor(bullets[i].y)][Math.floor(bullets[i].x)] == 2 || map[Math.floor(bullets[i].y)][Math.floor(bullets[i].x)] == 5) && bullets[i].size > 1) {
                for(let a = 0; a < 5; a++) {
                    shoot(bullets[i].x,bullets[i].y,(bullets[i].speedX + RB(-10,10) / 10)*0.25,(bullets[i].speedY + RB(-10,10) / 10)*0.25,1,0);
                }
                bullets[i].end();
            } else if(map[Math.floor(bullets[i].y)][Math.floor(bullets[i].x)] == 1) {
                player1.gunlength--;
                damage.currentTime = 0;
                damage.play();
                if(player1.gunlength <= 0) {
                    reset();
                }
            }
        }
        for(let x = bullets[i].size * -1;x < bullets[i].size; x++) {
            for(let y = bullets[i].size * -1; y < bullets[i].size; y++) {
                if(map[Math.floor(bullets[i].y) + y][Math.floor(bullets[i].x) + x] == 4 && bullets[i].evil != 1) {
                    boom(20);
                }
                if((map2[Math.floor(bullets[i].y) + y][Math.floor(bullets[i].x) + x] == 8 && bullets[i].evil != 1) && (bullets[i].size > 1 || bullets[i].shotgun == 1)) {
                    for(let a = 0; a < 5; a++) {
                        shoot(bullets[i].x,bullets[i].y,(bullets[i].speedX + RB(-10,10) / 10)*0.25,(bullets[i].speedY + RB(-10,10) / 10)*0.25,1,1);
                    }
                    bullets[i].end();
                }
                if(bullets[i].evil != 1) {
                    map[Math.floor(bullets[i].y) + y][Math.floor(bullets[i].x) + x] = 5;
                } else {
                    map[Math.floor(bullets[i].y) + y][Math.floor(bullets[i].x) + x] = 9;
                }
            }
        }
    }
    }
}
var enemydie = (i) => {
    let a = RB(1,4);
            let b = RB(1,3);
            if(maxenemys > 30) {
                b = RB(1,5);
            } else if(maxenemys > 50) {
                b = RB(1,10);
            }
            if(enemys[i].clump == 1 && player1.gunlength <= player1.maxhealth) {
                heal.currentTime = 0;
                heal.play();
                player1.gunlength++;
                player1.kills++;
                player1.killsuntilupgrade++;
            }
            if(player1.gunlength >= player1.maxhealth && shooting == 0) {
                shooting = 1;
                var shooter = setInterval(() => {
                    shoot(player1.x2,player1.y2,player1.speedX,player1.speedY,3,0);
                    if(shooting == 0) {
                        clearInterval(shooter);
                        player1.gunlength = player1.maxhealth / 2;
                    }
                },1000/30)
                setTimeout(() => {
                    shooting = 0;
                },5000);
            }
            if(enemys[i].clump != 1 && enemys[i].x > 0 && enemys[i].x < canvas.width && enemys[i].y > 0 && enemys[i].y < canvas.height){
                player1.kills++;
                player1.killsuntilupgrade++;
                kill.currentTime = 0;
                kill.play();
}
if(enemys[i].supe == 1 && enemys[i].x > 0 && enemys[i].x < canvas.width && enemys[i].y > 0 && enemys[i].y < canvas.height) {
    for(let a = 0; a < 5; a++) {
        shoot(enemys[i].x,enemys[i].y,RB(-10,10) / 10,RB(-10,10) / 10,1,1);
    }
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
var handleEnemys = () => {
    if(boss1.fight == 1 && boss1.death == 0) {
        let speedX = test(boss1.x,boss1.y,player1.x,player1.y,"X") * 0.9;
        let speedY = test(boss1.x,boss1.y,player1.x,player1.y,"Y") * 0.9;
        let x2 = boss1.x;
        let y2 = boss1.y;
        boss1.update(speedX,speedY);
        while(distance(x2,y2,boss1.x,boss1.y) < 40 * (boss1.health / boss1.maxhealth)) {
            x2 += speedX;
            y2 += speedY;
            for(let i = -2; i < 3; i++) {
                for(let j = -2; j < 3; j++) {
                    map[i + Math.floor(y2)][j + Math.floor(x2)] = 8;
                }
            }
        }
        map[Math.floor(y2)][Math.floor(x2)] = 3;
        if(RB(1,9) == 1) {
            shoot(x2,y2,boss1.speedX,boss1.speedY,3,1,0);
        }
        for(let i = -5; i < 5; i++) {
            for(let j = -5; j < 5; j++) {
                map[i + Math.floor(boss1.y)][j + Math.floor(boss1.x)] = 10;
                if(map2[i + Math.floor(boss1.y)][j + Math.floor(boss1.x)] == 2 || map2[i + Math.floor(boss1.y)][j + Math.floor(boss1.x)] == 5) {
                    boss1.health--;
                    if(map2[i + Math.floor(boss1.y)][j + Math.floor(boss1.x)] == 2) {
                        player1.recoilX = player1.speedX * -10;
                        player1.recoilY = player1.speedY * -10;
                    } else {
                        player1.recoilX = player1.speedX * -4;
                        player1.recoilY = player1.speedY * -4;
                    }
                    for(let i = 0; i < 5; i++) {
                        shoot(boss1.x,boss1.y,player1.speedX * -1 + RB(-10,10) / 100,player1.speedY * -1 + RB(-10,10) / 100,1,1);
                    }
                    if(boss1.health <= 0) {
                        boss1.fight = 0;
                        boss1.death = 1;
                        boss1.x = canvas.width * -1;
                        boss1.y = canvas.height * -1;
                        boss1.health = boss1.maxhealth;
                    }
                }
            }
        }
    }
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
        if(enemys[i].gunner != 1) {
            if(map[Math.floor(enemys[i].y)][Math.floor(enemys[i].x)] == 5 || map[Math.floor(enemys[i].y)][Math.floor(enemys[i].x)] == 2) {
                enemydie(i);
            }
        } else {
            for(let y = -3; y < 3; y++) {
                for(let x = -3; x < 3; x++) {
                    if(map[Math.floor(enemys[i].y) + y][Math.floor(enemys[i].x) + x] == 5 || map[Math.floor(enemys[i].y) + y][Math.floor(enemys[i].x) + x] == 2) {
                        enemydie(i);
                    }
                }
            }
        }
        if(map[Math.floor(enemys[i].y)][Math.floor(enemys[i].x)] == 1 && enemys[i].attack == 1) {
            enemys[i].attack = 0;
            setTimeout(() => {
                enemys[i].attack = 1;
            },2000);
            player1.gunlength--;
            damage.currentTime = 0;
            damage.play();
            if(player1.gunlength <= 0) {
                reset();
            }
        }
        if(enemys[i].gunner == 1) {
            for(let yy = -3; yy < 3; yy++) {
                for(let xx = -3; xx < 3; xx++) {
                    map[Math.floor(enemys[i].y) + yy][Math.floor(enemys[i].x) + xx] = 6; 
                }
            }
            while(distance(enemys[i].x,enemys[i].y,enemys[i].ox,enemys[i].oy) <= 10) {
                enemys[i].x += enemys[i].speedX;
                enemys[i].y += enemys[i].speedY;
                for(let x = -1; x < 2; x++) {
                    for(let y = -1; y < 2; y++) {
                        map[Math.floor(enemys[i].y) + y][Math.floor(enemys[i].x) + x] = 8;
                    }
                }
            }
            enemys[i].x22 = Math.floor(enemys[i].x);
            enemys[i].y22 = Math.floor(enemys[i].y);
            enemys[i].x = enemys[i].ox;
            enemys[i].y = enemys[i].oy;
            enemys[i].x += enemys[i].speedX * 0.5;
            enemys[i].y += enemys[i].speedY * 0.5;
            if(RB(1,10) == 1) {
                shoot(enemys[i].x22,enemys[i].y22,enemys[i].speedX,enemys[i].speedY,2,1)
            }
            map[enemys[i].y22][enemys[i].x22] = 3;
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
var boom = (pieces) => {
    if(bomb.active == false) return 0;
    for(let i = 0; i < pieces; i++) {
        shoot(bomb.x,bomb.y,RB(-15,15) / 10,RB(-15,15) / 10,5,0);
    }
    bomb.active = false;
    setTimeout(() => {
        bomb.active = true;
        bomb.x = RB(0,canvas.width - bomb.width);
        bomb.y = RB(0,canvas.height - bomb.height)
    },10000 + RB(0,10000))
}

//game
var game = () => {
    if(p == 1) {
        map[1][1] = 6;
        return 0;
    }
    let a = 0
    if(boss1.fight == 1) {
        a = RB(1,100);
    } else {
        a = RB(1,400);
    }
    if(a == 1) {
        let min = RB(0,canvas.width);
        let max = RB(min,canvas.width);
        if(RB(1,2) == 1) {
            for(let i = min; i < max; i++) {
                shoot(i,4,0,0.25,1,1,0);
            }
        } else {
            for(let i = min; i < max; i++) {
                shoot(i,canvas.height - 4,0,-0.25,1,1,0);
            }
        }
    }
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
    if(player1.killsuntilupgrade >= upgrade) {
        if(boss1.fight != 1) {
            boss1.fight = 1;
            boss1.x = canvas.width / 2;
            boss1.y = canvas.height / 2;
        }
        while(distance(player1.x,player1.y,player1.ox,player1.oy) <= player1.gunlength) {
            player1.x -= player1.speedX;
            player1.y -= player1.speedY;
            for(let x = -1; x < 2; x++) {
                for(let y = -1; y < 2; y++) {
                    map[Math.floor(player1.y) + y][Math.floor(player1.x) + x] = 2;
                }
            }
        }
        player1.killsuntilupgrade = upgrade;
        player1.x = player1.ox;
        player1.y = player1.oy;
    }
    player1.x += player1.speedX * player1.speed + player1.recoilX;
    player1.y += player1.speedY * player1.speed + player1.recoilY;
    if(player1.recoilX < 0) {
        player1.recoilX += 0.1;
    } else if(player1.recoilX > 0) {
        player1.recoilX -= 0.1;
    }
    if(player1.recoilY < 0) {
        player1.recoilY += 0.1;
    } else if(player1.recoilY > 0) {
        player1.recoilY -= 0.1;
    }
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
    if(bomb.active == true) {
        if(map[bomb.y][bomb.x] == 2) boom(20);
        for(let i = bomb.height * -1; i < bomb.height; i++) {
            for(let j = bomb.width * -1; j < bomb.width; j++) {
                map[i + bomb.y][j + bomb.x] = 4;
            }
        }
    }
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
setTimeout(() => {
    bomb.active = true;
    bomb.x = RB(0,canvas.width - bomb.width);
    bomb.y = RB(0,canvas.height - bomb.height)
},10000)
window.onblur = () => {
    pause();
}
