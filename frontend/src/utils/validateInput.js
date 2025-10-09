export const validateInput = (validators, value) => {
  // If there are no validators, there are no errors.
  if (!validators || validators.length === 0) {
    return null;
  }

  // Loop through all the validator functions
  for (const validator of validators) {
    const errorMessage = validator(value);
    // If a validator returns an error message, stop and return that message
    if (errorMessage) {
      return errorMessage;
    }
  }

  // If all validators pass, return null
  return null;
};
