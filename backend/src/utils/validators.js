const isValidName = (name) => {
  if (typeof name !== 'string') return false;
  const trimmed = name.trim();
  return trimmed.length >= 20 && trimmed.length <= 60;
};

const isValidAddress = (address) => {
  if (address === undefined || address === null || address === '') return true; // optional field
  return typeof address === 'string' && address.length <= 400;
};

const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return typeof email === 'string' && emailRegex.test(email);
};

const isValidPassword = (password) => {
  if (typeof password !== 'string') return false;
  if (password.length < 8 || password.length > 16) return false;
  const hasUpper = /[A-Z]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>_\-+=\[\]\\/;'~`]/.test(password);
  return hasUpper && hasSpecial;
};

const isValidRating = (rating) => {
  const n = Number(rating);
  return Number.isInteger(n) && n >= 1 && n <= 5;
};

module.exports = {
  isValidName,
  isValidAddress,
  isValidEmail,
  isValidPassword,
  isValidRating,
};
