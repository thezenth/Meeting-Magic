var RESET = '\u001b[0m';
var colors = {
    BLACK     : '\u001b[30m',
    RED       : '\u001b[31m',
    GREEN     : '\u001b[32m',
    YELLOW    : '\u001b[33m',
    BLUE      : '\u001b[34m',
    MAGENTA   : '\u001b[35m',
    CYAN      : '\u001b[36m',
    WHITE     : '\u001b[37m'
};

var origLog = console.log;
console.log = function(str) {
    var out = str;
    if(typeof str == 'string') {
        if (str.indexOf(':') > -1) {
            var ident = str.substring(0, str.indexOf(':'));
            var rest = str.substring(str.indexOf(':'), str.length);

            switch (ident) {
                case 'DATABASE':
                case 'NEW QUERY':
                    out = colors.BLUE + ident + RESET + rest;
                    break;
                case 'CLIENT':
                case 'GET':
                    out = colors.GREEN + ident + RESET + rest;
                    break;
                case 'POST':
                    out = colors.YELLOW + ident + RESET + rest;
                    break;
				case 'SERVER':
					out = colors.BLUE + ident + RESET + rest;
					break;
				case 'GOOGLE MAPS/DISTANCE-MATRIX':
				case 'GOOGLE PLACES API':
					out = colors.BLUE + ident + RESET + rest;
					break;
				default:
					out = colors.BLUE + ident + RESET + rest;
					break;
            }
        }
    }
    origLog(out);
}
var origErr = console.error;
console.error = function(str) {
    origErr(colors.RED + str + RESET);
}
console.warning = function(str) {
	console.log(colors.YELLOW + str + RESET);
}
