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

exports.default = {
    verify
}