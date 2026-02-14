document.addEventListener("DOMContentLoaded", function () {

const form = document.getElementById("loginForm");
const emailInput = document.querySelector(".login-email");
const passwordInput = document.querySelector(".login-password");

const emailError = document.getElementById("loginEmailError");
const passwordError = document.getElementById("loginPasswordError");

if (!form) return;

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

  if (password === "") {
    passwordError.textContent = "Password required";
    return;
  }

  let users = JSON.parse(localStorage.getItem("users")) || [];

  const user = users.find(
    u => u.email === email && u.password === password
  );

  if (!user) {
    passwordError.textContent = "Invalid email or password";
    return;
  }

  localStorage.setItem("currentUser", email);
  window.location.href = "../taskpg/task.html";
});

});
function togglePassword(){
  const passwordInput = document.getElementById("loginPassword");

  if(passwordInput.type === "password"){
    passwordInput.type = "text";
  } else {
    passwordInput.type = "password";
  }
}
