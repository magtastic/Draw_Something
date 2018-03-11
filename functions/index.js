const functions = require('firebase-functions');
const algoliaSearch = require('algoliasearch');

const algoliaClient = algoliaSearch('BA488JXJYI', '2f4ad867a6c9cc985ab4e4f40086d9c4');
const algoliaIndex = algoliaClient.initIndex('Users');
exports.createAlgoliaUser = functions.firestore
  .document('users/{userID}')
  .onCreate((event) => {
    const firebaseUser = event.data.data();
    const { userID } = event.params;

    const algoliaUser = {
      user_name: firebaseUser.user_name,
      email: firebaseUser.email,
    };

    return new Promise((resolve, reject) => {
      algoliaIndex.addObject(algoliaUser, userID, (err, content) => {
        if (err) {
          reject(err);
        } else {
          resolve(`${firebaseUser.user_name} added to algolia, userID: ${userID}`);
        }
      });
    });
  });
