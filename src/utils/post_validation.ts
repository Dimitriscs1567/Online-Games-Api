export const checkBody = (body: object, keys: string[]) => {
    let ok = true;

    keys.forEach(key => {
        if(!Object.keys(body).includes(key)){
            ok = false;
        }
    });

    return ok;
}