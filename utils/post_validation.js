exports.checkBody = (body, keys) => {
    let ok = true;

    keys.forEach(key => {
        if(!Object.keys(body).includes(key)){
            ok = false;
        }
    });

    return ok;
}