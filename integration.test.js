const { merge, req, RequestError } = require('./movies/utils');
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

it('/user - should fail on bad user data', async () => {
  const user = {
    username: 'foo'
  };
  const url = getURL('/movies/user');
  const opts = {
    method: 'POST',
    body: JSON.stringify(user)
  };
  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Incorrect User Data - POST Body requires a username & an alphanumeric password of at least 8 characters.');
  }
});

it('/token - should fetch a token', async () => {
  const res = await getToken();

  const expected = 'string';
  const actual = typeof res;

  expect(actual).toBe(expected);
});

it('/token - should fail on bad user data', async () => {
  await getUser();
  const user = {
    username: 'foo'
  };
  const url = getURL('/movies/token');
  const opts = {
    method: 'POST',
    body: JSON.stringify(user)
  };
  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Incorrect User Data - POST Body requires a username & an alphanumeric password of at least 8 characters.');
  }
});

it('/token - should fail on mismatched password', async () => {
  const { user } = await getUser();
  const newUser = {
    username: user.username,
    password: 'foobarbaz'
  };
  const url = getURL('/movies/token');
  const opts = {
    method: 'POST',
    body: JSON.stringify(newUser)
  };
  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(403);
    expect(err.message).toBe('Unable to serve token - incorrect username or password.');
  }
});

it('/create - should create a movie', async () => {
  const movieModel = getMovieModel();
  const { movie } = await createMovie(movieModel);

  const expected = Object.keys(movieModel).concat('id', 'createdAt', 'updatedAt').sort();
  const actual = Object.keys(movie).sort();

  expect(actual).toEqual(expected);
});

it('/create - should fail on a bad movie model', async () => {
  try {
    await createMovie({
      title: 'foobarbaz'
    });
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(400);
    expect(err.message).toBe('Validation Failed: Incorrect Movie Data Model.')
  }

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

it('/delete - should fail on a non-existant movie', async () => {
  const token = await getToken();
  const title = 'foobarbaz';
  const url = getURL(`/movies/${title}`);
  const opts = {
    method: 'DELETE',
    headers: {
      Authorization: token
    }
  };

  try {
    await req(url, opts);
  } catch(err) {
    expect(err).toBeInstanceOf(RequestError);
    expect(err.statusCode).toBe(501);
    expect(err.message).toBe('Couldn\'t remove the movie.');
  }
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
