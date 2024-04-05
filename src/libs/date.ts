export const splitDate = (date: Date | string) => {
  const parsedDate = typeof date === 'string' ? new Date(date) : date;
  const year = parsedDate.getFullYear();
  const month = parsedDate.getMonth() + 1;
  const day = parsedDate.getDate();
  return { year, month, day };
};

export const formatDateToYYYYMMDD = (date: Date) => {
  const { year, month, day } = splitDate(date);
  return `${year}-${month}-${day}`;
};

export const formatDateToLocaleString = (date: Date) =>
  date.toLocaleDateString('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
    year:
      new Date().getFullYear() === date.getFullYear() ? undefined : 'numeric',
  });

export const isToday = (dateString: string) => {
  const date = new Date(dateString);
  const today = new Date();
  return (
    date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear()
  );
};

export const getRelativeMonthAndYear = (
  {
    date,
    relativeMonthIndex = 0,
  }: {
    date?: Date;
    relativeMonthIndex: number;
  } = { relativeMonthIndex: 0 }
) => {
  const dateClone = date ? new Date(date) : new Date();
  dateClone.setDate(15); // get away from month limits to avoid issues
  dateClone.setMonth(dateClone.getMonth() + relativeMonthIndex);
  const month = dateClone.getMonth() + 1;
  const year = dateClone.getFullYear();
  return { month, year };
};

export const addMonths = (a: number, b: number) => {
  const mod = (a + b) % 12;
  return mod <= 0 ? mod + 12 : mod;
};
