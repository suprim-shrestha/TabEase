import * as yup from "yup";

export async function validateFormData<T>(schema: yup.Schema, formData: T) {
  const validatedData = await schema.validate(formData, { abortEarly: false });

  return validatedData;
}

export function displayValidationError(
  formElement: HTMLFormElement,
  formName: string,
  field: string,
  message: string
) {
  const feedbackElement = document.getElementById(
    `${formName}-${field}-feedback`
  ) as HTMLDivElement;
  formElement[field].classList.add("is-invalid");
  feedbackElement.innerText = message;
}
