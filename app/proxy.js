const http = require('http');

function Proxy() {}

Proxy.prototype.listeningOn = function (host, port) {
  this.host = host;
  this.port = port;
  return this;
};

Proxy.prototype.accepting = function (filter) {
  this.shouldAccept = filter;
  return this;
};

Proxy.prototype.withForwardingAction = function (forwarder) {
  this.forward = forwarder;
  return this;
};

Proxy.prototype.start = function () {
  http.createServer()
    .on('listening', () => console.log(`Proxy listening on ${this.host}:${this.port}`))
    .on('close', () => console.log('Proxy shut down.'))
    .on('request', (req, res) => {
      if (this.shouldAccept(req)) {
        try { this.forward(req); }
        catch (err) { console.error(`Proxy forwarder error: ${err.message}`); }
      }
      res.end();
    })
    .on('clientError', (err, socket) => {
      console.error(`Proxy client error: ${JSON.stringify(err)}`);
      socket.end();
    })
    .listen(this.port, this.host);
};

module.exports = Proxy;
