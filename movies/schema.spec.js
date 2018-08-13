const { getToken, getURL } = require('./test-utils');
const { req, RequestError } = require('./utils');

require('./schema');

it('/schema - should get the movies table schema', async () => {
  const token = await getToken();
  const url = getURL('/movies/schema');
  const opts = {
    headers: {
      Authorization: token
    }
  };
  const res = await req(url, opts);

  expect(res.table).toBeDefined();
  expect(res.table.tableName).toMatch('movies');
});
