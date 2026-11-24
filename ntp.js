let real = 1000;                                 
const server = { clock: () => real };              
class Client { constructor(offset) { this.offset = offset; } clock() { return real + this.offset; } }

function sync(c, out, proc, back) {
  const t0 = c.clock();                          
  real += out;
  const t1 = server.clock();                       
  real += proc;
  const t2 = server.clock();                   
  real += back;
  const t3 = c.clock();                          

  const offset = ((t1 - t0) + (t2 - t3)) / 2;      
  const delay  = (t3 - t0) - (t2 - t1);
  c.offset += offset;                             
  console.log({ offset, delay, error: c.clock() - real });
}

sync(new Client(-50), 10, 4, 10);   
sync(new Client(-50), 2, 4, 18);    
sync(new Client(-50), 2, 100, 18);    