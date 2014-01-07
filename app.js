#!/usr/bin/env node

var util = require('util');
var fs = require('fs');
var exec = require('child_process').exec;

var targetPath = process.env.HOME + '/.ssh/authorized_keys';
var rsaPath = './id_rsa.pub';
var interval = 3000;
var cmd = null;

var myExec = function(tmpCmd) {
  exec(tmpCmd,
       function(errorA, stdoutA, stderrA) {
         if(errorA !== null) {
           console.log('exec errorA: ' + errorA);
         } else {
           console.log(stdoutA);
         }
       });

};

if(!fs.existsSync(rsaPath) || !fs.existsSync(targetPath)) {
  console.error('%s or %s not exist! Exit!', rsaPath, targetPath);
  process.exit(1);
} else {
  var id_rsa = fs.readFileSync(rsaPath).toString();
  if(!id_rsa) {
    console.error('%s is empty! Exit!', rsaPath);
    process.exit(1);
  }
  cmd = 'echo \"' + id_rsa + '\" >> ' + targetPath;
  myExec(cmd);
}

var listener4watch = function(targetPath) {
  return function(curr, prev) {
    if(curr.mtime.getTime() > prev.mtime.getTime()) {
      myExec(cmd);
    }
  };
};

fs.watchFile(targetPath, { persistent: true, interval: interval }, listener4watch(targetPath));
console.log('I\'m watching the file %s ...', targetPath);


// Uncaught exception handler
process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err.stack);
});

