import React, { Component } from 'react';
import styled from 'styled-components';
import UserProfile from './UserProfile';
import algolia from '../../databases/algolia';

const UserSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/* eslint-disable react/prefer-stateless-function */
class UserSearch extends Component {
  constructor(props) {
    super(props);
    this.state = {
      users: [],
      clickHandler: props.userClicked,
    };
  }

  searchAlgoliaUsers(e) {
    if (e.target.value) {
      algolia.search({
        query: e.target.value,
        hitsPerPage: 3,
      }, (err, content) => {
        if (err) throw err;
        if (content.hits) {
          // TODO: filter out self.
          this.setState({ users: content.hits });
        }
      });
    } else {
      this.setState({ users: [] });
    }
  }

  render() {
    return (
      <UserSearchContainer>
        <input type="text" onChange={this.searchAlgoliaUsers.bind(this)} />
        {
          // TODO: Add click handler to add
          // to lobby, this means generic click handler in User Profile
          this.state.users.map(user =>
            (<UserProfile
              key={user.objectID}
              userID={user.objectID}
              clickHandler={this.state.clickHandler}
            />))
        }
      </UserSearchContainer>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default UserSearch;
