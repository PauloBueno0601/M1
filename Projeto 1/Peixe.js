var config ={
    type: Phaser.AUTO,
    width: 800,
    height: 600,

    scene:{
        preload: preload,
        create: create,
        update: update
    }
};

var game = new Phaser.Game(config);

var peixinhoMouse, tartaruga;

function preload () {
    this.load.image('mar','assets/bg_azul-claro.png');
    this.load.image('alga', 'assets/algas.png');
    this.load.image('logo','assets/logo-inteli_azul.png');
    this.load.image('tartaruga', 'assets/tartaruga.png');
    this.load.image('peixe', 'assets/peixinho_azul.png');
    
}


function create() { 
    this.add.image(400, 300, 'mar'); 
    this.add.image(300, 100, 'alga').setScale(0.5).setDepth(0);
    this.add.image(400, 525, 'logo').setScale(0.5);  
    
    peixinhoMouse = this.add.image(400, 300, 'peixe');
    peixinhoMouse.setFlip(true, false);

    tartaruga = this.add.image(400,300, 'tartaruga');
    moveTartaruga.call(this);
}

    function moveTartaruga ()  {
        let newX = Phaser.Math.Between (50, 750);
        let newY = Phaser.Math.Between (50, 550); 

        this.tweens.add({
             targets: tartaruga,
             x: newX,
             y: newY,
             duration: 2000,
             onComplete:() => moveTartaruga.call(this)
        });
    }

    function update () {  
        peixinhoMouse.x = this.input.x;
        peixinhoMouse.y = this.input.y;
   }