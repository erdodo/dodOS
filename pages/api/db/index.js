import { initializeApp, cert,getApps } from 'firebase-admin/app';
import { getFirestore,Filter } from 'firebase-admin/firestore';

const firebaseConfig = {
    "type": "service_account",
    "project_id": process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    "private_key_id": process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY_ID,
    "private_key": process.env.NEXT_PUBLIC_FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
    "client_email": process.env.NEXT_PUBLIC_FIREBASE_CLIENT_EMAIL,
    "client_id": process.env.NEXT_PUBLIC_FIREBASE_CLIENT_ID,
    "auth_uri": process.env.NEXT_PUBLIC_FIREBASE_AUTH_URI,
    "token_uri": process.env.NEXT_PUBLIC_FIREBASE_TOKEN_URI,
    "auth_provider_x509_cert_url": process.env.NEXT_PUBLIC_FIREBASE_AUTH_PROVIDER_X509_CERT_URL,
    "client_x509_cert_url": process.env.NEXT_PUBLIC_FIREBASE_CLIENT_X509_CERT_URL,
    "universe_domain": "googleapis.com"
}


getApps().length===0 ? initializeApp({
    credential: cert(firebaseConfig)
}) : null;

/**
 * < less than
 * <= less than or equal to
 * == equal to
 * > greater than
 * >= greater than or equal to
 * != not equal to
 * array-contains
 * array-contains-any
 * in
 * not-in
 */

export const get_data = async(collection,filters,orFilters,order,orderDesc = false,limit)=>{
    const db = getFirestore();
    let docRef = db.collection(collection)



    if(filters){
        Object.values(filters).map((val)=>{
            docRef = docRef.where(val.key,val.if,val.value)
        })
    }

    if(orFilters){
        Object.values(orFilters).map((val)=>{
            const orFilterArray = []
            Object.values(val).map((orVal)=>{
                    orFilterArray.push(Filter.where(orVal.key,orVal.if,orVal.value))
            })
            console.log(orFilterArray)
            docRef = docRef.where(Filter.or(...orFilterArray))
        })
    }


    if(order){
        docRef = docRef.orderBy(order,orderDesc ? "desc" : "asc")
    }else{
        //docRef=docRef.where("isDeleted","==",false)
    }
    docRef = limit ? docRef.limit(parseInt(limit)) : docRef
    return await docRef.get().then((querySnapshot) => {
        const data = []
        querySnapshot.forEach(doc => {
            data.push({id : doc.id,...doc})
        });
        return data
    }).catch(error => {
        console.log(error)
        return []
    });
}


export const set_data = async(collection,document,data)=>{
    const db = getFirestore();
    const docRef = db.collection(collection).doc(document);
    return await docRef.set(data,{merge:true})
}




