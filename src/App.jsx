import React, { Component } from 'react';
import styled from 'styled-components';
import MainContent from './components/MainContent';

const AppConatiner = styled.div`
  height: 100%;
  width: 100%;
`;

/* eslint-disable react/prefer-stateless-function */

class App extends Component {
  render() {
    return (
      <AppConatiner className="App">
        <MainContent />
      </AppConatiner>
    );
  }
}

/* eslint-enable react/prefer-stateless-function */

export default App;
