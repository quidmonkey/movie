const { getToken, getURL } = require('./misc-utils');
const { graphqlReq } = require('../src/utils');

const main = async () => {
  const token = await getToken();
  const url = getURL('/movies/graphql');
  const document = {
    query: `{
      movies {
        title
      }
    }`
  };
  const opts = {
    headers: {
      Authorization: token
    }
  };

  const res = await graphqlReq(url, document, opts);

  console.log('~~~ res', JSON.stringify(res, null, 2));
};

main();
