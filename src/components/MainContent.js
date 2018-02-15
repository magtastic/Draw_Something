import React, { Component } from 'react';
import styled from 'styled-components';
import Board from './Board';

const MainContentContainer = styled.div``;

class MainContent extends Component {

  sendPathToFirebase(path) {
    console.log(`sending ${path} to firebase...`);
  }

  render() {
    return (
      <MainContentContainer>
        <p>
          this is the main content
        </p>
        <Board sendPathToFirebase={this.sendPathToFirebase}/>
      </MainContentContainer>
    );
  }
}

export default MainContent;