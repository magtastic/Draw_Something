import React, { Component } from 'react';
import styled from 'styled-components';
import Home from './homeComponents/Home';
import Login from './loginComponents/Login';
import app from '../databases/firestore';

const MainContentContainer = styled.div`
  height: 100%;
`;

class MainContent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setupLoginListener();
  }

  setupLoginListener() {
    app.auth().onAuthStateChanged((user) => {
      if (user) {
        this.setState({ userID: user.uid });
      } else {
        this.setState({ userID: undefined });
      }
    });
  }

  render() {
    return (
      <MainContentContainer>
        { this.state.userID ? <Home userID={this.state.userID} /> : <Login /> }
      </MainContentContainer>
    );
  }
}

export default MainContent;
