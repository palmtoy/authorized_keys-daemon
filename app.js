#!/usr/bin/env node

var util = require('util');
var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var targetDir = '~/.ssh';
var filename = 'authorized_keys';
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

var id_rsa = null;

if(!fs.existsSync(rsaPath)) {
  console.error('%s not exist at current dir! Exit!', rsaPath);
  process.exit(1);
} else {
  id_rsa = fs.readFileSync(rsaPath).toString();
  if(!id_rsa) {
    console.error('%s is empty! Exit!', rsaPath);
    process.exit(1);
  }
  console.log('\n', (new Date()).getTime(), ': id_rsa = ', id_rsa);
  cmd = 'echo ' + id_rsa + ' >> ' + absolutePath;
  myExec(cmd);
}

var listener4watch = function(absolutePath) {
  return function(curr, prev) {
    if(curr.mtime.getTime() > prev.mtime.getTime()) {
      myExec(cmd);
    }
  };
};

var absolutePath = path.join(targetDir, filename);

console.log('absolutePath = ', absolutePath);
if(!fs.existsSync(absolutePath)) {
  console.error('%s not exist! Exit!', absolutePath);
  process.exit(1);
} else {
  fs.watchFile(absolutePath, { persistent: true, interval: interval }, listener4watch(absolutePath));
}


// Uncaught exception handler
process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err.stack);
});

