export function chunk(ary, n) {
  const len = Math.round(ary.length / n, 10);
  let ret = [];

  for(let i = 0; i < len; i++) {
      ret.push( ary.slice(i * n, i * n + n )  )
  }
  
  return ret;
}
