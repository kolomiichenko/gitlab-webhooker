# gitlab-webhooker

This is a simple way to update your production code by GitLab triggers.
Added token to web hook get URL. For example: `http://myapp.com:4400?token=qwerty123`. Look how to use GitLab web hooks on official manual [here](https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/web_hooks/web_hooks.md).

### How to start

```javascript
var webhooker = require('gitlab-webhooker');

webhooker.init({
  token: 'qwerty123', // Optional. Default: ''. Secret key
  port: 4400, // Optional. Default: 4400. Listen port
  path: '/webhook', // Optional.  Default '/'
  branches: ['master', 'dev'], // Optional. Default '*'. Branches for track
  events: ['push', 'merge_request'], // Optional. Default: 'push'. Event list for track
  onEvent: function(json) { /* some js */ }, // Optional. Default: null. Call before exec command
  condition: function(json){ /* some logic */}, // Optional. Default null. Called to check weather to execute onEvent or not. Use the json from the gitlab request to check some logic.
  onSuccess: function(json,err, stdout, stderr){ /* some logic */}, // Optional. Default null. Gets call after the command has been executed
  command: 'cd ~/myapp; ./deploy.sh', // Optional. Shell command when triggered
  exit: true, // Optional. Default: false. process.exit(0) after complete command (if you use Docker)
  logLevel: 'info' // set Loglevel trace, debug, info, warn, error
});
```

### NOTE

If you use forever don't forget to use `.foreverignore` file with `**/.git/**`.
This will save you from false code restarting.

### License

The MIT License (MIT)

Copyright (c) 2015 Andrii Kolomiichenko (bboywilld@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
