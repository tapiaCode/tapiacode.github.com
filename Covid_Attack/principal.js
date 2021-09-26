
var config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 10 },
            debug: false
        }
    },
    scene: {
        
        preload: preload,
        create: create,
        update: update,
        extend: {
            matar: matar,
            matar2: matar2,
            contacto: contacto,
            choque: choque,
            
        }
    }
};

var balas;
var nave;
var speed;
var Fired = 0;
var punto = 0;
var vida = 100;

var game = new Phaser.Game(config);

    
function preload ()
{
    this.load.audio('tone', 'song/song.mp3');
    this.load.image('fondo', 'img/fondo.png');
    this.load.image('suelo', 'img/suelo.svg');
    this.load.image('nave', 'img/nave.png');
    this.load.image('bala', 'img/bala.png');
    this.load.image('virus', 'img/virus.png');
    this.load.spritesheet('enemys', 'img/enemy.png', {frameWidth: 50, frameHeight: 50});
}

function create ()
{
//AQUI CARGAMOS EL FONDO PARA Q VAYA ATRAS
this.add.image(640, 360, 'fondo');

//AÑADIMOS LA MUSICA DE FONDO
var jungle = this.sound.add('tone');
        jungle.play({
            loop: true
        });
// CARGAMOS LAS PUNTUACIONES Y TEXTOS
puntos = this.add.text(10, 10, 'PUNTOS: 0', { font: '40px Courier', fill: '#ffff00'});
this.add.text(497, 13, 'MATA EL VIRUS "NO TE ENFERMES"', { font: '40px Cooper Black', fill: '#000000'});
titulo = this.add.text(500, 10, 'MATA EL VIRUS "NO TE ENFERMES"', { font: '40px Cooper Black', fill: '#FFFFFF'});
gameOver = this.add.text(100, 300, '', { font: '40px Arial', fill: '#ffff00'});
restart = this.add.text(100, 360, '', { font: '40px Arial', fill: '#000000'});
    
//CARGAMOS EL ENEMIGO Y LO REPLICAMOS
    var Enemy = this.physics.add.group({ key: 'enemys', frame: Phaser.Math.Between(0,4),repeat: 8, setXY: { x: 50, y: 0, stepX: 100 } });
        Phaser.Actions.IncX(Enemy.getChildren(), 100);

    var Enemy2 = this.physics.add.group({ key: 'enemys', frame: Phaser.Math.Between(0,4),repeat: 8, setXY: { x: 250, y: 60, stepX: 100 } });
        Phaser.Actions.IncX(Enemy.getChildren(), 100);
    
//CARGAMOS NUESTRA NAVE 
    nave = this.physics.add.image(640, 660, 'nave');
    nave.setCollideWorldBounds(true);
    nave.body.allowGravity = false;
//CARGAMOS EL SUELO FALSO
    suelo = this.physics.add.image(640, 720, 'suelo');
    suelo.body.allowGravity = false;
//FISICAS DE LA BALA EN ESCENA
    var Bala = new Phaser.Class({
        Extends: Phaser.GameObjects.Image,
        initialize:

        function Bullet (scene)
        {
            Phaser.GameObjects.Image.call(this, scene, 0, 0, 'bala');
            this.speed = Phaser.Math.GetSpeed(500, 1);
        },

        fire: function (x, y)
        {
            this.setPosition(x, y - 50);
            this.setActive(true);
            this.setVisible(true);
        },
        update: function (time, delta)
        {
            this.y -= this.speed * delta;

            if (this.y < -50)
            {
                this.setActive(false);
                this.setVisible(false);
            }
        },

    });
//VARIABLE GLOBAL DE BALA LOS ATRIBUTOS DE ATRAS
    balas = this.physics.add.group({
        classType: Bala,
        maxSize: 20,
        runChildUpdate: true,
    });
    
//EVENTO DE COLISION ENTRE BALA Y ENEMIGOS
    
this.physics.add.overlap(balas, Enemy, matar);
this.physics.add.overlap(balas, Enemy2, matar2);

this.physics.add.collider(Enemy, Enemy, choque);
this.physics.add.collider(Enemy2, Enemy2, choque);
this.physics.add.collider(Enemy, Enemy2, choque);
this.physics.add.collider(nave, Enemy, contacto, null, this);

this.physics.add.collider(nave, Enemy&&Enemy2, contacto2, null, this);
    
    
//CONTROLES Y VELOCIDAD DE JUGADOR Y BALAS
    cursors = this.input.keyboard.createCursorKeys();
    speed = Phaser.Math.GetSpeed(900, 1);     
       
}
//CONTROLES DE TECLADO
function update (time, delta)
{
    
    if (cursors.left.isDown)
    {
        nave.x -= speed * delta;
    }
    else if (cursors.right.isDown)
    {
        nave.x += speed * delta;
    }

    if (cursors.space.isDown && time > Fired)
    {
        var bullet = balas.get();
        if (bullet)
        {
            bullet.fire(nave.x, nave.y);
            bullet.body.allowGravity = false;
            Fired = time + 100;
        }
    }
    
}

function matar(balas, Enemy)
{ 
    balas.setVisible(false);
    Enemy.setVisible(false); 
    Enemy.setPosition(Phaser.Math.Between(100,1180), -20);
    Enemy.setVisible(true);
    //PUNTAJE
    punto += 200;
    puntos.setText('PUNTOS: '+ punto);
    
}
function matar2(balas, Enemy2)
{ 
    balas.setVisible(false);
    Enemy2.setVisible(false); 
    Enemy2.setPosition(Phaser.Math.Between(100,1180), -50);
    Enemy2.setVisible(true);
    //PUNTAJE
    punto += 200;
    puntos.setText('PUNTOS: '+ punto);
    
}
function choque(Enemy, Enemy2){
    Enemy.setVisible(false); 
    Enemy.setPosition(Phaser.Math.Between(100,1180), -100);
    Enemy2.setVisible(false); 
    Enemy2.setPosition(Phaser.Math.Between(100,1180), -100);
}
function contacto(nave){
    nave.setTint(0xff0000);
    this.physics.pause();
    gameOver.setText('😷TE HAS ENFERMADO "FIN DEL JUEGO 🤒"');
    restart.setText('🔄DEBES ACTUALIZAR PARA VOLVER A EMPEZAR🔄');
}
function contacto2(){
    nave.setTint(0xff0000);
    this.physics.pause();
    gameOver.setText('😷TE HAS ENFERMADO "FIN DEL JUEGO 🤒"');
    restart.setText('🔄DEBES ACTUALIZAR PARA VOLVER A EMPEZAR🔄');
}


























