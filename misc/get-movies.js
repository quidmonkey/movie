const {
  getOpts,
  getToken,
  getURL
} = require('./misc-utils');

const { req } = require('../src/utils');

const listMovies = async () => {
  const token = await getToken();
  const url = getURL('/movies');

  const opts = getOpts({
    headers: {
      Authorization: token
    }
  });
  const res = await req(url, opts);

  console.log('~~~ res', JSON.stringify(res, null, 2));
};
module.exports.listMovies = listMovies;

if (!module.parent) {
  listMovies();
}
