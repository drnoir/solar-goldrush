// script for generating buildings / game logic etc
// global game vars
import {generatePlanet} from './generatePlanetSurface.js';
import {genNames, genGalaxyName} from './planetGen.js';


let starsNum = getRandomInt(20, 50);
let gamestarted = false;
let firstDamage = false;
let health = 10;
let spaceMana = 0;
let fuel = 1000;
let planetNameCurrent = 0;
let shipPosX;
let shipPosY;
let shipPosZ;
let planetnames = [];
let landedPlanet = false;
let warpMode = false;
let speech = new SpeechSynthesisUtterance();
speech.lang = "en";
let galaxyName = genGalaxyName();

window.onload = async function () {
    galaxyName = genGalaxyName();
    // const shipCam = document.getElementById('camera');
    // shipCam.far = 500;
    await beginGame();
    // perhaps generate then populate?
    await welcome();
    await updateShieldUI();
    await updateGalaxyUI();

    function welcome() {
        speech.text = 'Welcome to the' + galaxyName + 'galaxy';
        window.speechSynthesis.speak(speech);
    }
    // LOAD GAME IN BG? PRELOADER?
};

document.addEventListener("keydown", e => {
    if (e.code === 'KeyW' && !landedPlanet) {
        const ship = document.getElementById('rig');
        // ship.setAttribute('movement-controls', 'speed' + 0.5);
        // ship.setAttribute('wasd-controls', 'acceleration' + 1);
        // add event listener for w press for accel
        document.getElementById('accel').play();
        document.getElementById('accel').volume = 0.3;
    }
    // speed increase
    if (e.code === 'ShiftLeft' && !landedPlanet) {
        console.log('speed')
        const ship = document.getElementById('rig');
        let shipSpeed = ship.getAttribute('speed')
        shipSpeed++;
        ship.setAttribute('speed', shipSpeed)
        document.getElementById('accel').play();
        document.getElementById('accel').volume = 0.3;
    }
    // if not on a planet init hyperspace on press of h
    if (e.code === 'KeyH' && !landedPlanet && !warpMode) {
        warpMode = true;
        console.log('init hyperspeed into another galaxay - animation?');
        //trigger sound fx
        document.getElementById('warpDrive').playbackRate = 0.5;
        document.getElementById('warpDrive').play();
        document.getElementById('warpDrive').volume = 1;
        // trigger warpspeed lib - EXPERIMENTAL
        const warpFXContainer = document.getElementById('warpFXContainer');
        warpFXContainer.setAttribute('visible', true);
        // warpFXContainer.emit('fadein');
        // clear scene
        clearScene();
        newScene();
    } else if (e.code === 'KeyH' && !landedPlanet && warpMode) {
        warpMode = false;
        console.log('disengage hyperspeed into another galaxay - animation?');
        //trigger sound fx
        document.getElementById('warpDisengage').playbackRate = 0.5;
        document.getElementById('warpDisengage').play();
        document.getElementById('warpDisengage').volume = 1;
        // trigger warpspeed lib - EXPERIMENTAL
        const warpFX = document.getElementById('warpFXContainer');
        warpFX.setAttribute('visible', false);
        // repopulate
        //generate new solar system post warp
    }

    if (e.code === 'Space' && !landedPlanet) {
        const ship = document.getElementById('rig');
        // add event listener for w press for accel
        document.getElementById('scan').play();
        document.getElementById('scan').volume = 0.9;
        ship.setAttribute('enabled', 'false');
        const camShip = document.getElementById("camera");
        camShip.setAttribute('enabled', 'false');
        // test for now - space wipe and planet gen
        const spaceScene = document.getElementById("solarSystems");
        spaceScene.setAttribute('visible', 'false');
        const planetScene = document.getElementById("planetScene");
        let planetColor = planetScene.getAttribute('color');
        // CHECK SCALE OF PLANET AND DETERMINE SIZE OF GEN PLANET
        generatePlanet(planetColor, 10);
        planetScene.setAttribute('visible', 'true');
        landedPlanet = true;
    }
    // if landed on planet init sequence back into space
    else if (e.code === 'Space' && landedPlanet) {
        console.log('init laung sequence off planet');
        const planetScene = document.getElementById("planetScene");
        planetScene.setAttribute('visible', 'false');
        while (planetScene.hasChildNodes()) {
            planetScene.removeChild(planetScene.firstChild);
        }
        const ship = document.getElementById('rig');
        ship.setAttribute('enabled', 'true');
        const camShip = document.getElementById("camera");
        camShip.setAttribute('enabled', 'true');
        // test for now - space wipe and planet gen
        const spaceScene = document.getElementById("solarSystems");
        spaceScene.setAttribute('visible', 'true');
        landedPlanet = false;
    }
});

