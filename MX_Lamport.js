const names = ["A", "B", "C"], nodes = {}, wire = [];
const pump = () => { while (wire.length) { const m = wire.shift(); nodes[m.to].recv(m); } };

class Node {
  constructor(name) { this.name = name; this.t = 0; this.q = []; this.replies = 0; this.want = false; nodes[name] = this; }
  send(to, type) { wire.push({ to, type, ts: this.t, from: this.name }); }
  others() { return names.filter(n => n !== this.name); }
  sortQ() { this.q.sort((a, b) => a[0] - b[0] || (a[1] < b[1] ? -1 : 1)); }   

  request() {
    this.t++; this.want = true; this.replies = 0;
    this.q.push([this.t, this.name]);
    this.others().forEach(n => this.send(n, "REQ"));
  }
  recv(m) {
    this.t = Math.max(this.t, m.ts) + 1;                      
    if (m.type === "REQ") {
      this.q.push([m.ts, m.from]); this.sortQ();
      this.t++; this.send(m.from, "REPLY");                  
    }
    if (m.type === "REPLY") this.replies++;
    if (m.type === "REL") this.q = this.q.filter(r => r[1] !== m.from);
    this.tryEnter();
  }
  tryEnter() {
    this.sortQ();
    if (this.want && this.replies === names.length - 1 && this.q[0][1] === this.name) {
      console.log(`${this.name} ENTERS CS, queue=${JSON.stringify(this.q)}`);
      this.release();                                        
    }
  }
  release() {
    this.q = this.q.filter(r => r[1] !== this.name); this.want = false;
    this.t++; this.others().forEach(n => this.send(n, "REL"));
    console.log(`${this.name} releases`);
  }
}

const A = new Node("A"), B = new Node("B"), C = new Node("C");
A.t = 4; C.t = 3;            
A.request(); C.request();
console.log(wire)
pump();