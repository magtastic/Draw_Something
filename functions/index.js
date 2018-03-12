const colors = require('./colors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

admin.initializeApp(functions.config().firebase);

const client = algoliasearch('BA488JXJYI', '2f4ad867a6c9cc985ab4e4f40086d9c4');
const index = client.initIndex('Users');

exports.setUpGame = functions.firestore
  .document('games/{gameID}')
  .onUpdate((event) => {
    const newValue = event.data.data();
    const previousValue = event.data.previous.data();
    const { gameID } = event.params;
    if (newValue.game_started && !previousValue.game_started) {
      return admin.firestore()
        .collection('games')
        .doc(gameID)
        .collection('players')
        .get()
        .then((snaps) => {
          const myColors = colors.getColors(snaps.size);
          const promises = [];
          // eslint-disable-next-line camelcase
          const current_players_turn = snaps.docs[0].id;

          snaps.docs.forEach((doc, i) => {
            const player = doc.id;
            const color = myColors[i];

            promises.push(admin.firestore()
              .collection('games')
              .doc(gameID)
              .collection('players_colors')
              .doc(player)
              .set({ color, index: i }));
          });

          // eslint-disable-next-line promise/no-nesting
          return Promise.all(promises)
            .then(() => admin.firestore()
              .collection('games')
              .doc(gameID)
              .set({
                current_players_turn,
                game_ready: true,
              }, { merge: true }));
        });
    }
    return 'no need to generate colors';
  });

exports.createAlgoliaUser = functions.firestore
  .document('users/{userID}')
  .onCreate((event) => {
    const firebaseUser = event.data.data();
    const { userID } = event.params;

    const algoliaUser = {
      user_name: firebaseUser.user_name,
      email: firebaseUser.email,
      objectID: userID,
    };

    return new Promise((resolve, reject) => {
      index.addObject(algoliaUser, (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${firebaseUser.user_name} added to algolia, userID: ${userID}`);
        }
      });
    });
  });

exports.updateAlgoliaUser = functions.firestore
  .document('users/{userID}')
  .onUpdate((event) => {
    const firebaseUser = event.data.data();
    const { userID } = event.params;

    const algoliaUser = {
      user_name: firebaseUser.user_name,
      email: firebaseUser.email,
      objectID: userID,
    };

    return new Promise((resolve, reject) => {
      index.saveObject(algoliaUser, (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${firebaseUser.user_name} added to algolia, userID: ${userID}`);
        }
      });
    });
  });

exports.deleteAlgoliaUser = functions.firestore
  .document('users/{userID}')
  .onDelete((event) => {
    const { userID } = event.params;

    return new Promise((resolve, reject) => {
      index.deleteObject(userID, (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${userID} deleted form Algolia`);
        }
      });
    });
  });
