const { merge, req } = require('./movies/utils');
const {
  movies,
  createMovie,
  getMovieModel,
  getToken,
  getURL,
  getUser
} = require('./integration-test-utils');

it('/user - should create a user', async () => {
  const { res } = await getUser();

  const expected = 'User created successfully.';
  const actual = res;

  expect(actual).toBe(expected);
});

it('/token - should fetch a token', async () => {
  const res = await getToken();

  const expected = 'string';
  const actual = typeof res;

  expect(actual).toBe(expected);
});

it('/create - should create a movie', async () => {
  const movieModel = getMovieModel();
  const { movie } = await createMovie(movieModel);

  const expected = Object.keys(movieModel).concat('id', 'createdAt', 'updatedAt').sort();
  const actual = Object.keys(movie).sort();

  expect(actual).toEqual(expected);
});

it('/delete - should delete a movie', async () => {
  const movieModel = getMovieModel();
  const { token } = await createMovie(movieModel);

  const { title } = movieModel;
  const url = getURL(`/movies/${title}`);
  const opts = {
    method: 'DELETE',
    headers: {
      Authorization: token
    }
  };

  const expected = {};
  const actual = await req(url, opts);

  expect(actual).toEqual(expected);
});

it('/get - should get a movie', async () => {
  const movieModel = getMovieModel();
  const { token } = await createMovie(movieModel);
  const { title } = movieModel;
  const url = getURL(`/movies/${title}`);
  const opts = {
    headers: {
      Authorization: token
    }
  };

  const res = await req(url, opts);

  const expected = Object.keys(movieModel).concat('id', 'createdAt', 'updatedAt').sort();
  const actual = Object.keys(res).sort();

  expect(actual).toEqual(expected);
});

it('/list - should get all movies', async () => {
  for (const movie of movies) {
    await createMovie(movie);
  }

  const token = await getToken();
  const url = getURL('/movies');
  const opts = {
    headers: {
      Authorization: token
    }
  };

  const res = await req(url, opts);

  const expected = movies.length;
  const actual = res.length;

  expect(actual).toBe(expected);

  for (const record of res) {
    const match = movies.find((movie) => movie.title === record.title);

    expect(match).toBeDefined();
  }
});

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

it('/update - should update a movie record', async () => {
  const movieModel = getMovieModel();
  const { title } = movieModel;

  const { token } = await createMovie(movieModel);
  const url = getURL(`/movies/${title}`);
  const updatedMovieModel = merge(movieModel, { 
    rating: Math.ceil(Math.random() * 5)
  });
  delete updatedMovieModel.title;
  const opts = {
    method: 'PUT',
    body: JSON.stringify(updatedMovieModel),
    headers: {
      Authorization: token
    }
  };
  const res = await req(url, opts);

  Object.entries(updatedMovieModel)
    .forEach(([key, value]) => {
      const expected = value;
      const actual = res[key];

      expect(actual).toEqual(expected);
    });
});
