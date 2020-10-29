import {auth} from 'firebase-admin';

const createUser = async(data: any) => {
    if(await auth().getUserByEmail(data.email).catch(error => error)){
        return null;
    }    
    
}
