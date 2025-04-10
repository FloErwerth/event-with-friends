export const formatToDate = (date?: Date | number | string) => {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(date);

  if (parsedDate.toString() === 'INVALID') {
    return undefined;
  }

  return parsedDate.toLocaleDateString('de-DE', {
    day: '2-digit',
    month: 'long',
    year: '2-digit',
  });
};

export const formatToTime = (date?: Date | number | string) => {
  if (!date) {
    return undefined;
  }

  const parsedDate = new Date(date);

  if (parsedDate.toString() === 'INVALID') {
    return undefined;
  }

  return parsedDate.toLocaleTimeString('de-DE', {
    hour: 'numeric',
    minute: '2-digit',
  });
};
