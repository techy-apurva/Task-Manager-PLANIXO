
const form = document.getElementById("signupForm");
const emailInput = document.querySelector(".email");
const passwordInput = document.querySelector(".password");

const emailError = document.getElementById("emailError");
const passwordError = document.getElementById("passwordError");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const email = emailInput.value.trim();
  const password = passwordInput.value.trim();

  emailError.textContent = "";
  passwordError.textContent = "";

  if (email === "") {
    emailError.textContent = "Email required";
    return;
  }

  if (password.length < 6) {
    passwordError.textContent = "Password must be 6 characters";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const exists = users.find(u => u.email === email);
  if (exists) {
    emailError.textContent = "User already exists";
    return;
  }

  users.push({ email, password });
  localStorage.setItem("users", JSON.stringify(users));

  localStorage.setItem("currentUser", email);

 window.location.href = "task.html";

});

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function toggleSignupPassword(){
  const passwordInput = document.getElementById("signupPassword");

  if(passwordInput.type === "password"){
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
