const names = ["A", "B", "C"];

class Node {
  constructor(name) { this.i = names.indexOf(name); this.name = name; this.v = [0, 0, 0]; this.buf = []; }
  broadcast(text) { this.v[this.i]++; return { text, from: this.i, v: [...this.v] }; } 
  recv(m) { this.buf.push(m); this.flush(); }
  ok(m) { return  this.v[m.from]=== m.v[m.from] - 1 && m.v.every((x, k) => k === m.from || x <= this.v[k]); }
  flush() {
    let m;
    while ((m = this.buf.find(x => this.ok(x)))) {
      this.buf.splice(this.buf.indexOf(m), 1);
      this.v[m.from]++;
      console.log(`${this.name} delivered ${m.text}, v=${this.v}`);
    }
  }
}

const A = new Node("A"), B = new Node("B"), C = new Node("C");
const m1 = A.broadcast("m1");   
B.recv(m1);                     
const m2 = B.broadcast("m2");   
C.recv(m2);                     
console.log("C buffer:", C.buf.length);
C.recv(m1);                     
const m3 = C.broadcast("m3");
A.recv(m3);
console.log("A buffer:", A.buf.length);   
A.recv(m2);