import React, { Component } from 'react';
import styled from 'styled-components';
import Home from './Home';
import LoginCard from './LoginCard';
import Firebase from '../databases/firestore';

const firestore = Firebase.firestore();

const MainContentContainer = styled.div``;

// eslint-disable-next-line no-unused-vars
function sendPathToFirebase(path) {
  const gameRef = firestore.collection('game_id');
  gameRef.add({ path }).then(() => console.log('all cool'));
}

function fetchData() {
  firestore.collection('game_id').get().then((querySnapshot) => {
    querySnapshot.forEach((doc) => {
      console.log(`document ID: ${doc.id}`);
      console.log('==============DATA================');
      console.log(doc.data());
      console.log('==================================');
    });
  });
}

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setupLoginListener();
  }

  setupLoginListener() {
    console.log('listening');
    Firebase.auth().onAuthStateChanged((user) => {
      console.log('here', user);
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: undefined });
      }
    });
  }

  render() {
    return (
      <MainContentContainer>
        { this.state.user ? <Home user={this.state.user} /> : <LoginCard /> }
        <button onClick={fetchData}> fetch data </button>
      </MainContentContainer>
    );
  }
}

export default MainContent;
