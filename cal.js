//* get elements from html.
const cal = document.querySelector(".calendar");
const title = document.querySelector(".calendar__title");

const year = new Date().getFullYear();
const START_DAY_OF_YEAR = 3;

//* set site title
title.innerHTML = `Calendar ${year}`;

const isLeapYear = (year) => {
  if (year % 4 === 0 && (year % 400 === 0 || year % 100 !== 0)) {
    return true;
  }
};

let monthes = [
  {
    name: "January",
    days: 31,
  },
  {
    name: "February",
    days: isLeapYear(year) ? 29 : 28,
  },
  {
    name: "March",
    days: 31,
  },
  {
    name: "April",
    days: 30,
  },
  {
    name: "May",
    days: 31,
  },
  {
    name: "June",
    days: 30,
  },
  {
    name: "July",
    days: 31,
  },
  {
    name: "August",
    days: 31,
  },
  {
    name: "September",
    days: 30,
  },
  {
    name: "October",
    days: 31,
  },
  {
    name: "November",
    days: 30,
  },
  {
    name: "December",
    days: 31,
  },
];

let start = START_DAY_OF_YEAR;

function printMonth(month) {
  const monthTable = document.createElement("div");
  const monthName = document.createElement("div");
  const monthContant = document.createElement("div");

  // adding classes.
  monthTable.classList.add("monthTable");
  monthName.classList.add("monthTable__name");
  monthContant.classList.add("monthTable__contant");

  // adding month name on table.
  monthName.innerHTML = month.name;
  monthTable.appendChild(monthName);
  cal.appendChild(monthTable);

  // puch empty space of calendar.
  for (let i = 0; i < start; i++) {
    const monthDay = document.createElement("div");
    monthDay.innerHTML = "";
    monthContant.appendChild(monthDay);
  }
  monthTable.appendChild(monthContant);

  //adding days into table.
  for (let i = 0; i < month.days; i++) {
    const monthDay = document.createElement("div");
    const currentDay = (start + i + 1) % 7;
    monthDay.innerHTML = i + 1;

    switch (currentDay) {
      case 0:
        monthDay.classList.add("sat");
        break;
      case 1:
        monthDay.classList.add("sun");
        break;
      default:
        break;
    }
    monthContant.appendChild(monthDay);
  }
  monthTable.appendChild(monthContant);

  // update start day of next month.
  let offset = start;
  start = (start + month.days) % 7;

  for (
    let i = 0;
    i < 7 - start + (offset < 5 || month.days < 30 ? 7 : 0);
    i++
  ) {
    const monthDay = document.createElement("div");
    monthDay.innerHTML = "";
    monthContant.appendChild(monthDay);
  }
  monthTable.appendChild(monthContant);
}

monthes.forEach((month) => {
  printMonth(month);
});
