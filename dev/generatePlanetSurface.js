function generatePlanet(color){
    let newPlanetElm = document.createElement('a-entity');
    let seedVal = 10;

    let randomDressingArr = ['none', 'cubes', 'pyramids', 'cylinders', 'towers', 'mushrooms', 'trees', 'apparatus', 'torii'];
    let randomDressingID = getRandomInt(0,randomDressingArr.length-1);
    let randomDressing = randomDressingArr[randomDressingID];

    let dressingAmount = getRandomInt(1,15);
    let dressingVariance = getRandomInt(1,15);

    newPlanetElm.setAttribute('environment', 'preset:default;skyType:gradient;seed:25;groundYScale: 50; dressing:towers;dressingAmount:50;dressingScale:25; groundTexture:walkernoise; groundColor: brown;');
    newPlanetElm.setAttribute('active', true);
    document.getElementById('planetScene').appendChild(newPlanetElm);
    console.log('new planet surface genearted');

}

export default  generatePlanet;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}