function updateGalaxyUI(){
    let galaxyNameUI =  document.getElementById("galaxyNameUI");
    galaxyNameUI.setAttribute('text', 'value', galaxyName.toString());
    let starsNameUI =  document.getElementById("galaxyStarsUI");
    starsNameUI.setAttribute('text', 'value', starsNum.toString());
}

function updateShieldUI(){
    let shieldUI =  document.getElementById("shieldUI2");
    shieldUI.setAttribute('text', 'value', health.toString());
    console.log(health);
}

AFRAME.registerComponent('player', {
    init: function () {
        this.planetNav = 0;
        this.el.addEventListener('collide', function (e) {
            console.log('Player has collided with ', e.detail.body.el);
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
            console.log('NAME' + e.detail.body.el.className);

            if (gamestarted === true) {
                // ADD LOADING ANIMATION - NEED WAY TO DETERMINE LOAD FINISHED
                document.getElementById('collide').play();
                document.getElementById('collide').volume = 0.3;
            }

            if (e.detail.body.el.className === "star") {
                console.log("star collide");
                document.getElementById('damage').play();
                health--;
                updateShieldUI();
                console.log("health")
            }
            // debris? - Landing for planet - COMMENT BACK IN CURRENTLY BUG WITH COLLISIONS DEBUG
            if (e.detail.body.el.className === "debris") {
                console.log("asteroid collide");
                document.getElementById('damage').play();
                health--;
                updateShieldUI();
                console.log("health")
            }
            // change to MANA
            if (e.detail.body.el.className === "mana") {
                console.log("planet Aura");
                const mana = document.querySelector('a-sphere');
                document.getElementById('collect').play();
                spaceMana++;
            }
            // change to aura later but for now test planet collision
            if (e.detail.body.el.id === "planet") {
                console.log("planet Aura");
                document.getElementById('damage').play();
                health--;
                updateShieldUI();
            }
        });
    },
    tick: function () {
        // tell player they approach a planet with speech
    }
})

AFRAME.registerComponent('playerCam', {
    init: function () {
        this.planetNav = 0;
        this.el.addEventListener('collide', function (e) {
            console.log('Player has collided with ', e.detail.body.el);
            e.detail.target.el; // Original entity (playerEl).
            e.detail.body.el; // Other entity, which playerEl touched.
            e.detail.contact; // Stats about the collision (CANNON.ContactEquation).
            e.detail.contact.ni; // Normal (direction) of the collision (CANNON.Vec3).
            console.log('NAME' + e.detail.body.el.className);
            // Mana Collect
            if (e.detail.body.el.className === "mana") {
                console.log("planet Aura");
                const mana = document.querySelector('a-sphere');
                document.getElementById('collect').play();
                spaceMana++;
            }
        });
    },
    tick: function (e) {
        // tell player they approach a planet with speech
        console.log(this.el.position)
    }
})

// asteroid - WHEN added
AFRAME.registerComponent('debris', {
    init: function () {
        this.direction = 1;
        this.position = new THREE.Vector3();
        this.position.copy(this.el.object3D.position);
        this.player = document.getElementById("rig")
        setTimeout(() => {
            this.ready = true;
        }, 3000);
    },
    tick: function () {
        if (!this.ready) return;

        let playerPos = this.player.object3D.position;
        let debrisPos = this.el.object3D.position;
        let distance = playerPos.distanceTo(debrisPos)
        if (distance <= 2) {
            console.log("ateroid Field is nearby" + this.el.id);
            speech.text = "Caution - you are approaching an asteroid field";
            window.speechSynthesis.speak(speech);
        }
        let position = this.el.object3D.position.y;
        if (position <= 0) {
            this.direction = 1;
        } else if (position >= 5) {
            this.direction = -1;
        }
        this.el.object3D.position.set(this.position.x, position + 0.05 * this.direction, this.position.z);
    }

});

// cursor listener
AFRAME.registerComponent('cursor-listener', {
    init: function () {
        // need to display planet name and type
        this.el.addEventListener('click', function (evt) {
            alert(this.el.planetName.value, this.el.planetType.value);
            console.log(this.el);
            console.log(evt);
            console.log(evt.detail.intersection.point);
            // this.setAttribute('material', 'color', COLORS[lastIndex]);
        });
    }
});

