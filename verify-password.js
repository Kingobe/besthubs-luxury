const bcrypt = require("bcryptjs");

const storedHash = 
"$2b$10$oyVb10vowV/JTLU2vpbQo.9DgRuBkAYnUM8bZ6MjyqegiYf6YjAMK";
const password = "admin123";

bcrypt.compare(password, storedHash, (err, isMatch) => {
  if (err) {
    console.error("Error:", err);
    return;
  }
  console.log("Password match:", isMatch);
});
