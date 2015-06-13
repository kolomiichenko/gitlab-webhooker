var app = require('orangebox').app(1);
var exec = require('child_process').exec;
var path = require('path').resolve();
var extend = require('util')._extend;
module.exports.init = function(opt) {

  var config = {
    token: '',
    port: 4400,
    events: ['push', 'merge_request'],
    command: 'cd ' + path + '; git pull origin master; if git diff --name-status HEAD HEAD~1 | grep -e package.json -e shrinkwrap.js; then npm install; fi'
  };

  extend(config, opt);

  app.all('/', function(req, res) {

    try {
      var json = JSON.parse(Object.keys(req.body)[0]);
    } catch (e) {
      console.error('gitlab-hooker: Post data are not GitLab JSON');
      var json = {};
    }

    if (config.token === req.query.token && config.events.indexOf(json.object_kind) !== -1) {

      exec(config.command, function (err, stdout, stderr) {
        if (stderr !== {} && err === null) {
          res.status(200).send({ status: 'OK', stdout: stdout, stderr: stderr });
        } else {
          res.status(500).send({ status: 'Something wrong', stdout: stdout, stderr: stderr, err: err });
        }
      });

    } else {
      res.status(400).send({ status: 'Bad Request' });
    }
  });

  app.listen(config.port, function() {
  	console.log('gitlab-webhooker started on http://localhost:' + config.port);
  });
};