// // planet rotation and compoenent etc
AFRAME.registerComponent('planet', {
    init: function () {
        this.direction = 1;
        let data = this.data;
        this.rotation = new THREE.Vector3();
        this.rotation.copy(this.el.object3D.rotation);
        this.position = new THREE.Vector3();
        this.position.copy(this.el.object3D.position);
        this.player = document.getElementById("rig")
        setTimeout(() => {
            this.ready = true;
        }, 3000);
    },

    tick: function () {
        if (!this.ready) return;
        let playerPos = this.player.object3D.position;
        let planetPos = this.el.object3D.position;
        let distance = playerPos.distanceTo(planetPos)
        if (distance < 15) {
            console.log("planet is nearby" + this.el.id);
            speech.text = "You are approaching the planet" + this.el.id;
            window.speechSynthesis.speak(speech);
        }
        let rot = this.el.getAttribute('rotation');
        this.el.setAttribute('rotation', {x: rot.x, y: rot.y + 0.5, z: rot.z});
    }
});

function beginGame() {
    let time = 0;
    gamestarted = true;
    document.getElementById('warp').play();
    document.getElementById('warp').volume = 0.4;
    document.getElementById('ambience').play();
    document.getElementById('ambience').volume = 0.8;
    document.getElementById('ambience').loop = true;
    document.getElementById('background').play();
    document.getElementById('background').volume = 0.15;
    document.getElementById('background').pitch = 0.15;
    document.getElementById('background').loop = true;

    const portalNum = 2;
    createStars(starsNum);
    // createPortals(portalNum);
    createRandomDebris(2);
    console.log("Game Started");
    updateGameState(time);
}

function clearScene() {
    // destroy spaceScene Entity and all child nodes?
    const spaceScene = document.getElementById("solarSystems");
    spaceScene.parentNode.removeChild(spaceScene);
    const asteroidScene = document.getElementById("asteroidSystems");
    asteroidScene.parentNode.removeChild(asteroidScene);
}

function newScene() {
    //create new containers for solar and asteroids
    let spaceScene =  document.getElementById("spaceScene");
    let solarSystemsContainer = document.createElement('a-entity');
    solarSystemsContainer.setAttribute('id', 'solarSystems');
    solarSystemsContainer.setAttribute('visible', true);
    spaceScene.appendChild(solarSystemsContainer );

    let asteroidSystemsContainer = document.createElement('a-entity');
    asteroidSystemsContainer.setAttribute('id', 'asteroidSystems');
    asteroidSystemsContainer.setAttribute('visible', true);
    spaceScene.appendChild(asteroidSystemsContainer);

    galaxyName = genGalaxyName();
    starsNum = getRandomInt(20, 50);

    // generate primitives
    createStars(starsNum);
    createRandomDebris(3);

    //welcome message new
    welcome();
    function welcome() {
        speech.text = 'Welcome to the' + galaxyName + 'solar system';
        window.speechSynthesis.speak(speech);
    }
    // update UI with new galaxy details
    updateGalaxyUI();
    console.log("newSolarSystem Genearted post warp");
}

function restart() {
    // change this to main menu or something
    location.reload();
}

function decrementScore() {
    amountofWinBoxes--;
    //check for win condition
    if (amountofWinBoxes === 0) {
        document.getElementById("Win").style.visibility = "visible";
        document.getElementById("restart").addEventListener('click', restart);
        console.log("Win Condition met");
    }
}

