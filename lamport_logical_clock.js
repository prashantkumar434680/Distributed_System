const net = {}; 

class Node {
  constructor(name) {
    this.name = name;
    this.t = 0;
    net[name] = this;
  } 
  send(to, text) {
    this.t++;
    console.log(`${this.name} -> ${to}: ${text} (t=${this.t})`);
    net[to].recv(text, this.name, this.t); 
  }
  recv(text, from, ts) {
    this.t = Math.max(this.t, ts) + 1;
    console.log(`${this.name} got "${text}" from ${from} (t=${this.t})`);
  }
}

const A = new Node("A"), B = new Node("B"), C = new Node("C");
console.log(net);
A.send("B", "hello");
A.send("C", "this is from A");
C.send("B", "hi B, this is C");