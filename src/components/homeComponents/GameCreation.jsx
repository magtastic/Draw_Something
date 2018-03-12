import React, { Component } from 'react';
// import styled from 'styled-components';

class CurrentUserHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      createGame: props.createGame,
      joinGame: props.joinGame,
      gameToJoin: 'Insert Game ID',
    };
  }

  handleGameToJoinInput(e) {
    this.setState({ gameToJoin: e.target.value });
  }

  render() {
    return (
      <div>
        <button onClick={this.state.createGame}> Create a game </button>
        <input type="text" value={this.state.gameToJoin} onChange={this.handleGameToJoinInput.bind(this)} />
        <button onClick={() => this.state.joinGame(this.state.gameToJoin)}>join game</button>
      </div>
    );
  }
}

export default CurrentUserHeader;
