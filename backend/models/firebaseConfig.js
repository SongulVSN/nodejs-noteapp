const admin = require("firebase-admin");

const serviceAccount =  require("./firebase-config.json");


admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://note-app-4cee4-default-rtdb.firebaseio.com/"
});

const db = admin.database();

module.exports = db;