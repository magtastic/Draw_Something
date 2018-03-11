const functions = require('firebase-functions');
const algoliasearch = require('algoliasearch');

const client = algoliasearch('BA488JXJYI', '2f4ad867a6c9cc985ab4e4f40086d9c4');
const index = client.initIndex('Users');

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
