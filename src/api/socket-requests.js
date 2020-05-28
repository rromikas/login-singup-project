const io = require("socket.io-client");

const socket = io("https://tangy-denim-juice.glitch.me", {
  secure: true,
  transports: ["websocket", "polling", "flashsocket"],
});

export const ReadUser = (token, callback) => {
  socket.emit("/users/read", token).once("/users/read", (res) => {
    callback(res);
  });
};

export const FacebookSignup = (user, callback) => {
  socket
    .emit("/users/facebookSignup", user)
    .once("/users/facebookSignup", (res) => {
      callback(res);
    });
};

export const GoogleSignup = (user, callback) => {
  socket
    .emit("/users/googleSignup", user)
    .once("/users/googleSignup", (res) => {
      callback(res);
    });
};

export const GetFilteredBooks = async (filters, callback) => {
  socket
    .emit("/books/getFiltered", filters)
    .once("/books/getFiltered", (res) => {
      callback(res);
    });
};

export const GetAllBooks = (callback) => {
  socket.emit("/books/getAll").once("/books/getAll", (res) => {
    callback(res);
  });
};

export const GetBook = async (bookFilter, callback) => {
  socket.emit("/books/getOne", bookFilter).once("/books/getOne", (res) => {
    callback(res);
  });
};

export const GetBooks = (search, callback) => {
  let query = socket
    .emit(
      "/books/getBooks",
      isNaN(parseInt(search))
        ? {
            title: search,
          }
        : {
            isbn: parseInt(search),
          }
    )
    .once("/books/getBooks", (response) => {
      callback(response);
    });
};
export const AddBook = async (book, callback) => {
  socket.emit("/books/add", book).once("/books/add", (res) => {
    callback(res);
  });
};

export const SearchBooks = async (query, callback) => {
  socket.emit("/books/search", query).once("/books/search", (res) => {
    callback(res);
  });
};

export const CreateThread = async (thread, callback) => {
  let response = {};
  if (!thread.userId) {
    response = { error: "You have to login to craete new threads" };
  } else if (!thread.bookId) {
    response = { error: "Wrong book id" };
  } else if (thread.description === "") {
    response = { error: "Explain your question in description" };
  } else if (thread.title === "") {
    response = { error: "Title is empty" };
  }

  if (response.error) {
    callback(response.error);
  } else {
    socket
      .emit("/books/createThread", thread)
      .once("/books/createThread", (res) => {
        callback(res);
      });
  }
};

export const GetSortedThreads = async (options, callback) => {
  let path = `/books/get${options.sortBy}Threads`;
  socket.emit(path, options).once(path, (res) => {
    callback(res);
  });
};

export const GetThread = async (ids, callback) => {
  socket.emit("/books/getThread", ids).once("/books/getThread", (res) => {
    callback(res);
  });
};

export const ReplyToQuestion = async (reply, callback) => {
  socket
    .emit("/books/replyToQuestion", reply)
    .once("/books/replyToQuestion", (res) => {
      callback(res);
    });
};

export const AddView = async (book, callback) => {
  socket.emit("/books/addView", book).once("/books/addView", (res) => {
    callback(res);
  });
};

export const AddBookToFavorites = async (bookId, userId, callback) => {
  socket
    .emit("/books/addToFavorites", { bookId, userId })
    .once("/books/addToFavorites", (res) => {
      callback(res);
    });
};

export const Signup = (user, callback = () => {}) => {
  if (user.password === user.password2) {
    socket.emit("/users/signup", user).once("/users/signup", (res) => {
      callback(res);
    });
  } else {
    callback({ error: "passwords do not match" });
  }
};

export const Login = (user, callback = () => {}) => {
  socket.emit("/users/login", user).once("/users/login", (res) => {
    callback(res);
  });
};

export const UpdateUser = (updatedUser, callback = () => {}) => {
  socket.emit("/users/update", updatedUser).once("/users/update", (res) => {
    callback(res);
  });
};
