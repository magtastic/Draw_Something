import React, { Component } from 'react';
import styled from 'styled-components';
import app from '../databases/firestore';
import UserProfilePicture from './UserProfilePicture';

const UserProfileContainer = styled.div``;

class UserProfile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: props.userID,
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
      <UserProfileContainer>
        <h1>Welcome!</h1>
        <h3>
          {
            this.state.profile ?
              <div>
                <UserProfilePicture photoURL={this.state.profile.profile_picture_url} size="220px" />
                {this.state.profile.user_name}
              </div>
            :
            null
          }
        </h3>
      </UserProfileContainer>
    );
  }
}

export default UserProfile;
