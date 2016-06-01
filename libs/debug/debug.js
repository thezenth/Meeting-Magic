chalk = require('chalk');

function dlog (msg, opts) {

  //possibly add cases for warnings?

  /* **opts**
  opts: {
    id: "some debug identifier like mongodb or sever - i.e., the source usually",
    isWarning: is this a warning message, but maybe not code breaking (boolean),
    isError: is this an error message (boolean),
  }
  */

  //msgTxt = chalk.gray;
  def = chalk.yellow.bold;
  error = chalk.black.bgRed.bold;
  warning = chalk.black.bgYellow.bold;

  mongodb = chalk.black.bgCyan.bold;
  server = chalk.black.bgBlue.bold;


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

  if (opts.isWarning) {
    mainStr = startStr + warning("WARNING:") + msg;
  }

  if (opts.isError) {
    mainStr = startStr + error(" ERROR:") + msg;
  }

  console.log(mainStr); //this gets called whether or not there is an error

}

exports.dlog = dlog;
