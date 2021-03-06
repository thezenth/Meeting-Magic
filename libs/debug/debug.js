chalk = require('chalk');
/**
 * A function which uses Chalk to display colored debug messages, based upon the context of the message (is it a warning, is it from mongodb, etc.)
 *
 * @method dlog
 * @param {String} msg The debug message to be displayed.
 * @param {Object} opts An object with options for the id of the message (i.e., is it from the server, mongodb, etc.), and whether it is a warning, error, or neither. Specification: { id: String, isWarning: Boolean, isError: Boolean }.
 */
function dlog(msg, opts) {

	//possibly add cases for warnings?

	/* **opts**
	opts: {
	  id: "some debug identifier like mongodb or sever - i.e., the source usually",
	  isWarning: is this a warning message, but maybe not code breaking (boolean),
	  isError: is this an error message (boolean),
	}
	*/

	if (msg !== null && typeof msg == 'object') {
		msg = JSON.stringify(msg, null, 4);
	}

	//msgTxt = chalk.gray;
	var def = chalk.yellow.bold;
	var error = chalk.black.bgRed.bold;
	var warning = chalk.black.bgYellow.bold;

	var mongodb = chalk.black.bgCyan.bold;
	var server = chalk.black.bgBlue.bold;
	var api_fetch = chalk.black.bgMagenta.bold;

	var startStr = "";

	switch (opts.id) {
	case 'mongodb':
		startStr = mongodb(opts.id);
		break;
	case 'server':
		startStr = server(opts.id);
		break;
	case 'google-places-api':
		startStr = api_fetch(opts.id);
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
