const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,32}$/;

export function isValidEmail(email) {
  return emailPattern.test(String(email || '').trim());
}

export function isValidUsername(username) {
  return usernamePattern.test(String(username || '').trim());
}

export function isValidPassword(password) {
  return typeof password === 'string' && password.length >= 8;
}

export function validateRegisterInput({ email, username, password }) {
  const errors = [];

  if (!isValidEmail(email)) {
    errors.push('Email is invalid.');
  }

  if (!isValidUsername(username)) {
    errors.push('Username must be 3-32 characters and contain only letters, numbers, and underscores.');
  }

  if (!isValidPassword(password)) {
    errors.push('Password must be at least 8 characters.');
  }

  return errors;
}
