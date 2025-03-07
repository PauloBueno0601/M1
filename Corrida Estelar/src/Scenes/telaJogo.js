export default class SceneJogo extends Phaser.Scene {
    constructor() {
        super({ key: 'SceneJogo' });
        this.speed = 7; // Velocidade
        this.score = 0; // Pontuação
        this.highScore = 0; // recorde de pontuação
        this.isGameActive = true; // Flag para controlar se o jogo está ativo
        this.newRecordText = null; // Variável para controlar a mensagem de novo recorde
        this.hasNewRecordBeenShown = false; // Flag para controlar se o recorde já foi mostrado nesta partida
    }

    preload() {
        // Carregar imagens
        this.load.image('fundoJogo', 'src/Assets/fundo.png'); // Fundo 
        this.load.image('naveEspacial', 'src/Assets/nave.png'); // Nave do jogador
        this.load.image('obstaculo1', 'src/Assets/meteorito.png'); // Imagem do primeiro obstáculo
        this.load.image('obstaculo2', 'src/Assets/fogo.png'); // Imagem do segundo obstáculo
        this.load.spritesheet('explosao', 'src/Assets/explosao.png', { frameWidth: 64, frameHeight: 64 });
    }

    create() {
        // Carregar o recorde de pontuação do localStorage
        this.highScore = parseInt(localStorage.getItem('highScore')) || 0;
         // Resetar a flag de novo recorde ao iniciar/reiniciar o jogo
         this.hasNewRecordBeenShown = false;

        // Adicionar o fundo
        this.background1 = this.add.tileSprite(400, 300, 800, 600, 'fundoJogo');

        // Criar a nave do jogador
        this.spaceship = this.physics.add.image(400, 500, 'naveEspacial').setOrigin(0.5, 0.5); // Posição inicial da nave
        this.spaceship.setCollideWorldBounds(true); // Impede que a nave saia da tela
        this.spaceship.setScale(0.1);

        // Grupo de obstáculos
        this.obstacles = this.physics.add.group();

        // Adicionar colisão entre a nave e os obstáculos
        this.physics.add.collider(this.spaceship, this.obstacles, this.hitObstacle, null, this);

        // Gerar obstáculos a cada 1 segundo
        this.obstacleEvent = this.time.addEvent({
            delay: 1000,
            callback: this.spawnObstacle, 
            callbackScope: this, // Para que a função seja chamada no escopo da cena
            loop: true // Repetir a cada 1 segundo
        });

        // Teclas de controle
        this.cursors = this.input.keyboard.createCursorKeys();

        this.scoreText = this.add.text(10, 10, 'Pontuação: 0', { fontSize: '32px', fill: '#fff' }); //Adiciona a pontuação na tela
        this.highScoreText = this.add.text(10, 50, 'Recorde: ' + this.highScore, { fontSize: '32px', fill: '#fff' }); // Adiciona o recorde na tela

        // Criando animação da explosão, efeito especial
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosao', { start: 0, end: 7 }),
            frameRate: 10,
            repeat: 0,
            hideOnComplete: true
        });

        
           // Adicionar evento para limpar o localStorage quando o jogador sair da página
           window.addEventListener('beforeunload', () => { // o record é zerado pós o jogador sair da tela
           localStorage.removeItem('highScore'); // Garantindo que o record comece zerado na próxima partida
    });
    }

    update() {
        if (!this.isGameActive) return; // Se o jogo não estiver ativo, não atualize nada

        // Atualizando o fundo para o efeito parallax
        this.background1.tilePositionY -= 1; // Fundo mais distante se move mais devagar

        // Movimentar a nave
        if (this.cursors.left.isDown) { // Se a tecla esquerda estiver pressionada
            this.spaceship.setVelocityX(-300); // Mover para a esquerda
        } else if (this.cursors.right.isDown) { // Se a tecla direita estiver pressionada
            this.spaceship.setVelocityX(300); // Mover para a direita
        } else {
            this.spaceship.setVelocityX(0); // Parar a nave
        }

        // Verificar se os obstáculos saíram da tela e destruí-los
        this.obstacles.getChildren().forEach(obstacle => {
            if (obstacle.y > 600) { // Se o obstáculo ultrapassar a parte inferior da tela
                obstacle.destroy(); // Destruir o obstáculo
                this.increaseScore(); // Incrementar a pontuação
            }
        });
    }

    spawnObstacle() {
        if (!this.isGameActive) return; // Se o jogo não estiver ativo, não gere novos obstáculos

        let x, y;
        let overlap = true;

        // Garantindo que o obstáculo não seja gerado muito próximo de outros obstáculos
        while (overlap) {
            x = Phaser.Math.Between(50, 700); // Posição X aleatória
            y = 0; // Posição Y no topo da tela
            overlap = false;

            // Verificar se o novo obstáculo está muito próximo de outros obstáculos
            this.obstacles.getChildren().forEach(obstacle => {
                if (Phaser.Math.Distance.Between(x, y, obstacle.x, obstacle.y) < 100) {
                    overlap = true; // Se estiver muito próximo, marcar como sobreposição
                }
            });
        }

        // Escolher aleatoriamente entre os dois tipos de obstáculos
        const obstacleType = Phaser.Math.Between(1, 2) === 1 ? 'obstaculo1' : 'obstaculo2';

        // Criar o obstáculo
        const obstacle = this.obstacles.create(x, y, obstacleType);
        obstacle.setVelocityY(200); // Velocidade de queda do obstáculo
        obstacle.setCollideWorldBounds(false); // Impedir que o obstáculo colida com as bordas da tela
        obstacle.setScale(0.4); // Diminuir o tamanho dos obstáculos
    }

    hitObstacle(spaceship, obstacle) {
        if (!this.isGameActive) return; // Se o jogo já não estiver ativo, não faça nada

        this.isGameActive = false; // O jogo acabou

        // Lógica para quando a nave colide com um obstáculo
        this.physics.pause(); // Pausar o jogo
        spaceship.setTint(0xff0000); // Mudar a cor da nave para vermelho

        // Adicionar explosão na posição da nave
        const explosion = this.add.sprite(spaceship.x, spaceship.y, 'explosion').play('explode');

        // Exibir mensagem de Game Over
        this.add.text(350, 300, 'Game Over', { fontSize: '64px', fill: '#fff' }).setOrigin(0.5);

        // Criar botão de restart
        const restartButton = this.add.text(340, 400, 'Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
        restartButton.setInteractive(); // Tornar o texto clicável

        // Configurar evento de clique no botão de restart
        restartButton.on('pointerdown', () => {
            this.isGameActive = true; // Reiniciar o jogo
            this.physics.resume(); // Retomar a física do jogo
            this.score = 0; // Resetar a pontuação para zero
            this.scoreText.setText('Pontuação: 0'); // Atualizar o texto da pontuação
            this.scene.restart(); // Reiniciar a cena do jogo
        });
    }

    increaseScore() {
            this.score += 1; // Incrementar a pontuação
            this.scoreText.setText('Pontuação: ' + this.score); // Atualizar o texto da pontuação
        
            // Verificar se o jogador ultrapassou o recorde
            if (this.score > this.highScore) {
                this.highScore = this.score; // Atualizar o recorde
                this.highScoreText.setText('Recorde: ' + this.highScore); // Atualizar o texto do recorde
                localStorage.setItem('highScore', this.highScore); // Salvar o novo recorde no localStorage
            
                if (!this.hasNewRecordBeenShown) { // Exibir mensagem apenas se ainda não foi mostrada nesta partida
                    this.newRecordText = this.add.text(400, 200, 'Novo Recorde!', { fontSize: '48px', fill: '#ff0' }).setOrigin(0.5);
                    this.hasNewRecordBeenShown = true; // Marcar que a mensagem já foi exibida
            
                    // Removendo a mensagem após 3 segundos
                    this.time.delayedCall(3000, () => {
                        if (this.newRecordText) {
                            this.newRecordText.destroy();
                            this.newRecordText = null;
                        }
                    }, [], this);
                }
            }
        }
    }