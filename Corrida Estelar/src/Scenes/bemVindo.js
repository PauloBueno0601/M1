export default class SceneInicial extends Phaser.Scene {
    constructor() {
        // Define a chave da cena como 'SceneInicial'
        super({ key: 'SceneInicial' });
    }

    preload() {
        // Carrega a imagem de fundo do jogo
        this.load.image('fundo', 'src/Assets/espace.png');

        // Carrega a imagem do botão de início
        this.load.image('startButton', 'src/Assets/start.png');
    }

    create() {
        // Adiciona a imagem de fundo na posição (500, 300)
        this.add.image(500, 300, 'fundo');

        // Adiciona o título do jogo na posição (520, 200) com estilo de texto definido
        this.add.text(520, 200, 'Corrida Estelar', { fontSize: '64px', fill: '#fff' }).setOrigin(0.8);

        // Cria um retângulo semi-transparente para destacar as instruções
        const instructionBackground = this.add.rectangle(350, 450, 600, 100, 0x000000, 0.7);
        instructionBackground.setOrigin(0.5);

        // Adiciona o texto das instruções na tela
        this.add.text(200, 450, 'Use as teclas ← e → para movimentar a nave', { fontSize: '20px', fill: '#fff' }).setOrigin(0.2);

        // Cria o botão de início do jogo, definindo-o como interativo
        const startButton = this.add.image(360, 300, 'startButton').setInteractive();

        // Redimensiona o botão para 30% do tamanho original
        startButton.setScale(0.3);

        // Adicionando evento de clique ao botão para iniciar o jogo
        startButton.on('pointerdown', () => {
            this.startGame();
        });

        // Muda a cor do botão para verde ao passar o mouse por cima
        startButton.on('pointerover', () => { 
            startButton.setTint(0x44ff44);
        });

        // Remove a cor alterada quando o mouse sai do botão
        startButton.on('pointerout', () => {
            startButton.clearTint();
        });
    }

    startGame() {
        console.log("Botão clicado! Carregando cena do jogo...");

        // Aplica um efeito de fade out antes de mudar para a cena do jogo
        this.cameras.main.fadeOut(1000);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start("SceneJogo");
        });
    }

    update() {
        
    }
}
