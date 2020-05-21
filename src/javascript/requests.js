const origin = "https://cute-slime-longan.glitch.me";

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
