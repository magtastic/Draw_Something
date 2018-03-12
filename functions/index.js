const Colors = require('./colors');
const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoliasearch = require('algoliasearch');

admin.initializeApp(functions.config().firebase);

const client = algoliasearch('BA488JXJYI', '2f4ad867a6c9cc985ab4e4f40086d9c4');
const index = client.initIndex('Users');

// TODO: simplify this funciton
exports.giveUsersColor = functions.firestore
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
          const players = [];
          snaps.docs.forEach((doc) => {
            const player = doc.data();
            players.push(player);
          });
          return players;
        })
        .then((players) => {
          const colors = Colors.getColors(players.length);
          const playersColors = players.map((player, playerIndex) => {
            const color = colors[playerIndex];
            return { player, color };
          });
          return playersColors;
        })
        .then((playersWithColros) => {
          const promises = [];
          playersWithColros.forEach((playerWithColor) => {
            promises.push(admin.firestore()
              .collection('games')
              .doc(gameID)
              .collection('players_colors')
              .add({ playerWithColor }));
          });
          return Promise.all(promises);
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
