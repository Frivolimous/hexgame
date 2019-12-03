export function logObjectArray(array: any[]) {
  let s = '[';
  array.forEach(obj => {
    s += '{';
    for (let key of Object.keys(obj)) {
      let val = (obj as any)[key];
      s += key + ': ' + val + ', ';
    }
    s += '}, ';
  });
  s += ']'
  console.log(s);
}

export function logObject(obj: any) {
  let s = '{';
  for (let key of Object.keys(obj)) {
    let val = (obj as any)[key];
    s += key + ': ' + val + ', ';
  }
  s += '}, ';
  console.log(s);
}