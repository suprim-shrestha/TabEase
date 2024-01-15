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
