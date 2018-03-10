import React, { Component } from 'react';
import styled from 'styled-components';

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
      strokes: [],
      canvas: {
        width: 500,
        height: 500,
      },
    };

    this.sendPathToFirebase = props.sendPathToFirebase;

    this.captureMouseMove = this.captureMouseMove.bind(this);
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

  mouseDown(e) {
    this.setState(prevState => ({ strokes: [...prevState.strokes, []] }));
    e.target.addEventListener('mousemove', this.captureMouseMove, true);
  }

  mouseUp(e) {
    e.target.removeEventListener('mousemove', this.captureMouseMove, true);
    this.sendPathToFirebase(this.state.strokes[this.state.strokes.length - 1]);
  }

  render() {
    return (
      <BoardContainer>
        <Canvas
          onMouseDown={this.mouseDown}
          onMouseUp={this.mouseUp}
          width={this.state.canvas.width}
          height={this.state.canvas.height}
        />
      </BoardContainer>
    );
  }
}

export default Board;
