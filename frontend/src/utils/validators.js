export const validateRequired = (value) => {
  if (!value || value.trim() === "") {
    return "This field is required.";
  }
  return null; // Returning null means no error
};

export const validateIsNumber = (value) => {
  if (isNaN(value)) {
    return "This field must be a number.";
  }
  return null;
};

export const validateLength = (value, length) => {
  if (value.length !== length) {
    return `This field must be exactly ${length} characters long.`;
  }
  return null;
};

export const validateCredentials = (
  username,
  password,
  usernameAttempt,
  passwordAttempt
) => {
  return username === usernameAttempt && password === passwordAttempt;
};
