import { checkAdvancedStrength } from "./advanced-checker.js";
import { getCSRFToken } from "../../shared/csrf.js";
import { loadCaptcha } from "../script.js";
import { handleRateLimitError } from "../../shared/rate-limiter-handler.js";

function showBackendError(message) {
  const oldError = document.querySelector("#backend-error");
  if (oldError) oldError.remove();

  const errorElem = document.createElement("p");
  errorElem.id = "backend-error";
  errorElem.style.color = "red";
  errorElem.style.marginTop = "8px";

  const passwordField = document.querySelector("#password");
  if (passwordField) {
    passwordField.closest(".input-group").appendChild(errorElem);
    errorElem.textContent = message;
  }
}

function handleRegisterSubmit(e) {
  e.preventDefault();

  const emailField = document.querySelector("#email");
  const passwordField = document.querySelector("#password");
  const confirmField = document.querySelector("#confirm-password");
  const captchaIdField = document.querySelector("#captcha_id");
  const captchaAnswerField = document.querySelector("#captcha_answer");

  if (!emailField || !passwordField || !confirmField) return;

  const email = emailField.value.trim();
  const password = passwordField.value;
  const confirmPassword = confirmField.value;
  const csrfToken = getCSRFToken();
  const captcha_id = (captchaIdField?.value || "").trim();
  const captcha_answer = (captchaAnswerField?.value || "").trim();


  if (password !== confirmPassword) {
    showBackendError("Passwords do not match!");
    return;
  }

  checkAdvancedStrength(email, password)
    .then(res => {
      let errorMessage = "";

      if (res.is_common) {
        errorMessage = "Password is too common. Please choose a more unique password.";
      } else if (!res.policy_valid) {
        errorMessage = "Password does not meet policy requirements.";
      } else if (res.is_pwned) {
        errorMessage = "Password has appeared in a data breach!";
      }

      if (errorMessage) {
        showBackendError(errorMessage);
        return Promise.reject(new Error(errorMessage));
      }

      return fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        body: JSON.stringify({ email, password, captcha_id, captcha_answer }),
        credentials: "include",
      });
    })
    .then(res => {
      if (res.status === 429) {
        return res.text().then(text => {
          try {
            const errorData = JSON.parse(text);
            handleRateLimitError(errorData);
            return Promise.reject(new Error("Registration rate limit exceeded."));
          } catch {
            handleRateLimitError({
              error: "Too many registration attempts. Please wait a minute.",
              message: "Rate limit exceeded"
            });
            return Promise.reject(new Error("Registration rate limit exceeded."));
          }
        });
      }

      if (!res.ok) {
        return res.text().then(t => {
          try {
            const err = JSON.parse(t);
            if (err.captcha_invalid){
              loadCaptcha();
              return Promise.reject(new Error("Incorrect CAPTCHA answer. Please try again!"));
            } else{
              return Promise.reject(new Error(err.error || "Something went wrong!"));
            }
          } catch {
            return Promise.reject(new Error("Something went wrong!"));
          }
        });
      }
      if (res.status === 201) {
    return res.json().then(data => {
      return { success: true, data };
    }).catch(() => {
      // If response has no JSON body, still treat as success
      return { success: true };
    });
  }
  
  // For other success status codes
  return res.json();
})
    .then(data => {
      alert("Account created successfully!");
      setTimeout(() => window.location.href = "/index.html", 50);
    })
    .catch(err => {
      console.error("Registration failed: ", err);
      if(err.message) showBackendError(err.message);
    });
}

export {handleRegisterSubmit};
