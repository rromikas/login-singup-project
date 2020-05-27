const axios = require("axios");
// const origin = "http://localhos.t:8000";
const origin = "http://192.168.1.183:8000";
export const login = (user, callback = () => {}) => {
  fetch(`${origin}/users/login`, {
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
    fetch(`${origin}/users/signup`, {
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
  fetch(`${origin}/users/facebookSignup`, {
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
  fetch(`${origin}/users/googleSignup`, {
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
export const update = (updatedUser, callback = () => {}) => {
  fetch(`${origin}/users/update`, {
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

export const read = (callback) => {
  fetch(`${origin}/users/read`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      authorization: `Bearer ${localStorage["secret_token"]}`,
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
  fetch(`${origin}/books/getAllBooks`, {
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
    response = await axios.post(`${origin}/books/getBook`, bookFilter);
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
    response = await axios.post(`${origin}/books/createThread`, thread);
  }

  callback(response);
};

export const getThread = async (ids, callback) => {
  console.log(ids);
  let response = await axios.post(`${origin}/books/getThread`, ids);
  callback(response);
};

export const replyToQuestion = async (reply, callback) => {
  let response = await axios.post(`${origin}/books/replyToQuestion`, reply);
  callback(response);
};

export const search = async (query, callback) => {
  let response = await axios.post(`${origin}/books/search`, { query });
  callback(response);
};

export const filter = async (filters, callback) => {
  let response = await axios.post(`${origin}/books/filter`, { filters });
  callback(response);
};

export const addView = async (book, callback) => {
  let response = await axios.post(`${origin}/books/addView`, book);
  callback(response);
};

export const getSortedThreads = async (options, callback) => {
  let response = await axios.post(
    `${origin}/books/get${options.sortBy}Threads`,
    options
  );
  callback(response);
};
