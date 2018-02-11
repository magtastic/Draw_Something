import React, { Component } from 'react';
import styled from 'styled-components'

const HeaderContainer = styled.div`
  display: flex;
`;
const Title = styled.h1``;

class Header extends Component {
  render() {
    return (
      <HeaderContainer>
        <Title>
          This is a tilte.
        </Title>
      </HeaderContainer>
    );
  }
}

export default Header;