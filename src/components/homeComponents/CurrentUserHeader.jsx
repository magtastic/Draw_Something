import React, { Component } from 'react';
import styled from 'styled-components';
import app from '../../databases/firestore';
import UserProfilePicture from './UserProfilePicture';

const UserHeader = styled.div`
  width: 100%;
  height: 50px;
  display: flex;
  background: blue;
`;

const UserHeaderContainer = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: coloumn;
  justify-content: space-around;
`;

function signOut() {
  app.auth()
    .signOut()
    .then(() => {
      console.log('sign out succ.');
    })
    .catch((err) => {
      console.log(err);
    });
}

class CurrentUserHeader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      profile: undefined,
    };
    this.listenToUserInfo();
  }

  listenToUserInfo() {
    const { uid } = app.auth().currentUser;
    console.log(uid);
    app.firestore()
      .collection('users')
      .doc(uid)
      .onSnapshot((snap) => {
        const profile = snap.data();
        console.log(profile);
        this.setState({ profile });
      }, (err) => {
        console.log(err);
      });
  }

  render() {
    return (
      <UserHeader>
        {
          this.state.profile ?
            <UserHeaderContainer>
              <UserProfilePicture photoURL={this.state.profile.profile_picture_url} size="100%" />
              <h2>{this.state.profile.user_name}</h2>
              <button onClick={signOut}> Logout </button>
            </UserHeaderContainer>
            :
            null
        }
      </UserHeader>
    );
  }
}

export default CurrentUserHeader;
