function verify(body, requiredProperties) {
    const keys = Object.keys(body);

    for (const property of requiredProperties) {
        if (!keys.includes(property)) {
            return false;
        }
    }

    for (const property of keys){
        if(!requiredProperties.includes(property)){
            return false;
        }
    }

    return true;
}

function encrypt(password) {
    const crypto = require("crypto");
    const data_crypto = {
        alg : "aes256",
        secret : "chaves",
        type: "hex"
    };
    const cipher = crypto.createCipher(data_crypto.alg, data_crypto.secret);
    cipher.update(password);
    return cipher.final(data_crypto.type);
};

exports.default = {
    verify,
    encrypt
}