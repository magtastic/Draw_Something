import React, { Component } from 'react';
import styled from 'styled-components';
import Home from './homeComponents/Home';
import LoginCard from './loginComponents/LoginCard';
import app from '../databases/firestore';

const MainContentContainer = styled.div``;

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
        { this.state.userID ? <Home userID={this.state.userID} /> : <LoginCard /> }
      </MainContentContainer>
    );
  }
}

export default MainContent;
