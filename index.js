var app = require('orangebox').app(1);
var exec = require('child_process').exec;
var path = require('path').resolve();
var extend = require('util')._extend;
var log = require('loglevel');

module.exports.init = function(opt) {

  var config = {
    token: '',
    port: 4400,
    path: '/',
    branches: '*',
    events: 'push',
    onEvent: null,
    onSuccess: null,
    command: 'cd ' + path + '; git pull origin master; if git diff --name-status HEAD HEAD~1 | grep -e package.json -e shrinkwrap.js; then npm update; fi',
    exit: false,
    logLevel: 'warn'
  };

  extend(config, opt);

  log.setDefaultLevel(config.logLevel || 'warn')
  app.get(config.path, function(req, res) {

    try {
      log.info('Request received!');
      log.debug(req);
      var json = JSON.parse(Object.keys(req.body)[0]);
    } catch (e) {
      log.warn('gitlab-webhooker: Post data are not GitLab JSON');
      log.debug(e);
      var json = {};
      res.status(400).send({status: 'Post data are not GitLab JSON'});
      return false;
    }

    var requestToken = req.header('x-gitlab-token') || req.query.token || false
    log.debug(requestToken)

    var branch = '*';
    if (!config.branches.includes('*')) {
      branch = (json.object_kind === 'push') ? json.ref.split('/').pop() :
               (json.object_kind === 'merge_request') ? json.object_attributes.target_branch :
               (json.object_kind === 'build') ? json.ref.split('/').pop() :   json.ref;
    }

    var passed_condition = true
    if(config.condition && typeof(config.condition) === "function"){
      passed_condition = config.condition.call(this,json)
    }


    log.debug("token: " + requestToken);
    log.debug("condition: " + passed_condition);
    log.debug("branch: " + json.ref);

    if (
      config.events.includes(json.object_kind) &&
      config.token === requestToken &&
      passed_condition &&
      config.branches.includes(branch)
    ) {

      res.status(200).send({status: 'OK'});

      if (typeof config.onEvent === 'function') config.onEvent(json);

      exec(config.command, function(err, stdout, stderr) {
        if (typeof config.onEvent === 'function') config.onSuccess.call(this, json, err, stdout, stderr)
        if (config.exit) process.exit(0);
      });

    } else {
      res.status(400).send({ status: 'Bad request' });
      log.warn("Bad request")
      log.info(req)
    }
  });

  app.listen(config.port, function() {
    log.info('gitlab-webhooker started on http://localhost:' + config.port);
  });
};
