const crypto = require("crypto");
const data_crypto = {
    alg : "aes256",
    secret : "chaves",
    type: "hex"
};

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
    
    const cipher = crypto.createCipher(data_crypto.alg, data_crypto.secret);
    cipher.update(password);
    return cipher.final(data_crypto.type);
};


function decrypt(password) {
    const decipher = crypto.createDecipher(data_crypto.alg, data_crypto.secret);
    decipher.update(password, data_crypto.type);
    return decipher.final();
};

exports.default = {
    verify,
    encrypt,
    decrypt
}