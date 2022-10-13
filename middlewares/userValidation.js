const User = require("../models/User");

function userValidation({ username, email, password, confirmPassword }) {
  const messages = [];

  if (!username && typeof username !== "string") {
    messages.push("Username invalid");
  }

  var mailformat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  if (!email.toLowerCase().match(mailformat)) {
    messages.push("Email invalid");
  }

  if (!password && typeof password !== "string") {
    messages.push("Password invalid");
  }

  if (password.length < 6) {
    messages.push(
      "Password terlalu pendek. Password harus memiliki paling sedikit 6 karakter"
    );
  }

  if (password !== confirmPassword) {
    messages.push("Konfirmasi password tidak sama");
  }

  return messages;
}

module.exports = { userValidation };
