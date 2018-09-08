const { graphqlReq } = require('../src/utils');

const main = async () => {
  const url = 'https://localhost:3000/movies/graphql';
  const query = `{
    movies {
      title
    }
  }`;

  const res = await graphqlReq(url, { query });

  console.log('~~~ res', JSON.stringify(res, null, 2));
};

main();
