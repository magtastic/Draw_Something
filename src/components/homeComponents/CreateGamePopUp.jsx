import React, { Component } from 'react';
import Popup from 'reactjs-popup';
// import styled from 'styled-components';

/* eslint-disable react/prefer-stateless-function */
class StartGamePopUp extends Component {
  render() {
    return (
      <Popup
        trigger={<button> Create Game </button>}
        position="bottom center"
        modal
        arrow={false}
      >
        {close => (
          <div>
            Content here
            <button className="close" onClick={close}>
            close
            </button>
          </div>
      )}
      </Popup>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default StartGamePopUp;
