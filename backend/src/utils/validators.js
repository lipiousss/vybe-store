const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const usernamePattern = /^[a-zA-Z0-9_]{3,20}$/;
const phonePattern = /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/;

export function isValidEmail(email) {
  return emailPattern.test(String(email || '').trim());
}

export function isValidUsername(username) {
  return usernamePattern.test(String(username || '').trim());
}

export function isValidPassword(password) {
  return (
    typeof password === 'string'
    && password.length >= 8
    && /[A-Z]/.test(password)
    && /[a-z]/.test(password)
    && /\d/.test(password)
  );
}

export function isValidPhone(phone) {
  return phonePattern.test(String(phone || '').trim());
}

export function validateRegisterInput({ email, username, password }) {
  const errors = [];

  if (!isValidEmail(email)) {
    errors.push('Email is invalid.');
  }

  if (!isValidUsername(username)) {
    errors.push('Username must be 3-20 characters and contain only latin letters, numbers, and underscores.');
  }

  if (!isValidPassword(password)) {
    errors.push('Password must be at least 8 characters and include uppercase, lowercase, and a number.');
  }

  return errors;
}
