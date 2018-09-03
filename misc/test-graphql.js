const { req } = require('../src/utils');

const graphqlRequest = async (url, document) => {
  const data = {
    query: document
  };
  console.log('~~~ data', data);
  const opts = {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-Type': 'application/json'
    }
  };

  const res = await req(url, opts);

  console.log('~~~ graphql res', res);

  return res;
};

const main = async () => {
  const url = 'https://localhost:3000/graphql';
  const document = `{
    getMovie(title: "Star Wars: Episode IV - A New Hope"){
      title
      format
      length
      releaseYear
      rating
    }
  }`;

  await graphqlRequest(url, document);
};

main();
