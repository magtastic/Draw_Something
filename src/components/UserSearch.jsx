import React, { Component } from 'react';
import { InstantSearch, SearchBox, Hits } from 'react-instantsearch/dom';
import styled from 'styled-components';
import UserProfile from './UserProfile';

function Product({ hit }) {
  return <UserProfile userID={hit.objectID} />;
}

function Search() {
  return (
    <div>
      <Hits hitComponent={Product} />
    </div>
  );
}

const UserSearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

/* eslint-disable react/prefer-stateless-function */
class UserSearch extends Component {
  render() {
    return (
      <UserSearchContainer>
        <InstantSearch
          appId="BA488JXJYI"
          apiKey="2719126aa82a3ef83207900d41725390"
          indexName="Users"
        >
          <SearchBox />
          <Search />
        </InstantSearch>
      </UserSearchContainer>
    );
  }
}
/* eslint-enable react/prefer-stateless-function */

export default UserSearch;
