let app,db,database_id,uid;

document.addEventListener('DOMContentLoaded',async _  => {
    app = await firebase.app();
    db = await firebase.firestore();
    firebase.auth().onAuthStateChanged(user => {
        uid = user.uid;
    });
});

createNewDatabaseEntry = (json=null) => {
    if (uid == null) {
        // try again in 0.5 seconds
        setTimeout(_ => createNewDatabaseEntry(json),500);
        return;
    }
    database_id = json.id;
    saveToDatabase(json);
    db.collection('scores').doc(uid).set({
        id: uid,
    }, { merge:true });
}

openDatabaseEntry = (id) => {
    database_id = id;
}

saveToDatabase = (json) => {
    if (uid && json) {
        db.collection('scores').doc(uid).collection('scores').doc(database_id).set(json)
        .then(_ => {
            console.log('Saved');
        })
        .catch(err => console.log(err));
    }
}

retrieveFromDatabase = async _ => {
    return new Promise((res,rej) => {
        db.collection('scores').doc(uid).collection('scores').doc(database_id).get()
        .then(data => {
            const score = data.data();
            res(score);
        })
        .catch(err => {
            console.log(err);
            rej(err);
        });
    });
}