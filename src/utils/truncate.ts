export const truncateWithEllipses = (str: string, max = 40) => {
  if (!str) {
    return '';
  }

  if (!Number(max)) {
    throw new Error('max must be number!');
  }

  return str.length > max ? `${str.substring(0, max)}...` : str;
};
