# gitlab-webhooker

This is a simple way to update your production code by GitLab triggers.
Added token to web hook get URL. For example: `http://myapp.com:4400?token=qwerty123`. Look how to use GitLab web hooks on official manual here: https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/web_hooks/web_hooks.md

### How to start

```javascript
var webhooker = require('gitlab-webhooker');

app.use(webhooker.init({
  token: 'qwerty123', // Optional. Secret key
  port: 4400, // Optional. Listen port
  events: ['push', 'tag_push', 'issue', 'merge_request'], // Optional. Event list for track
  command: 'cd ~/myapp; git pull origin master; if git diff --name-status HEAD HEAD~1 | grep -e package.json -e shrinkwrap.js; then npm install; fi' // Optional. Shell command when triggered
}));
```

### NOTE:

If you use forever don't forget to use .foreverignore file with `**/.git/**`. This will save you from false code restarting.
