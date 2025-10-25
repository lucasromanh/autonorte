export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validateUsername = (username: string): boolean => {
  return username.length >= 3 && username.length <= 20;
};

export const validateCarTitle = (title: string): boolean => {
  return title.length >= 5 && title.length <= 100;
};

export const validateCarDescription = (description: string): boolean => {
  return description.length >= 10 && description.length <= 1000;
};

export const validatePrice = (price: number): boolean => {
  return price > 0 && price <= 10000000;
};