import React, { Component } from 'react';
import styled from 'styled-components';
import * as firebase from 'firebase';
import app from '../databases/firestore';

const LoginContainer = styled.div`
`;

function loginUser() {
  const provider = new firebase.auth.GoogleAuthProvider();
  app.auth()
    .signInWithPopup(provider)
    .then((result) => {
      console.log(result);
    })
    .catch(err => console.log(err));
}

/* eslint-disable react/prefer-stateless-function */
class LoginCard extends Component {
  render() {
    return (
      <LoginContainer>
        <h1>
          Hey login Man!
        </h1>
        <button onClick={loginUser}> login </button>
      </LoginContainer>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default LoginCard;
