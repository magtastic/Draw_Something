import React, { Component } from 'react';
import styled from 'styled-components';
import UserProfile from './UserProfile';
import app from '../../databases/firestore';

const firestore = app.firestore();

const BoardContainer = styled.div`
  display: flex;
`;

const Canvas = styled.canvas`
  background: ${(props) => {
    console.log(props);
    return props.myTurn ? 'white' : 'gray';
  }
};
  border: solid black 1px;
`;

function getMousePos(e, canvas) {
  const { left, top } = canvas.getBoundingClientRect();
  return {
    x: e.clientX - left,
    y: e.clientY - top,
  };
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: props.userID,
      gameID: props.gameID,
      word: props.word,
      color: undefined,
      myTurn: false,
      myIndex: undefined,
      strokes: [],
      playerColors: [],
      canvas: {
        width: 500,
        height: 500,
      },
    };

    this.captureMouseMove = this.captureMouseMove.bind(this);
    this.listenToCurrentUserTurn();
    this.getUsers();
  }

  getUsers() {
    firestore
      .collection('games')
      .doc(this.state.gameID)
      .collection('players_colors')
      .onSnapshot((snaps) => {
        snaps.docs.forEach((doc) => {
          const data = doc.data();
          if (doc.id === this.state.userID) {
            this.setState({
              playerColors: this.state.playerColors.concat({ id: doc.id, color: data.color }),
              color: data.color,
              myIndex: data.index,
            });
          } else {
            this.setState({
              playerColors: this.state.playerColors.concat({ id: doc.id, color: data.color }),
            });
          }
        });
      }, (err) => {
        console.log(`error in listening for new users ${err}`);
      });
  }

  listenToCurrentUserTurn() {
    firestore
      .collection('games')
      .doc(this.state.gameID)
      .onSnapshot((doc) => {
        if (this.state.userID === doc.data().current_players_turn) {
          this.setState({ myTurn: true });
        }
      });
  }

  drawLineBetween(prevPos, currPos, canvas) {
    const ctx = canvas.getContext('2d');

    ctx.beginPath();

    ctx.strokeStyle = this.state.color;

    ctx.moveTo(prevPos.x, prevPos.y);
    ctx.lineTo(currPos.x, currPos.y);
    ctx.lineWidth = 3;

    ctx.stroke();
  }

  mouseDown(e) {
    if (this.state.myTurn) {
      this.setState(prevState => ({ strokes: [...prevState.strokes, []] }));
      e.target.addEventListener('mousemove', this.captureMouseMove, true);
    }
  }

  mouseUp(e) {
    this.nextPlayersTurn();
    this.setState({
      myTurn: false,
    });
    e.target.removeEventListener('mousemove', this.captureMouseMove, true);
    this.sendPathToFirebase(this.state.strokes[this.state.strokes.length - 1]);
  }

  nextPlayersTurn() {
    let nextUsersIndex = this.state.myIndex + 1;
    if ((this.state.playerColors.length - 1) === this.state.myIndex) {
      nextUsersIndex = 0;
    }
    this.state.playerColors.forEach((player) => {
      if (player.index === nextUsersIndex) {
        firestore
          .collection('games')
          .doc(this.state.gameID)
          .set({
            current_players_turn: player.id,
          });
      }
    });
  }

  captureMouseMove(e) {
    const { strokes } = this.state;
    const canvas = e.target;
    const pos = getMousePos(e, canvas);
    strokes[strokes.length - 1].push(pos);

    const currPath = strokes[strokes.length - 1];
    if (currPath.length > 1) {
      this.drawLineBetween(currPath[currPath.length - 2], currPath[currPath.length - 1], canvas);
    }

    this.setState({ strokes });
  }

  sendPathToFirebase(path) {
    const pathRef = firestore.collection('games').doc(this.state.gameID).collection('paths');
    pathRef.add({ path }).then(() => console.log('all cool'));
  }

  render() {
    return (
      <BoardContainer>
        <h1>{this.state.word}</h1>
        <Canvas
          myTurn={this.state.myTurn}
          onMouseDown={this.mouseDown.bind(this)}
          onMouseUp={this.mouseUp.bind(this)}
          width={this.state.canvas.width}
          height={this.state.canvas.height}
        />
        {
          this.state.playerColors
            .map(playerColor => <UserProfile userID={playerColor.id} />)
        }
      </BoardContainer>
    );
  }
}

export default Board;
