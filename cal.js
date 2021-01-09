//* get elements from html.
const cal = document.querySelector(".calendar");
const title = document.querySelector(".calendar__title");
const startDayInput = document.getElementById("startDayInput");

const date = new Date();
const year = date.getFullYear();
const thisMonth = date.getMonth() + 1;
const today = date.getDay();
let start = 0;

//* set site title
title.innerHTML = `Calendar ${year}`;

startDayInput.addEventListener("input", (event) => {
  event.preventDefault();

  if (event.data === null) {
    return;
  } else if (event.data >= 0 && event.data < 7) {
    start = parseInt(event.data);
    clearCalendar();
    printCalendar();
  }
});

const isLeapYear = (year) => {
  if (year % 4 === 0 && (year % 400 === 0 || year % 100 !== 0)) {
    return true;
  }
};

let daysWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];
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

function printMonth(month) {
  const monthTable = document.createElement("div");
  const monthName = document.createElement("div");
  const monthContant = document.createElement("div");
  let offset = 0;

  // adding classes.
  monthTable.classList.add("monthTable");
  monthName.classList.add("monthTable__name");
  monthContant.classList.add("monthTable__contant");

  // adding month name on table.
  monthName.innerHTML = month.name.concat(` ${year}`);
  monthTable.appendChild(monthName);
  cal.appendChild(monthTable);

  // adding day name into table.
  for (let i = 0; i < daysWeek.length; i++) {
    const monthDay = document.createElement("div");
    monthDay.classList.add("daysWeek");
    monthDay.innerHTML = daysWeek[i];
    monthContant.appendChild(monthDay);
  }
  monthTable.appendChild(monthContant);

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
    monthDay.innerHTML = "00".concat(i + 1).slice(-2);

    if (i + 1 == today && month.name === monthes[thisMonth - 1].name) {
      monthDay.classList.add("today");
    }

    switch (currentDay) {
      case 0:
        monthDay.classList.add("sat");
        offset++;
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
  start = (start + month.days) % 7;

  for (let i = 0; i < 7 - start + (offset < 5 ? 7 : 0); i++) {
    const monthDay = document.createElement("div");
    monthDay.innerHTML = "";
    monthContant.appendChild(monthDay);
  }
  monthTable.appendChild(monthContant);
}

function printCalendar() {
  monthes.forEach((month) => {
    printMonth(month);
  });
}

function clearCalendar() {
  cal.innerHTML = "";
}
