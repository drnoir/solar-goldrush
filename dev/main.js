// script for generating buildings / game logic etc
// global game vars

import { default as genNames } from './planetGen.js';

const starsNum = getRandomInt(200, 500);
let gamestarted = false;
let firstDamage = false;
let health = 10;
let spaceMana = 0;
let fuel = 1000;


window.onload = function () {
    // const playBtn = document.getElementById("playBtn");
    const Win = document.getElementById("Win");
    beginGame();
    // playBtn.addEventListener('click', beginGame);

    // LOAD GAME IN BG? PRELOADER?
};

// controls and audio for controls  (seperate JS file?)
document.addEventListener("keydown", e => {
    console.log("key Pressed"+ e.code);
    let key = e.key.toUpperCase();
    // 87 - w
    if (key === 'W'){
        const ship = document.getElementById('rig');
        ship.setAttribute('movement-controls', 'speed'+0.5);
        console.log(ship)
        // add event listener for w press for accel
        document.getElementById('accel').play();
        document.getElementById('accel').volume = 0.4;
    }
});

document.addEventListener("keydown", e => {
    console.log("key Pressed for fire");
    let key = e.key.toUpperCase();
    // 87 - w
    // if (e === "87"){
    //     // add event listener for w press for accel
    //     document.getElementById('accel').play();
    //     document.getElementById('accel').volume = 0.4;
    // }
});


AFRAME.registerComponent('player', {
    init: function () {
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
                console.log("star");
                const box = document.querySelector('a-box');
                let winboxRemove = e.detail.body.el;
                box.parentNode.removeChild(winboxRemove);
                document.getElementById('pickup').play();
                decrementScore();
            }

            // debris? - Landing for planet
            if (e.detail.body.el.className === "debris") {
                console.log("star collide");
                const box = document.querySelector('a-box');
                document.getElementById('damage').play();
                health--;
            }

            // change to aura later but for now test planet collision
            if (e.detail.body.el.className === "aura") {
                console.log("planet Aura");
                const planet = document.querySelector('a-sphere');
                document.getElementById('collect').play();
                spaceMana++;
            }

            // change to aura later but for now test planet collision
            if (e.detail.body.el.className === "planet") {
                console.log("planet Aura");
                const planet = document.querySelector('a-spherwe');
                document.getElementById('collect').play();
                health = -10;
            }
        });
    }
})

// asteroid - WHEN added
AFRAME.registerComponent('gamebox', {
    init: function () {
        this.direction = 1;
        this.position = new THREE.Vector3();
        this.position.copy(this.el.object3D.position);
        setTimeout(() => {
            this.ready = true;
        }, 3000);
    },

    tick: function () {
        if (!this.ready) return;
        var position = this.el.object3D.position.y;
        if (position <= 0) {
            this.direction = 1;
        } else if (position >= 5) {
            this.direction = -1;
        }
        this.el.object3D.position.set(this.position.x, position + 0.05 * this.direction, this.position.z);
    }

});

// planet rotation and compoenent etc
// AFRAME.registerComponent('planet', {
//     init: function () {
//         // this.direction = 1;
//         // this.rotation = new THREE.Vector3();
//         // this.rotation.copy(this.el.object3D.rotation);
//         // setTimeout(() => {
//         //     this.ready = true;
//         // }, 3000);
//     },
//
//     tick: function () {
//     //     if (!this.ready) return;
//     //     let rotate= this.el.object3D.position.y;
//     //     if ( rotate <= 0) {
//     //         this.rotation = 1;
//     //     } else if ( rotate >= 5) {
//     //         this.rotation = -1;
//     //     }
//     //     this.el.object3D.rotation.set(this. rotate.x,  rotate.y + 0.05 * this.direction, this. rotate.z);
//     // }
//     // }
// );

