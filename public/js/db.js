let app,db,database_id;

document.addEventListener('DOMContentLoaded',_ => {
    app = firebase.app();
    db = firebase.firestore();
});

createNewDatabaseEntry = (json=null) => {
    const rand = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let id = '';
    for (let i=0;i<20;i++) id+=rand.charAt(Math.floor(Math.random()*rand.length));
    console.log(id);
    database_id = id;
    db.collection('scores').doc(database_id).set(json);
}

openDatabaseEntry = (id) => {
    database_id = id;
}

saveToDatabase = (json) => {
    db.collection('scores').doc(database_id).set(json)
    .then(_ => {
        console.log('Saved');
    });
}

retrieveFromDatabase = async _ => {
    return new Promise((res,rej) => {
        db.collection('scores').doc(database_id).get()
        .then(data => {
            const score = data.data();
            res(score);
        });
    });
}