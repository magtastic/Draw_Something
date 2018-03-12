import React, { Component } from 'react';
import styled from 'styled-components';
import app from '../../databases/firestore';

const firestore = app.firestore();

const BoardContainer = styled.div`
  display: flex;
`;

const Canvas = styled.canvas`
  border: solid black 1px;
`;

function getMousePos(e, canvas) {
  const { left, top } = canvas.getBoundingClientRect();
  return {
    x: e.clientX - left,
    y: e.clientY - top,
  };
}

function drawLineBetween(prevPos, currPos, canvas) {
  const ctx = canvas.getContext('2d');

  ctx.beginPath();

  ctx.strokeStyle = 'black';

  ctx.moveTo(prevPos.x, prevPos.y);
  ctx.lineTo(currPos.x, currPos.y);
  ctx.lineWidth = 3;

  ctx.stroke();
}

class Board extends Component {
  constructor(props) {
    super(props);
    this.state = {
      gameID: props.gameID,
      strokes: [],
      players: [],
      canvas: {
        width: 500,
        height: 500,
      },
    };

    this.sendPathToFirebase = props.sendPathToFirebase;
    this.captureMouseMove = this.captureMouseMove.bind(this);
    this.getUsers();
  }

  getUsers() {
    firestore
      .collection(`games/${this.state.gameID}/players`)
      .get()
      .then((snaps) => {
        snaps.docs.forEach((snap) => {
          const newPlayer = snap.doc.data();
          this.setState({ players: this.state.players.concat(newPlayer) });
        });
      })
      .catch((err) => {
        console.log(`error in listening for new users ${err}`);
      });
  }

  mouseDown(e) {
    this.setState(prevState => ({ strokes: [...prevState.strokes, []] }));
    e.target.addEventListener('mousemove', this.captureMouseMove, true);
  }

  mouseUp(e) {
    e.target.removeEventListener('mousemove', this.captureMouseMove, true);
    this.sendPathToFirebase(this.state.strokes[this.state.strokes.length - 1]);
  }

  captureMouseMove(e) {
    const { strokes } = this.state;
    const canvas = e.target;
    const pos = getMousePos(e, canvas);
    strokes[strokes.length - 1].push(pos);

    const currPath = strokes[strokes.length - 1];
    if (currPath.length > 1) {
      drawLineBetween(currPath[currPath.length - 2], currPath[currPath.length - 1], canvas);
    }

    this.setState({ strokes });
  }

  sendPathToFirebase(path) {
    const pathRef = firestore.collection('game').doc(this.state.gameID).collection('paths');
    pathRef.add({ path }).then(() => console.log('all cool'));
  }

  render() {
    return (
      <BoardContainer>
        <Canvas
          onMouseDown={this.mouseDown.bind(this)}
          onMouseUp={this.mouseUp.bind(this)}
          width={this.state.canvas.width}
          height={this.state.canvas.height}
        />
        { this.state.players.map(player => <h1 key={player.userID}>{player.userID}</h1>) }
      </BoardContainer>
    );
  }
}

export default Board;
