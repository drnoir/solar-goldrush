// utility / common functions
function pythagore(a, b, hypoth) {
    let result;
    let ab = [a, b];
    if(hypoth === null) {
        return Math.sqrt(Math.pow(a, 2) + Math.pow(b, 2));
    } else if (a === null || b === null) {
        ab = ab[0] || ab[1];
        return Math.sqrt(Math.pow(hypoth, 2) - Math.pow(ab, 2));
    }
}
console.log(pythagore(5, null, 13))

export { pythagore };