function handleRateLimitError(errorData) {
  const oldError = document.querySelector("#backend-error");
  if (oldError) oldError.remove();

  const errorElem = document.createElement("p");
  errorElem.id = "backend-error";
  errorElem.style.color = "#ff5555";
  errorElem.style.marginTop = "8px";
  errorElem.textContent = errorData.message || errorData.error;

  const form = document.querySelector("form");
  if (form) {
    form.appendChild(errorElem);
  }

  errorElem.scrollIntoView({ behavior: "smooth", block: "center" });
}

export { handleRateLimitError };
