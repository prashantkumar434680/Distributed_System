const names = ["A","B","C"], nodes = {}, wire = [];
const pump = () => { while (wire.length) { const m = wire.shift(); nodes[m.to].recv(m); } };

class Node {
  constructor(name) { this.name = name; this.t = 0; this.state = "IDLE"; this.myTs = 0; this.replies = 0; this.deferred = []; nodes[name] = this; }
  send(to, type) { wire.push({ to, type, ts: this.t, from: this.name }); }
  others() { return names.filter(n => n !== this.name); }
  iAmFirst(m) { return this.myTs < m.ts || (this.myTs === m.ts && this.name < m.from); }

  request() {
    this.t++; this.state = "WANT"; this.myTs = this.t; this.replies = 0;
    this.others().forEach(n => this.send(n, "REQ"));
  }
  recv(m) {
    this.t = Math.max(this.t, m.ts) + 1;
    if (m.type === "REQ") {
      const defer = this.state === "CS" || (this.state === "WANT" && this.iAmFirst(m));
      defer ? this.deferred.push(m.from) : this.send(m.from, "REPLY");
    } else this.replies++;
    if (this.state === "WANT" && this.replies === names.length - 1) this.enter();
  }
  enter() {
    this.state = "CS"; console.log(`${this.name} ENTERS`);
    this.state = "IDLE";                      // CS body = just the print
    console.log(`${this.name} exits, sending deferred replies to [${this.deferred}]`);
    this.deferred.forEach(n => this.send(n, "REPLY")); this.deferred = [];
  }
}

const A = new Node("A"), B = new Node("B"), C = new Node("C");
A.t = 4; C.t = 3;
A.request(); C.request();
pump();