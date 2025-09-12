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

  const form = document.querySelector("form");
  if (form) {
    form.appendChild(errorElem);
    errorElem.textContent = message;
  }
}

function handleLoginSubmit(e) {
  e.preventDefault();
  e.stopPropagation();

  const emailInput = document.querySelector("#email");
  const passwordInput = document.querySelector("#password");
  const email = emailInput.value.trim();
  const password = passwordInput.value;
  const csrfToken = getCSRFToken();

  const captcha_id = (document.querySelector("#captcha_id")?.value || "").trim();
  const captcha_answer = (document.querySelector("#captcha_answer")?.value || "").trim();

  console.log("Login attempt with CAPTCHA:", { captcha_id, captcha_answer });

  const oldError = document.querySelector("#backend-error");
  if (oldError) oldError.remove();

  if (!captcha_id || !captcha_answer) {
    showBackendError("Please complete the CAPTCHA");
    loadCaptcha();
    return;
  }

  fetch("http://127.0.0.1:5050/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-CSRFToken": csrfToken,
    },
    body: JSON.stringify({ email, password, captcha_id, captcha_answer }),
    credentials: "include",
  })
    .then(res => {
      if (res.status === 429) {
        return res.text().then(text => {
          try {
            const errorData = JSON.parse(text);
            handleRateLimitError(errorData);
            return Promise.reject(new Error("Login rate limit exceeded."));
      }
      catch {
        handleRateLimitError({
          error: "Too many login attempts. Please wait a minute.",
          message: "Rate limit exceeded"
        });
        return Promise.reject(new Error("Too many attempts. Please wait a few minutes before trying again."));
      }
    });
  }
      if (!res.ok) {
        return res.text().then(t => {
          try {
            const err = JSON.parse(t);
            if (err.captcha_invalid) {
              loadCaptcha();
              return Promise.reject(new Error("Incorrect CAPTCHA answer. Please try again!"));
            } else {
              return Promise.reject(new Error(err.error || "Login failed"));
            }
          } catch {
            return Promise.reject(new Error("Login failed. Please try again."));
          }
        });
      }

      return res.json();
    })
    .then(data => {
      console.log("Login successful, response:", data);

      if (data.redirect) {
        window.location.href = data.redirect;
      } else {
        window.location.href = "http://127.0.0.1:5050/success";
      }
    })
    .catch(err => {
      console.error("Login failed: ", err);
      emailInput.value = email;
      passwordInput.value = password;
      if (err.message) showBackendError(err.message);
    });
}

export { handleLoginSubmit };