function updateGameState(time) {
    setInterval(function () {
        time++;
        if (health === 0) {
            restart();
        }
        if (health <= 4) {
            document.getElementById('overheat').play();
            document.getElementById('overheat').volume = 0.1;
            if (firstDamage === false) {
                document.getElementById('strobe').setAttribute("visible", true)
                firstDamage = true;
            }
        }
    }, 1000);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor(colors) {
    return colors[Math.floor(Math.random() * colors.length)];
}

// create random asteroid belt
function createRandomDebris(fieldsNum) {
    let i;
    for (i = 0; i < fieldsNum; i++) {
        let asteroidContainer = document.createElement('a-entity');
        let posxP = getRandomInt(-10000, 21000);
        let poszP = getRandomInt(-5000, 12000);
        let posyP = getRandomInt(-1000, 21000);
        asteroidContainer.setAttribute('position', {x: posxP, y: posyP, z: poszP});
        let randomDebrisNum = getRandomInt(80, 400);
        let i;
        for (i = 0; i < randomDebrisNum; i++) {
            let debrisScale = getRandomInt(1, 20);
            let debris = document.createElement('a-dodecahedron');
            debris.object3D.scale.set(debrisScale, debrisScale, debrisScale);
            debris.setAttribute('debris', '');
            // add random texture for planets - TO DO
            debris.setAttribute('name', 'debris');
            debris.setAttribute('id', 'debris');
            debris.setAttribute('cursor-listener', '');
            debris.setAttribute('class', 'debris');
            debris.setAttribute('cursor-listener', '');
            debris.setAttribute('animation-mixer');
            debris.setAttribute('material', 'src', '#debris');
            debris.setAttribute('body', {type: 'dynamic', mass: "1", linearDamping: "0.5"});
            debris.setAttribute('material', 'color', 'brown');
            asteroidContainer.appendChild(debris);
        }
    }
}

// create a planet
function createPlanet(star, scale, numPlanets, posx, posy, posz, planetnames, uniqueSolarID) {
    let i;
    for (i = 0; i < numPlanets; i++) {
        // function to create planets with random position
        let planet = document.createElement('a-sphere');
        let colorArr = ['#880000', '#274E13', '#3D85C6', '#7F6000'];
        // texture application
        // let plaettextArr = ['#880000', '#274E13', '#3D85C6', '#7F6000'];
        let planettextureArr = ['#martianPlanet', '#gasPlanet', '#icyPlanet', '#desertPlanet', '#waterPlanet', '#TerrestrialPlanet'];
        let color = getRandomColor(colorArr);
        let randomTextureID = getRandomInt(0, planettextureArr.length - 1);
        let randomTexture = planettextureArr[randomTextureID];
        let planetType = returnPlanetType(randomTexture)
        // scale and genearte random orbits
        let planetScale = getRandomInt(3, 15);
        planet.object3D.scale.set(planetScale, planetScale, planetScale);
        planet.setAttribute('planet', '');
        // add random texture for planets - TO DO
        planet.setAttribute('name', 'planet');
        planet.setAttribute('planet', '');
        planet.setAttribute('planet-type', planetType);
        planet.setAttribute('id', planetnames[planetNameCurrent]);
        planet.setAttribute('class', 'planet' + planetNameCurrent);
        planet.setAttribute('cursor-listener', '');
        planet.setAttribute('animation-mixer');
        planet.setAttribute('material', 'src', randomTexture);
        planet.setAttribute('material', 'color', color);
        planet.setAttribute('body', {type: 'dynamic', mass: "5", linearDamping: "0.5"});
        // set positions in a plantery orbit
        let r = getRandomInt(15, 35);
        let theta = 0;
        let dTheta = 2 * Math.PI / 1000;
        theta += dTheta;
        let randRP_x = r * Math.cos(theta);
        let randRP_z = r * Math.sin(theta);
        let sunRadius = scale / 2;
        let planetPos = {
            x: sunRadius + getRandomInt(-150, 150),
            y: getRandomInt(0, 2),
            z: sunRadius + getRandomInt(-150, 150)
        };
        planet.setAttribute('position', planetPos)
        let solarSystemID = document.getElementById(uniqueSolarID);
        solarSystemID.appendChild(planet);
        planetNameCurrent++;
    }
}

function createPortals(portalsNum) {
    let i;
    for (i = 0; i < 5; i++) {
        console.log('PORTALS CREATED')
        let portal = document.createElement('a-sky');
        let posxP = getRandomInt(-40000, 20000);
        let poszP = getRandomInt(-5000, 20000);
        let posyP = getRandomInt(-1000, 20000);
        let scaleP = getRandomInt(200, 300);

        portal.setAttribute('position', {x: posxP, y: posyP, z: poszP});
        portal.object3D.scale.set(scaleP, scaleP, scaleP);
        let colorArr = ['white', 'orange', 'red'];
        let color = getRandomColor(colorArr);
        portal.setAttribute('material', 'src', color);
        portal.setAttribute('name', 'portal');
        portal.setAttribute('class', 'portal');
        portal.setAttribute('material', 'src', '#wormholeBG_v');
        document.getElementById('solarSystems').appendChild(portal);
    }
}

function createStars(amount) {
    console.log('create stars ran');
    let starNum = amount;
    let i;
    for (i = 0; i < starNum; i++) {
        let star = document.createElement('a-sphere');
        let solarSystem = document.createElement('a-entity');
        let posx = getRandomInt(-25000, 25000);
        let posz = getRandomInt(-25000, 25000);
        let posy = getRandomInt(-25000, 25000);
        let scale = getRandomInt(50, 420);
        star.setAttribute('position', {x: posx, y: posy, z: posz});
        star.object3D.scale.set(scale, scale, scale);
        star.setAttribute('star', '');
        star.setAttribute('name', 'star');
        star.setAttribute('class', 'star' + i);
        star.setAttribute('cursor-listener', '');
        star.setAttribute('src', 'energy.jpg');
        star.setAttribute('radius', '1');
        star.setAttribute('material', 'emissive: yellow; emissive-intensity: 5;   flat:true');
        star.setAttribute('color', 'white');
        star.setAttribute('rotation', "0 0 0");
        solarSystem.setAttribute('position', {x: posx, y: posy, z: posz});
        solarSystem.setAttribute('id', 'solarSystem' + i);
        solarSystem.setAttribute('class', 'solarSystem');
        // sun glow effect
        let glowFX = document.createElement('a-image');
        glowFX.setAttribute('width', '3');
        glowFX.setAttribute('height', '5');
        glowFX.setAttribute('look-at', '#rig');
        glowFX.setAttribute('src', '#glow');
        glowFX.setAttribute('color', 'yellow');
        glowFX.setAttribute('material', 'transparent: true; opacity: 1.0; alphaTest: 0.01;');
        star.setAttribute('body', {type: 'dynamic', mass: "10", linearDamping: "0.5"});
        star.appendChild(glowFX);
        // star.setAttribute('animation', "property: rotation; to: 180 360 180; loop; dur: 10000");
        const solarSystemEnt = document.getElementById('solarSystems');
        solarSystemEnt.appendChild(solarSystem);
        solarSystemEnt.appendChild(star);
        let numPlanets = getRandomInt(5, 12);
        // create var for planet names and psas number of generated planets
        planetnames = genNames(numPlanets);
        let uniqueSolarID = 'solarSystem' + i;

        createPlanet(star, scale, numPlanets, posx, posy, posz, planetnames, uniqueSolarID);
        // light generation
        // randomise intensity of lights
        // let randIntensity = this.getRandomInt(0.1, 0.6);
        // // set light attirbute
        // star.setAttribute('light', 'type: spot; intensity:' + randIntensity + 'decay: 0.12; penumbra: 0.24; castShadow: false');
    }
    // randomPlanetId = 'planet' + [getRandomInt(0, planetnames.length)];
}
//draw the background stars
AFRAME.registerComponent('star-system', {
    schema: {
        color: {
            type: 'string',
            default: "#FFF"
        },
        radius: {
            type: 'number',
            default: 4000,
            min: 0,
        },
        depth: {
            type: 'number',
            default: 4000,
            min: 0,
        },
        size: {
            type: 'number',
            default: 1,
            min: 0,
        },
        count: {
            type: 'number',
            default: 20000,
            min: 0,
        },
        texture: {
            type: 'asset',
            default: ''
        }
    },

    update: function () {
        // Check for and load star sprite
        let texture = {};
        if (this.data.texture) {
            texture.transparent = true;
            texture.map = new THREE.TextureLoader().load(this.data.texture);
        }
        const stars = new THREE.Geometry()
        // Randomly create the vertices for the stars
        while (stars.vertices.length < this.data.count) {
            stars.vertices.push(this.randomVectorBetweenSpheres(this.data.radius, this.data.depth));
        }
        // Set the star display options
        const starMaterial = new THREE.PointsMaterial(Object.assign(texture, {
            color: this.data.color,
            size: this.data.size
        }));
        // Add the star particles to the element
        this.el.setObject3D('star-system', new THREE.Points(stars, starMaterial));
    },

    remove: function () {
        this.el.removeObject3D('star-system');
    },

    // Returns a random vector between the inner sphere
    // and the outer sphere created with radius + depth
    randomVectorBetweenSpheres: function (radius, depth) {
        const randomRadius = Math.floor(Math.random() * (radius + depth - radius + 1) + radius);
        return this.randomSphereSurfaceVector(randomRadius);
    },

    // Returns a vector on the face of sphere with given radius
    randomSphereSurfaceVector: function (radius) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
    }
});

// function to return planet type from param
function returnPlanetType(textureName) {
    switch (textureName) {
        case '#gasPlanet':
            return 'Gas'
            break;
        case '#icyPlanet':
            return 'Ice'
            break;
        case '#desertPlanet':
            return 'Desert'
            break;
        case '#waterPlanet':
            return 'Water'
            break;
        case '#TerrestrialPlanet':
            return 'Terrestrial'
            break;
        default:

    }
};

// function to return planet size for generating sectors
function returnPlanetSize(planetScale) {
    switch (planetScale) {
        case 3:
            return 10
            break;
        case 5:
            return 15
            break;
        case 7:
            return 18
            break;
        case 9:
            return 22
            break;
        case 11:
            return 25
            break;
        case 13:
            return 30
            break;
        case 15:
            return 35
            break;
        default:

    }
};





