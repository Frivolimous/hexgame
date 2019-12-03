export function logObjectArray(array) {
    let s = '[';
    array.forEach(obj => {
        s += '{';
        for (let key of Object.keys(obj)) {
            let val = obj[key];
            s += key + ': ' + val + ', ';
        }
        s += '}, ';
    });
    s += ']';
    console.log(s);
}
export function logObject(obj) {
    let s = '{';
    for (let key of Object.keys(obj)) {
        let val = obj[key];
        s += key + ': ' + val + ', ';
    }
    s += '}, ';
    console.log(s);
}
