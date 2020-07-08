const io = require("socket.io-client");

const server =
  process.env.NODE_ENV === "production"
    ? "http://quiet-tor-52115.herokuapp.com"
    : "192.168.0.104:5000";

const socket = io(server, {
  secure: true,
  transports: ["websocket", "polling", "flashsocket"],
});

export const ReadUser = (token, callback) => {
  socket.emit("/users/read", token).once("/users/read", (res) => {
    callback(res);
  });
};

export const InviteMemberToGroup = (email, userId, groupId, callback) => {
  socket
    .emit("/groups/inviteMember", email, userId, groupId)
    .once("/groups/inviteMember", (res) => {
      callback(res);
    });
};

export const AcceptInvitationToGroup = (
  groupId,
  userId,
  invitationId,
  callback
) => {
  socket
    .emit("/groups/acceptInvitation", groupId, userId, invitationId)
    .once("/groups/acceptInvitation", (res) => {
      callback(res);
    });
};

export const CheckInvitationValidity = (token, inivitationId, callback) => {
  socket
    .emit("/groups/checkInvitationValidity", token, inivitationId)
    .once("/groups/checkInvitationValidity", (res) => {
      callback(res);
    });
};

export const GetFilteredGroups = (filter, callback) => {
  socket
    .emit("/groups/getFiltered", filter)
    .once("/groups/getFiltered", (res) => {
      callback(res);
    });
};

export const GetGroup = (groupId, callback) => {
  socket.emit("/groups/get", groupId).once("/groups/get", (res) => {
    callback(res);
  });
};

export const CreateGroup = (group, callback) => {
  socket.emit("/groups/create", group).once("/groups/create", (res) => {
    callback(res);
  });
};

export const AddBookToGroup = (groupId, bookId, callback) => {
  socket
    .emit("/groups/addBook", groupId, bookId)
    .once("/groups/addBook", (res) => {
      callback(res);
    });
};

export const UpdateGroup = (group, callback) => {
  socket.emit("/groups/update", group).once("/groups/update", (res) => {
    callback(res);
  });
};

export const VoteForNextBook = (bookId, userId, groupId, callback) => {
  socket
    .emit("/groups/voteForNextBook", bookId, userId, groupId)
    .once("/groups/voteForNextBook", (res) => {
      callback(res);
    });
};

export const CompleteBookReading = (groupId, bookId, callback) => {
  socket
    .emit("/groups/completeBookReading", groupId, bookId)
    .once("/groups/completeBookReading", (res) => {
      callback(res);
    });
};

export const GetBookQuizzes = (bookId, groupId, callback) => {
  socket
    .emit("/books/quizzes/getAll", bookId, groupId)
    .once("/books/quizzes/getAll", (res) => {
      callback(res);
    });
};

export const CreateQuiz = (quiz, callback) => {
  socket
    .emit("/books/quizzes/create", quiz)
    .once("/books/quizzes/create", (res) => {
      callback(res);
    });
};

export const SubmitQuizResult = (result, groupId, bookId, callback) => {
  socket
    .emit("/books/quizzes/solved", result, groupId, bookId)
    .once("/books/quizzes/solved", (res) => {
      callback(res);
    });
};

export const GetQuiz = (quizId, callback) => {
  socket
    .emit("/books/quizzes/getOne", quizId)
    .once("/books/quizzes/getOne", (res) => {
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

export const GetRecentlyAddedBooks = async (callback) => {
  socket
    .emit("/books/getRecentlyAddedBooks")
    .once("/books/getRecentlyAddedBooks", (res) => {
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
  book.dateAdded = Date.now();
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
    callback(response);
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
  if (reply.reply === "") {
    callback({ error: "Reply is empty" });
  } else {
    socket
      .emit("/books/replyToQuestion", reply)
      .once("/books/replyToQuestion", (res) => {
        callback(res);
      });
  }
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

export const RemoveBookFromFavorites = async (bookId, userId, callback) => {
  socket
    .emit("/books/removeFromFavorites", { bookId, userId })
    .once("/books/removeFromFavorites", (res) => {
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

export const GetNotifications = (userId, callback) => {
  socket
    .emit("/users/getNotifications", userId)
    .once("/users/getNotifications", (res) => {
      callback(res);
    });
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

export const AddSummary = (props, callback = () => {}) => {
  let response = {};
  if (!props.summary.authorId) {
    response = { error: "You have to login to craete new summaries" };
  } else if (!props.bookId) {
    response = { error: "Wrong book id" };
  } else if (props.summary.description === "") {
    response = { error: "Explain your question in description" };
  } else if (props.summary.title === "") {
    response = { error: "Title is empty" };
  }
  if (response.error) {
    callback(response);
  } else {
    socket.emit("/books/addSummary", props).once("/books/addSummary", (res) => {
      callback(res);
    });
  }
};
export const EditSummary = (props, callback = () => {}) => {
  socket.emit("/books/editSummary", props).once("/books/editSummary", (res) => {
    callback(res);
  });
};

export const VoteForReply = (props, callback) => {
  socket
    .emit("/books/voteForReply", props)
    .once("/books/voteForReply", (res) => {
      callback(res);
    });
};

export const GetSummary = (props, callback) => {
  socket
    .emit("/books/summaries/getSummary", props)
    .once("/books/getSummary", (res) => {
      callback(res);
    });
};

export const CommentSummary = (props, callback) => {
  socket
    .emit("/books/summaries/commentSummary", props)
    .once("/books/summaries/commentSummary", (res) => {
      callback(res);
    });
};

export const RateSummary = (props, callback) => {
  socket
    .emit("/books/summaries/rateSummary", props)
    .once("/books/summaries/rateSummary", (res) => {
      callback(res);
    });
};

export const GetSortedSummaries = (props, callback) => {
  let path = `/books/summaries/get${props.sortBy}Summaries`;
  socket.emit(path, props).once(path, (res) => {
    callback(res);
  });
};

export const AddViewToSummary = (props, callback) => {
  socket
    .emit("/books/summaries/addView", props)
    .once("/books/summaries/addView", (res) => {
      callback(res);
    });
};
