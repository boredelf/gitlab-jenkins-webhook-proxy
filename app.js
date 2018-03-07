const Proxy = require('./app/proxy');
const parseJSON = require("body/json");

// TODO CONFIGURE DOTENV

new Proxy()
  .listeningOn('127.0.0.1', 8888)
  .accepting(req =>
    req.url.startsWith('/job/')
    && req.headers['x-gitlab-event']
    && req.connection.remoteAddress === env.gitlab.host)
  .withForwardingAction(req => parseJSON(req, null, {}, (err, body) => {
    if (err) { throw new Error(err); }
    console.log(body);
    // TODO trigger Jenkins job
  }))
  .start();