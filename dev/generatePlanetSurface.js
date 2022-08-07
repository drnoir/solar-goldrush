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
    // newPlanetElm.setAttribute('physics', "debug: true; gravity: 3;");
    // newPlanetElm.setAttribute('body', {type: 'static', mass: "0.5"});

    document.getElementById('planetScene').appendChild(newPlanetElm);

    let playerCam = document.createElement('a-entity');
    playerCam.setAttribute('camera','')
    playerCam.setAttribute('wasd-controls', 'acceleration:100')
    playerCam.setAttribute('look-controls','');
    // playerFPS.setAttribute('position','0 5 0');
    playerCam.setAttribute('position', {x: 0, y: 10, z: 0});
    // playerCam.setAttribute('kinematic-body','')
    // playerCam.setAttribute('body', {type: 'dynamic', mass: "0.5", linearDamping: "0.5"});
    // playerFPS.appendChild(playerCam);
    const planetScene = document.getElementById("planetScene");
    planetScene.appendChild(playerCam);
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