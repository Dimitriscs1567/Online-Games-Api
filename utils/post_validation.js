exports.checkBody = (body, keys) => {
    let ok = true;

    keys.forEach(key => {
        if(!body.keys.includes(key)){
            ok = false;
        }
    });

    return ok;
}