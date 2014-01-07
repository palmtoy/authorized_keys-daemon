var util = require('util');
var fs = require('fs');
var exec = require('child_process').exec;

var printConf = function() {
  if(!!rsaConf) {
    console.warn('\n', (new Date()).getTime(), ': rsaConf = ', util.inspect(rsaConf.findById(1), {showHidden: true, depth: null}))
    console.warn('==============================================');
  }
};

setInterval(function() { printConf(); }, 5000);


var targetDir = '~/.ssh';
var filename = 'authorized_keys';
var rsaPath = './id_rsa.pub';
var interval = 3000;

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
  console.log('\n', (new Date()).getTime(), ': id_rsa = %s', id_rsa);
}

var listener4watch = function(absolutePath) {
  return function(curr, prev) {
    if(curr.mtime.getTime() > prev.mtime.getTime()) {
      var tmpCmd = 'echo ' + id_rsa + ' >> ' + absolutePath;
      exec(tmpCmd,
           function(errorA, stdoutA, stderrA) {
             if(errorA !== null) {
               console.log('exec errorA: ' + errorA);
             } else {
               console.log(stdoutA);
             }
           });
    }
  };
};

var absolutePath = path.join(targetDir, filename);

if(!fs.existsSync(absolutePath)) {
  console.error('%s not exist at %s! Exit!', filename, absolutePath);
  process.exit(1);
} else {
  fs.watchFile(absolutePath, { persistent: true, interval: interval }, self.listener4watch(absolutePath));
}


// Uncaught exception handler
process.on('uncaughtException', function(err) {
  console.error(' Caught exception: ' + err.stack);
});

