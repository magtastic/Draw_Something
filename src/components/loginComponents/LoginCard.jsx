import React, { Component } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import app from '../../databases/firestore';

const LoginContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

function loginUser() {
  const provider = new firebase.auth.GoogleAuthProvider();
  app.auth()
    .signInWithPopup(provider)
    .then((result) => {
      const { user } = result;
      return app.firestore().collection('users').doc(user.uid).set({
        user_name: user.displayName,
        email: user.email,
        profile_picture_url: user.photoURL,
        provider: result.additionalUserInfo.providerId,
        provider_profile: result.additionalUserInfo.profile,
        metadata: {
          creation_time: user.metadata.creationTime,
          last_sign_in_time: user.metadata.lastSignInTime,
        },
      });
    })
    .catch(err => console.log(err));
}

/* eslint-disable react/prefer-stateless-function */
class LoginCard extends Component {
  render() {
    return (
      <LoginContainer>
        <h1>
          Welcome
        </h1>
        <h2>
          Please sign in
        </h2>
        <button onClick={loginUser}> Google Sign In </button>
      </LoginContainer>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default LoginCard;
