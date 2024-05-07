const dotenv=require('dotenv');
dotenv.config({path:'config.env'});


const    firebaseConfig={
        apiKey: process.env.apiKey,
        authDomain: process.env.authDomain,
        projectId: process.env.projectId,
        storageBucket:process.env.storageBucket,
        messagingSenderId:process.env.messagingSenderId,
        appId:process.env.appId,
        measurementId: process.env.measurementId
    }
module.exports=firebaseConfig;