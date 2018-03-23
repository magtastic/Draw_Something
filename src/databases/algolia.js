import algoliasearch from 'algoliasearch';

const client = algoliasearch('BA488JXJYI', '2719126aa82a3ef83207900d41725390');
export default client.initIndex('Users');
