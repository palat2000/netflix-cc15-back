<<<<<<< HEAD
const createError = (message, status) => {
  const error = new Error(message);
  error.statusCode = status;
=======
const createError = (message, statusCode) => {
  const error = new Error(message);
  error.statusCode = statusCode;
>>>>>>> develop
  return error;
};

module.exports = createError;
