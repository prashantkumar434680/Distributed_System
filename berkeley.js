const clocks = { M: 200, A: 180, B: 250 };   
const avg = Object.values(clocks).reduce((s, x) => s + x) / 3;

for (const n in clocks) {
  const delta = avg - clocks[n];             
  clocks[n] += delta;                       
  console.log(n, "adjust by", delta);
}