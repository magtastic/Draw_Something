import React, { Component } from 'react';
import Popup from 'reactjs-popup';
import styled from 'styled-components';
import app from '../../databases/firestore';
import json from './../../databases/words.json';

const firestore = app.firestore();

const CreateGameButton = styled.button`
`;

const { words } = json;

/* eslint-disable react/prefer-stateless-function */
class StartGamePopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: props.userID,
      gameName: 'Untiteled',
      userToSendInvitation: 'User name here',
    };
    /*
    create game in constuction
    and add a Lobby initialized when done.
    Remember to delete game if canceled.
    this.creatGame()
    */
  }

  createGame() {
    const { userID } = this.state;
    firestore
      .collection('games')
      .add({
        creator: userID,
        game_started: false,
        word: words[Math.floor(Math.random() * words.length)],
        game_name: this.state.gameName,
      })
      .then(ref => [ref.collection('players').doc(userID).set({ in_room: true }), ref])
      .then(([, gameRef]) => {
        this.gameCreated(gameRef.id);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  handleGameNameInput(e) {
    this.setState({ gameName: e.target.value });
  }

  handleUserToSendInvitationInput(e) {
    this.setState({ gameName: e.target.value });
  }

  addUser() {
    console.log(this.state.userToSendInvitation);
  }

  render() {
    return (
      <Popup
        trigger={<CreateGameButton> Create Game </CreateGameButton>}
        position="bottom center"
        modal
        arrow={false}
      >
        { close => (
          <div>
            <input type="text" value={this.state.userToSendInvitation} onChange={this.handleUserToSendInvitationInput.bind(this)} />
            <button className="close" onClick={this.createGame.bind(this)}> Add User </button>

            <input type="text" value={this.state.gameName} onChange={this.handleGameNameInput.bind(this)} />
            <button className="close" onClick={this.addUser.bind(this)}> Create Game </button>

            <button className="close" onClick={close}> Cancel </button>
          </div>
      )}
      </Popup>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default StartGamePopUp;
