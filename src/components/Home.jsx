import React, { Component } from 'react';
import styled from 'styled-components';
import Lobby from './Lobby';
import app from '../databases/firestore';

const firestore = app.firestore();

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
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
    app.firestore()
      .collection('game')
      .add({ creator: uid })
      .then(ref => [ref.collection('players').add({ uid }), ref])
      .then(([, gameRef]) => {
        this.setState({ gameID: gameRef.id });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  joinGame() {
    const { uid } = this.state.user;
    app.firestore()
      .collection('game')
      .doc(this.state.gameToJoin)
      .collection('players')
      .add({ uid })
      .then(() => {
        this.setState({ gameID: this.state.gameToJoin });
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleGameToJoinInput(e) {
    this.setState({ gameToJoin: e.target.value });
  }

  render() {
    return (
      <HomeContainer>
        <h1>
          Welcome home {this.state.user.displayName}
        </h1>
        {
          this.state.gameID ?
            <Lobby gameID={this.state.gameID} />
            :
            <button onClick={this.startGame.bind(this)}> Start a game </button>
        }
        <input type="text" value={this.state.gameToJoin} onChange={this.handleGameToJoinInput.bind(this)} />
        <button onClick={this.joinGame.bind(this)}>join game</button>
        <button onClick={signOut}> Logout </button>
      </HomeContainer>
    );
  }
}

export default Home;
