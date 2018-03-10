import React, { Component } from 'react';
import styled from 'styled-components';
import Board from './Board';
import app from '../databases/firestore';

const firestore = app.firestore();

const HomeContainer = styled.div`
  display: flex;
`;

function signOut() {
  app.auth()
    .signOut()
    .then(() => {
      console.log('sign out succ.');
    })
    .catch((err) => {
      console.log(err);
    });
}

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    };
  }

  sendPathToFirebase(path) {
    const pathRef = firestore.collection('game').doc(this.state.gameID).collection('paths');
    pathRef.add({ path }).then(() => console.log('all cool'));
  }

  startGame() {
    const { uid } = this.state.user;
    app.firestore().collection('game')
      .add({ creator: uid })
      .then((ref) => {
        this.setState({ gameID: ref.id });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <HomeContainer>
        <h1>
          Welcome home {this.state.user.displayName}
        </h1>
        {
          this.state.gameID ?
            <Board sendPathToFirebase={this.sendPathToFirebase.bind(this)} />
            : null
        }
        <button onClick={this.startGame.bind(this)}> Start a game </button>
        <button onClick={signOut}> Logout </button>
      </HomeContainer>
    );
  }
}

export default Home;
