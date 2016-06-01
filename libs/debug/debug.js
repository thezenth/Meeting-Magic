chalk = require('chalk');

function dlog (msg, opts) {

  //possibly add cases for warnings?

  /* **opts**
  opts: {
    id: "some debug identifier like mongodb or sever - i.e., the source usually",
    isError: is this an error message (boolean),
    errMsg: "extra error string, only if isError is true"
  }
  */

  def = chalk.yellow.bold
  mongodb = chalk.bgCyan.bold;
  server = chalk.bgYellow.bold;
  error = chalk.bgRed.bold;

  switch (opts.id) {
    case 'mongodb':
      startStr = mongodb(opts.id);
      break;
    case 'server':
      startStr = server(opts.id);
      break;
    default:
      startStr = def(opts.id);
      break;
  }

  mainStr = startStr + ":" + msg;
  console.log(mainStr); //this gets called whether or not there is an error

  if (opts.isError) {
    errStr = startStr + error(" ERROR:") + opts.errMsg;
    console.log(errStr);
  }

}

exports.dlog = dlog;
