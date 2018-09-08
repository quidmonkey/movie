const { req } = require('../src/utils');

const graphqlRequest = async (url, document) => {
  const data = {
    query: document
  };
  const opts = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const res = await req(url, opts);

  console.log('~~~ res', res);

  return res;
};

const main = async () => {
  const url = 'https://localhost:3000/graphql';
  const document = `{
    movies {
      title
    }
  }`;

  await graphqlRequest(url, document);
};

main();
