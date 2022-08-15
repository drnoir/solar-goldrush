function generatePlanet(color, areaSize){
    let planetSectorArray = [];
    let i;
    for (i = 0; i <   areaSize ; i++) {
        generatePlanetSector(color, i);
        planetSectorArray.push(i)
    }
}

function generatePlanetSector(color, id){
    let newPlanetElm = document.createElement('a-entity');
    let seedVal = 10;

    let randomDressingArr = ['none', 'cubes', 'pyramids', 'cylinders', 'towers', 'mushrooms', 'trees', 'apparatus', 'torii'];
    let randomDressingID = getRandomInt(0,randomDressingArr.length-1);
    let randomDressing = randomDressingArr[randomDressingID];

    let randomGroundArr = ['none','flat', 'hills', 'canyon', 'spikes', 'noise'];
    let randomGroundID = getRandomInt(0,randomGroundArr.length-1);
    let ground =  randomGroundArr[randomGroundID];

    let dressingAmount = getRandomInt(1,15);
    let dressingVariance = getRandomInt(1,15);
    let yScale = getRandomInt(1,60);
    let dressingCol = '#'+(0x1000000+Math.random()*0xffffff).toString(16).substr(1,6);
    newPlanetElm.setAttribute('environment', 'preset:default;skyType:gradient;seed:25;ground:'+ground+';groundYScale:'+yScale+';dressing:'+randomDressing+';+dressingAmount:'+dressingAmount+';dressingScale:'+dressingVariance+';dressingColor:'+dressingCol+';groundTexture:walkernoise; groundColor:'+color);
    newPlanetElm.setAttribute('active', true);
    // newPlanetElm.setAttribute('physics', "debug: true; gravity: 3;");
    // newPlanetElm.setAttribute('body', {type: 'static', mass: "0.5"});

    document.getElementById('planetScene').appendChild(newPlanetElm);

    let playerCam = document.createElement('a-entity');
    playerCam.setAttribute('camera','')
    playerCam.setAttribute('wasd-controls', 'acceleration:100')
    playerCam.setAttribute('look-controls','');
    playerCam.setAttribute('id','playerCam')
    playerCam.setAttribute('playerCam','')
    // playerFPS.setAttribute('position','0 5 0');
    playerCam.setAttribute('position', {x: 0, y: 10, z: 0});
    // playerCam.setAttribute('kinematic-body','')
    playerCam.setAttribute('body', {type: 'dynamic', mass: "0.5", linearDamping: "0.5"});
    // playerFPS.appendChild(playerCam);
    const planetScene = document.getElementById("planetScene");
    planetScene.appendChild(playerCam);
    // add mana
    let randomMana= getRandomInt(5,100);
    generateMana(randomMana);
    console.log('new planet surface genearted');
}




function generateMana(numMana){
    const planetScene = document.getElementById("planetScene");
    let i;
    for (i = 0; i <  numMana ; i++) {
        let randomX = getRandomInt(1, 100);
        let randomZ = getRandomInt(1, 100);
        let mana = document.createElement('a-sphere');
        let randomScale= getRandomInt(1, 3);
        mana.object3D.scale.set(randomScale, randomScale, randomScale);
        mana.setAttribute('name', 'mana');
        mana.setAttribute('id', 'mana'+i);
        mana.setAttribute('class', 'mana');
        mana.setAttribute('material', 'src', '#energy');
        mana.setAttribute('material', 'color', 'blue');
        mana.setAttribute('position', {x: randomX, y:1, z: randomZ });
        mana.setAttribute('body', {type: 'static', mass: "1"});
        planetScene.appendChild(mana);
    }
}

export { generatePlanet};

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}