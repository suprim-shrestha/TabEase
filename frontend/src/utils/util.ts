/**
 * Add event listeners for all input tags to remove "is-invalid" class
 */
export function resetInvalidInputClass() {
  const inputFields = document.getElementsByTagName("input");

  for (let i = 0; i < inputFields.length; i++) {
    inputFields[i].addEventListener("input", () => {
      inputFields[i].classList.remove("is-invalid");
    });
  }
}

/**
 * Send a message to be received by extension
 *
 * @param action Method to call in the extension
 * @param options Optional options used for sending variable values
 */
export function sendMessage(action: string, options = {}) {
  window.postMessage(
    {
      source: "webpage",
      message: { action, ...options },
    },
    "*"
  );
}
