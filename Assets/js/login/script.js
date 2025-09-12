import { handleLoginSubmit } from "./fetcher-handler/login-handler.js";
import { fetchCSRFToken, getCSRFToken } from "../shared/csrf.js";
import { handleRateLimitError } from "../shared/rate-limiter-handler.js";

document.addEventListener("DOMContentLoaded", () => {
  fetchCSRFToken()
    .then(() => {
      init();
    })
    .catch(err => console.error("CSRF init failed!", err));
});

const passwordInput = document.querySelector("#password");
const togglePassword = document.querySelector("#toggle-password");

async function loadCaptcha(){
  try{
    const csrfToken = getCSRFToken();
    const result = await fetch("http://127.0.0.1:5050/captcha/new", {
      method:"GET",
      credentials:"include",
      headers:{
        "X-CSRFToken":csrfToken,
      },
    });

    if (!result.ok){
      if(result.status === 429){
        return result.text().then(text => {
          try {
            const errorData = JSON.parse(text);
            handleRateLimitError(errorData);
            throw new Error("CAPTCHA rate limit exceeded!");
          } catch {
            handleRateLimitError({
              error: "Too many CAPTCHA reloads. Please wait a minute.",
              message: "Rate limit exceeded"
            });
            throw new Error("CAPTCHA rate limit exceeded!");
          }
        });
      }
      throw new Error("CAPTCHA fetch failed");
    }
    
    const data = await result.json();
    document.querySelector("#captcha_image").src = data.image;
    document.querySelector("#captcha_id").value = data.captcha_id;
    document.querySelector("#captcha_answer").value = "";

  } catch(e){
    console.error(e);
  }
}

function init() {
  const form = document.querySelector("#loginForm");
  const refreshBtn = document.querySelector("#refresh_captcha");

  togglePassword.addEventListener("click", () => {
    const isHidden = passwordInput.type === "password";
    passwordInput.type = isHidden ? "text" : "password";
    togglePassword.textContent = isHidden ? "Hide" : "Show";
    passwordInput.style.fontFamily = isHidden ? "monospace" : "initial";
  });

  refreshBtn.addEventListener("click", loadCaptcha);
  form.addEventListener("submit", handleLoginSubmit);
  loadCaptcha();
}

export { loadCaptcha };
