import React, { Component } from 'react';
import styled from 'styled-components';

const CTAButton = styled.button`
`;

/* eslint-disable react/prefer-stateless-function */
class StartGamePopUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      text: props.text,
    };
  }

  render() {
    return (
      <CTAButton>
        {this.state.text}
      </CTAButton>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default StartGamePopUp;