function beginGame() {
    let time = 0;
    gamestarted = true;

    document.getElementById('warp').play();
    document.getElementById('warp').volume = 0.4;

    document.getElementById('ambience').play();
    document.getElementById('ambience').volume = 0.3;
    document.getElementById('ambience').loop = true;

    const cubesCreated = document.getElementById('cubesCreated');
    const cubesLeft = document.getElementById('cubesLeft');
    const cubesTotal = document.getElementById('totalCubes');
    const healthLeft = document.getElementById('healthLeft');
    const portalNum = 3;

    createStars(starsNum);
    healthLeft.innerHTML = health.toString()
    createPortals(portalNum);

    document.getElementById('myAudio').play();
    document.getElementById('myAudio').volume = 0.2;
    console.log("Game Started");
    // playBtn.style.visibility = "hidden";
    updateGameState(time);

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
        // cubesLeft.innerHTML = amountofWinBoxes;
        healthLeft.innerHTML = health;
        // console.log(time, amountofWinBoxes);
        // if (time === totalTime) {
        //     restart();
        // }
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

// create a planet
function createPlanet(sun, numPlanets, posx,posy,posz, planetnames) {
    let i;
    for (i = 0; i < numPlanets; i++) {
        // function to create planets with random position
        let planet = document.createElement('a-sphere');
        // get pos of sun
        let StarPosx = posx;  let  StarPosy = posy; let StarPosz = posz;
        console.log(StarPosx,StarPosy,StarPosz)
        // scale and genearte random orbits
        let scale = getRandomInt(2, 5);

        let planetSeedx = getRandomInt(200, 500);
        let planetSeedy = getRandomInt(200, 500);
        let planetSeedz = getRandomInt(200, 500);

        let planetPosX = StarPosx+planetSeedx;
        let planetPosZ = StarPosz+planetSeedz ;
        let planetPosY =  StarPosy+planetSeedy;

        console.log( planetPosX, planetPosZ, StarPosy);

        // set planet name from genearted planet names
        planet.setAttribute('position', {x: planetPosX, y: planetPosY , z:  planetPosZ });
        planet.setAttribute('animation', "property: rotation; to: 180 360 180; loop:"+true+"dur: 10000");
        // let envMap = './dev/textures/disturb.jpg';
        // planet.setAttribute('material' ,"color:  #ffffff; sphericalEnvMap:"+envMap);
        planet.object3D.scale.set(scale, scale, scale);
        planet.setAttribute('planet', '');
        // add random texture for planets - TO DO
        planet.setAttribute('name', 'planet');
        planet.setAttribute('planetName',planetnames[i]);
        planet.setAttribute('class', 'planet');
        planet.setAttribute('animation-mixer');

        let colorArr = ['#880000', '#274E13', '#3D85C6', '#7F6000'];
        // texture application
        // let plaettextArr = ['#880000', '#274E13', '#3D85C6', '#7F6000'];
        let color = getRandomColor(colorArr);

        // add aura
        let aura = document.createElement('a-sphere');

        // planet.setAttribute('material', 'src', 'energy.jpg');
        planet.setAttribute('material', 'color', color);
        document.querySelector('a-scene').appendChild(planet);
        planet.setAttribute('body', {type: 'dynamic', mass: "5000", linearDamping: "0.5"})
    }

}


// aura ode to reuse
// let auraScale = getRandomInt(scale + 25, scale + 25);
// aura.setAttribute('body', {type: 'static'})
// aura.setAttribute('position', {x: posx, y: posy, z: posz});
// aura.object3D.scale.set(auraScale, auraScale, auraScale);
// aura.setAttribute('planetAura', '');

function createPortals(portalsNum) {
    let i;
    for (i = 0; i < 3; i++) {
        let portal = document.createElement('a-sky');
        let posxP = getRandomInt(-40000, 20000);
        let poszP = getRandomInt(-5000, 20000);
        let posyP = getRandomInt(-1000, 20000);
        let scaleP = getRandomInt(500, 500);

        portal.setAttribute('position', {x: posxP, y: posyP, z: poszP});
        portal.object3D.scale.set(scaleP, scaleP, scaleP);
        let colorArr = ['white', 'orange', 'red'];
        let color = getRandomColor(colorArr);
        portal.setAttribute('material', 'src', color);
        portal.setAttribute('name', 'portal');
        portal.setAttribute('class', 'portal');
        portal.setAttribute('material', 'src', '#spaceBG_v');
        document.querySelector('a-scene').appendChild(portal);
    }
}

function createStars(amount) {
    let starNum = amount;
    let i;
    for (i = 0; i < starNum; i++) {
        let star = document.createElement('a-sphere');
        let posx = getRandomInt(-10000, 10000);
        let posz = getRandomInt(-10000,10000);
        let posy = getRandomInt(-10000,10000);
        let scale = getRandomInt(25, 100);
        star.setAttribute('position', {x: posx, y: posy, z: posz});
        star.object3D.scale.set(scale, scale, scale);
        star.setAttribute('star', '');
        star.setAttribute('name', 'star');
        star.setAttribute('class', 'star');
        // let colorArr = ['#880000', '#274E13', '#3D85C6', '#7F6000'];
        // let color = getRandomColor(colorArr);
        // star.setAttribute('material', 'src', 'energy.jpg');
        star.setAttribute('material',  'color', 'yellow', 'shader','ios10hls');

        star.setAttribute('rotation', "0 0 0");
        star.setAttribute('animation', "property: rotation; to: 180 360 180; loop; dur: 10000");

        document.querySelector('a-scene').appendChild(star);
        star.setAttribute('body', {type: 'dynamic', mass: "1", linearDamping: "0.1"});
        // star.setAttribute('light',"color:  #8f9108;  decay:  2.27;  distance:  1.5;  intensity:  2;  penumbra:  1;  type:  ambient;  shadowBias:  1.03;  shadowRadius:  1.13")
        let numPlanets  = getRandomInt(5,10);
        // create var for planet names and psas number of generated planets
        let planetnames;
        planetnames = genNames(numPlanets);
        createPlanet(star, numPlanets, posx,posy,posz, planetnames);


        // light generation
        // randomise intensity of lights
        // let randIntensity = this.getRandomInt(0.1, 0.6);
        // // set light attirbute
        // star.setAttribute('light', 'type: spot; intensity:' + randIntensity + 'decay: 0.12; penumbra: 0.24; castShadow: false');
    }
}

AFRAME.registerComponent('star-system', {
    schema: {
        color: {
            type: 'string',
            default: "#FFF"
        },
        radius: {
            type: 'number',
            default: 300,
            min: 0,
        },
        depth: {
            type: 'number',
            default: 300,
            min: 0,
        },
        size: {
            type: 'number',
            default: 1,
            min: 0,
        },
        count: {
            type: 'number',
            default: 10000,
            min: 0,
        },
        texture: {
            type: 'asset',
            default: ''
        }
    },

    update: function() {
        // Check for and load star sprite
        let texture = {};
        if (this.data.texture) {
            texture.transparent = true;
            texture.map = new THREE.TextureLoader().load(this.data.texture);
        }

        const stars = new THREE.Geometry();

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

    remove: function() {
        this.el.removeObject3D('star-system');
    },

    // Returns a random vector between the inner sphere
    // and the outer sphere created with radius + depth
    randomVectorBetweenSpheres: function(radius, depth) {
        const randomRadius = Math.floor(Math.random() * (radius + depth - radius + 1) + radius);
        return this.randomSphereSurfaceVector(randomRadius);
    },

    // Returns a vector on the face of sphere with given radius
    randomSphereSurfaceVector: function(radius) {
        const theta = 2 * Math.PI * Math.random();
        const phi = Math.acos(2 * Math.random() - 1);
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        return new THREE.Vector3(x, y, z);
    }
});
