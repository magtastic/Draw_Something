import React, { Component } from 'react';
import styled from 'styled-components';
import app from '../../databases/firestore';
import UserProfilePicture from './UserProfilePicture';

/* eslint-disable no-confusing-arrow */
// See https://github.com/react-boilerplate/react-boilerplate/issues/1237
const UserProfileContainer = styled.div`
  border: ${props => props.myTurn ? 'solid black 1px' : 'none'}
`;
/* eslint-disable no-confusing-arrow */

const ColorDot = styled.span`
  height: 25px;
  width: 25px;
  background-color: ${props => props.color};
  border-radius: 50%;
  display: inline-block;
`;

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: props.userID,
      color: props.color,
      myTurn: props.myTurn,
      profile: undefined,
    };
    this.listenToUserInfo();
  }

  listenToUserInfo() {
    app.firestore()
      .collection('users')
      .doc(this.state.userID)
      .onSnapshot((snap) => {
        const profile = snap.data();
        this.setState({ profile });
      }, (err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <UserProfileContainer myTurn={this.state.myTurn}>
        <div>
          {
            this.state.profile ?
              <div>
                <UserProfilePicture photoURL={this.state.profile.profile_picture_url} size="100px" />
                {this.state.profile.user_name}
                {
                  this.state.color ?
                    <ColorDot color={this.state.color} />
                    : null
                }
              </div>
            :
            null
          }
        </div>
      </UserProfileContainer>
    );
  }
}

export default UserProfile;
