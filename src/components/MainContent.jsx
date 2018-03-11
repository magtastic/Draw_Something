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
    console.log('listening');
    app.auth().onAuthStateChanged((user) => {
      console.log('here', user);
      if (user) {
        this.setState({ user });
      } else {
        this.setState({ user: undefined });
      }
    });
  }

  render() {
    return (
      <MainContentContainer>
        { this.state.user ? <Home userID={this.state.user.uid} /> : <LoginCard /> }
      </MainContentContainer>
    );
  }
}

export default MainContent;
