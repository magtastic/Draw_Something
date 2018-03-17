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
    };
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
    console.log(this.state);
  }

  render() {
    return (
      <Popup
        trigger={<CreateGameButton> Create Game </CreateGameButton>}
        position="bottom center"
        modal
        arrow={false}
      >
        {close => (
          <div>
            Content here
            <input type="text" value={this.state.gameName} onChange={this.handleGameNameInput.bind(this)} />
            <button className="close" onClick={close}>
            close
            </button>
          </div>
      )}
      </Popup>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default StartGamePopUp;
