let real = 1000;                               
const server = { clock: () => real };              
class Client { constructor(offset) { this.offset = offset; } clock() { return real + this.offset; } }

function sync(c, delayOut, delayBack) {
  const t0 = c.clock();
  real += delayOut;
  console.log(real)
  const T = server.clock();
  real += delayBack;
  console.log(real)
  const t1 = c.clock();
  const est = T + (t1 - t0) / 2;
  c.offset = est - real;
  console.log(`estimate=${est}, real=${real}, error=${est - real}`);
}

sync(new Client(-900), 10, 10);
sync(new Client(-900), 18, 2);    