//
// 10.28.19
// Vector Helper Functions
//

/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Vector addition for any number of vectors of any dimension
function addVectors() {
    let vector = [];
    for (var vec of arguments) {
        for (var elem = 0; elem < vec.length; elem++) {
            if (isNaN(vector[elem])) {
                vector[elem] = vec[elem];
            } else {
                vector[elem] += vec[elem];
            }
        }
    }
    return vector;
}

// Vector subtraction for any number of vectors of any dimension
function subVectors() {
    let vector = [];
    for (var vec of arguments) {
        for (var elem = 0; elem < vec.length; elem++) {
            if (isNaN(vector[elem])) {
                vector[elem] = vec[elem];
            } else {
                vector[elem] -= vec[elem];
            }
        }
    }
    return vector;
}

// Scalar dot-product for two vectors of any dimension
function dotVectors(vec1, vec2) {
    let dot = 0;
    for (var elem = 0; elem < vec1.length; elem++) {
        dot += vec1[elem] * vec2[elem];
    }
    return dot;
}

// Vector cross-product two 3-dimensional vectors
function crossVectors(vec1, vec2) {
    let vector = [];
        a = vec1;
        b = vec2;
    vector[0] = a[1] * b[2] - a[2] * b[1];
    vector[1] = a[2] * b[0] - a[0] * b[2];
    vector[2] = a[0] * b[1] - a[1] * b[0];
    return vector;
}

function getMagnitude(vec) {
    let magnitude = 0;
    for (var elem of vec) {
        magnitude += elem ** 2;
    }
    magnitude = Math.sqrt(magnitude);
    return magnitude;
}

export {addVectors, subVectors, dotVectors, crossVectors, getMagnitude};