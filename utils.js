exports.exists = function(array, funktion) {
    var i = array.length;
    while (i--) {
        if (funktion(array[i])) {
            return true;
        }
    }
}

exports.findFirst  = function(array, funktion) {
    var i = array.length;
    while (i--) {
        if (funktion(array[i])) {
            return array[i];
        }
    }
}
