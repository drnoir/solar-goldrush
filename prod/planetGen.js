var digrams = "ABOUSEITILETSTONLONUTHNO" +
    "..LEXEGEZACEBISOUSESARMAINDIREA.ERATENBERALAVETIEDORQUANTEISRION";

function rotatel(x) {
    var tmp = (x & 255) * 2;
    if (tmp > 255) tmp -= 255;
    return tmp;
}

function twist(x) {
    return (256 * rotatel(x / 256)) + rotatel(x & 255);
}

function next(seeds) {
    return seeds.map(function (seed) {
        return twist(seed);
    });
}

function tweakseed(seeds) {
    var tmp;

    tmp = seeds.reduce(function (total, seed) {
        return total += seed;
    }, 0);

    return seeds.map(function (seed, index, arr) {
        return arr[index + 1] || (tmp & 65535)
    });
};


function makename(pairs, seeds) {
    var name = [];
    /* Modify pair if you want to have names shorter or longer than 8 chars */
    /* I'll leave that as an exercise for you. */
    var pair = [0, 0, 0, 0];
    var longname = seeds[0] & 64;

    pair = pair.map(function () {
        seeds = tweakseed(seeds);
        return 2 * ((seeds[2] / 256) & 31);
    });

    pair.forEach(function (value, index, arr) {
        if (longname || (index < (arr.length - 1))) {
            name.push(pairs[value]);
            name.push(pairs[value + 1]);
        }
    });

    return name.join('').toLowerCase()
        .replace(/^\w/, function (letter) {
            return letter.toUpperCase();
        });
}

function genNames(numPlanets) {
    var names = [];
    var pairs;
    var num = numPlanets
    var seeds = [23114, 584, 46931];
    pairs = digrams.substring(24);

    while (--num) {
        names.push(makename(pairs, seeds));
        seeds = tweakseed(next(seeds));
    }

    return names;
}

function genGalaxyName() {
    let randGalaxyName = '';
    let pairs;
    let seeds = [ getRandomInt(400,60000),getRandomInt(100,700),getRandomInt(200,60000)];
    pairs = digrams.substring(24);

    randGalaxyName = makename(pairs, seeds);
    seeds = tweakseed(next(seeds));

    return randGalaxyName;
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export { genNames,  genGalaxyName };
