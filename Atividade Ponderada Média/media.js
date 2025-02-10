var notas = [7.6, 8.5, 6.5];
var soma = 0;

for(var i = 0; i < notas.length; i++) {soma += notas[i];
}
var media = soma / notas.length;
console.log ("A média das notas é: " + media.toFixed(2));

 if (media >= 7.0) {
    console.log(" Parabéns, você foi aprovado com média " + media.toFixed(2) + ".");
 } else {
    console.log("Infelizmente, você não foi aprovado. Sua média foi " + media.toFixed(2) + ".");
 }
