const axios = require("axios");
const server = "https://tangy-denim-juice.glitch.me"; // proxy is set

export const saveBook = async (data) => {
  let response = "";
  try {
    response = await axios.post(`${server}/books/saveBook`, data);
  } catch (e) {
    response = { error: true };
  }
  return response;
};

export const getBooks = (search) => {
  return axios.get(`${server}/books/getBooks`, {
    params: isNaN(parseInt(search))
      ? {
          title: search,
        }
      : {
          isbn: parseInt(search),
        },
  });
};

export const login = (user, callback = () => {}) => {
  fetch(`${server}/users/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((res) => {
      callback(res);
    })
    .catch((er) => callback({ error: er }));
};

export const signup = (user, callback = () => {}) => {
  if (user.password === user.password2) {
    fetch(`${server}/users/signup`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(user),
    })
      .then((res) => res.json())
      .then((res) => {
        callback(res);
      })
      .catch((er) => callback({ error: er }));
  } else {
    callback({ error: "passwords do not match" });
  }
};

export const facebookSignup = (user, callback = () => {}) => {
  fetch(`${server}/users/facebookSignup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((res) => {
      callback(res);
    })
    .catch((er) => callback({ error: er }));
};

export const googleSingup = (user, callback = () => {}) => {
  fetch(`${server}/users/googleSignup`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(user),
  })
    .then((res) => res.json())
    .then((res) => {
      callback(res);
    })
    .catch((er) => callback({ error: er }));
};
export const updateUser = (updatedUser, callback = () => {}) => {
  fetch(`${server}/users/update`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage["secret_token"]}`,
    },
    body: JSON.stringify(updatedUser),
  })
    .then((res) => res.json())
    .then((res) => {
      callback(res);
    });
};

export const readUser = (token, callback) => {
  fetch(`${server}/users/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${token}`,
    },
  })
    .then((res) => res.json())
    .then((res) => {
      callback(res);
    })
    .catch((er) => {
      callback({ error: er });
    });
};

export const getAllBooks = (callback) => {
  fetch(`${server}/books/getAllBooks`, {
    method: "GET",
  })
    .then((res) => {
      return res.json();
    })
    .then((res) => {
      callback(res);
    });
};

export const getBook = async (bookFilter, callback) => {
  let response = "";
  try {
    response = await axios.post(`${server}/books/getBook`, bookFilter);
  } catch (e) {
    response = { error: true };
  }
  callback(response);
};

export const craeteThread = async (thread, callback) => {
  let response;
  if (!thread.userId) {
    response = { error: "You have to login to craete new threads" };
  } else if (!thread.bookId) {
    response = { error: "Wrong book id" };
  } else if (thread.description === "") {
    response = { error: "Explain your question in description" };
  } else if (thread.title === "") {
    response = { error: "Title is empty" };
  } else {
    response = await axios.post(`${server}/books/createThread`, thread);
  }

  callback(response);
};

export const getThread = async (ids, callback) => {
  let response = await axios.post(`${server}/books/getThread`, ids);
  callback(response);
};

export const replyToQuestion = async (reply, callback) => {
  let response = await axios.post(`${server}/books/replyToQuestion`, reply);
  callback(response);
};

export const search = async (query, callback) => {
  let response = await axios.post(`${server}/books/search`, { query });
  callback(response);
};

export const filter = async (filters, callback) => {
  // let response = await axios.post(`${server}/books/filter`, { filters });
  fetch(`${server}/books/filter`, {
    method: "POST",
    body: JSON.stringify({ filters: filters }),
  })
    .then((res) => res.json())
    .then((res) => {
      callback(res);
    });
};

export const addView = async (book, callback) => {
  let response = await axios.post(`${server}/books/addView`, book);
  callback(response);
};

export const getSortedThreads = async (options, callback) => {
  let response = await axios.post(
    `${server}/books/get${options.sortBy}Threads`,
    options
  );

  callback(response);
};

export const addBookToFavorites = async (bookId, userId, callback) => {
  let response = await axios.post(`${server}/books/addToFavorites`, {
    bookId,
    userId,
  });
  callback(response);
};

export const getFavoriteBooks = async (userId, callback) => {
  let response = await axios.post(`${server}/users/getFavoriteBooks`, {
    userId,
  });
  callback(response);
};
