const today = new Date();

const setCalendarData = (year, month) => {
  // get first day of current month.
  const firstDay = new Date(year, month, 1);

  // get last day of current month.
  const lastDay = new Date(year, month + 1, 0);

  // get last day of last year prev month.
  const prevDay = new Date(year, month, 0).getDate();

  // print last month
  for (let i = firstDay.getDay() - 1; i >= 0; i--) {
    console.log(prevDay - i);
  }
  // print current days.
  for (let i = 0; i < lastDay.getDate(); i++) {
    console.log(i + 1);
  }

  // print next days (cut-off)
  for (let i = 0; i < 42 - (firstDay.getDay() + lastDay.getDate()); i++) {
    console.log(i + 1);
  }
};
