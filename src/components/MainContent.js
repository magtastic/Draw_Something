import React, { Component } from 'react';
import styled from 'styled-components';
import Board from './Board';

const MainContentContainer = styled.div``;

class MainContent extends Component {
  render() {
    return (
      <MainContentContainer>
        <p>
          this is the main content
        </p>
        <Board/>
      </MainContentContainer>
    );
  }
}

export default MainContent;