import { IUser } from "../declarations/model_declarations";
import { getAllowedUsersEmails, getAllUsers } from "./database";

export const checkBody = (body: object, keys: string[]) => {
    let ok = true;

    keys.forEach(key => {
        if(!Object.keys(body).includes(key)){
            ok = false;
        }
    });

    return ok;
}

export const checkNewUser = async (newUser: IUser) => {
    try {
        const allUsers = await getAllUsers();
        const allowedEmails = await getAllowedUsersEmails();
        const existingEmails = allUsers.map(user => user.email);
        const existingUsernames = allUsers.map(user => user.username);
        
        if(!allowedEmails.includes(newUser.email) || existingEmails.includes(newUser.email) 
                || existingUsernames.includes(newUser.username)){
                    
            return false;
        }

        return true;
    } catch (error) {
        return false;
    }
}