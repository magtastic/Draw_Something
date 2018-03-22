import React, { Component } from 'react';
import algoliasearch from 'algoliasearch';
import styled from 'styled-components';
import UserProfile from './UserProfile';

const client = algoliasearch('BA488JXJYI', '2719126aa82a3ef83207900d41725390');
const index = client.initIndex('Users');

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
    };
  }

  searchAlgoliaUsers(e) {
    index.search({
      query: e.target.value,
      hitsPerPage: 3,
      }, (err, content) => {
        if (err) throw err;
        console.log(content.hits);
        if (content.hits) {
          this.setState({ users: content.hits });
        }
      }
    );
  }

  render() {
    return (
      <UserSearchContainer>
        <input type="text" onChange={this.searchAlgoliaUsers.bind(this)} />
        {
          // TODO: Add click handler to add to lobby, this means generic click handler in User Profile
          this.state.users.map(user => <UserProfile key={user.objectID} userID={user.objectID} />)
        }
      </UserSearchContainer>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default UserSearch;
