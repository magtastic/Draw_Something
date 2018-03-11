import React, { Component } from 'react';
import styled from 'styled-components';

const ProfilePictureWrapper = styled.div`
  height: ${props => props.size};
  width: auto;
`;

const ProfilePicture = styled.img`
  height: 100%;
  border-radius: 50%;
`;

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = props;
  }

  componentWillReceiveProps(props) {
    this.setState(props);
  }

  render() {
    return (
      <ProfilePictureWrapper size={this.state.size}>
        <ProfilePicture src={this.state.photoURL} />
      </ProfilePictureWrapper>
    );
  }
}

export default Profile;
