import React, { Component } from 'react';
import styled from 'styled-components';

const HomeContainer = styled.div`
  display: flex;
`;

class Home extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    };
    console.log('--------------------------');
    console.log(this.state);
    console.log('--------------------------');
  }

  render() {
    return (
      <HomeContainer>
        <h1>
          Welcome home {this.state.user.displayName}
        </h1>
      </HomeContainer>
    );
  }
}

export default Home;
