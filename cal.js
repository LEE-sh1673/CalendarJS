//* get elements from html.
const cal = document.querySelector(".calendar");
const startDayInput = document.getElementById("startDayInput");

const today = new Date();
const currentYear = today.getFullYear();
const currentMonth = today.getMonth();
const currentDay = String(today.getDate()).padStart(1, "0");
const ctrlBtns = document.getElementsByClassName("inputBtn");

const CALENDAR_SIZE = 42; // 7 * 6 size.

let daysWeek = ["SU", "MO", "TU", "WE", "TH", "FR", "SA"];

function getMonthName(currentMonthIdx) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  return monthNames[currentMonthIdx];
}

function createCalendarElement(data, className = null) {
  const element = document.createElement("div");
  if (className) {
    element.classList.add(className);
    element.innerHTML = data;
  } else {
    element.innerHTML = "00".concat(data + 1).slice(-2);
  }
  return element;
}

function clearCalendar() {
  cal.innerHTML = "";
}

const setCalendarData = (year, month, startDay = -1) => {
  // get first day , last day of current month.
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);

  // get last day of last year prev month.
  const prevDay = new Date(year, month, 0).getDate();

  // create elements for display calendar.
  const monthTable = document.createElement("div");
  const monthName = document.createElement("div");
  const monthContant = document.createElement("div");
  const start = startDay >= 0 ? startDay : firstDay.getDay();

  // adding classes.
  monthTable.classList.add("monthTable");
  monthName.classList.add("monthTable__name");
  monthContant.classList.add("monthTable__contant");

  // adding month name on table.
  monthName.innerHTML = getMonthName(month).concat(` ${currentYear}`);
  monthTable.appendChild(monthName);
  cal.appendChild(monthTable);

  // add daysWeek element into calendar.
  for (let i = 0; i < daysWeek.length; i++) {
    monthContant.appendChild(createCalendarElement(daysWeek[i], "daysWeek"));
  }

  // adding last month days into table.
  for (let i = start - 1; i >= 0; i--) {
    monthContant.appendChild(createCalendarElement(prevDay - i, "prevDays"));
  }

  //adding current days into table.
  for (let i = 0; i < lastDay.getDate(); i++) {
    const dayElement = createCalendarElement(i);
    const currentDayNumber = (start + i + 1) % 7;

    if (i + 1 == currentDay && firstDay.getMonth() == currentMonth) {
      dayElement.classList.add("today");
    }

    switch (currentDayNumber) {
      case 0:
        dayElement.classList.add("sat");
        break;
      case 1:
        dayElement.classList.add("sun");
        break;
      default:
        break;
    }
    monthContant.appendChild(dayElement);
  }

  // adding next days into table. (cut-off)
  for (
    let i = 0;
    i < CALENDAR_SIZE - (firstDay.getDay() + lastDay.getDate());
    i++
  ) {
    const dayElement = createCalendarElement(i);
    dayElement.classList.add("nextDays");
    monthContant.appendChild(dayElement);
  }
  monthTable.appendChild(monthContant);
};

function displayAllMonths() {
  for (let i = 0; i < 12; i++) {
    setCalendarData(currentYear, i);
  }
}

function activateMonthTable(id) {
  cal.classList.add("oneDisplayMode");
  const monthTables = document.getElementsByClassName("monthTable");

  for (let i = 0; i < monthTables.length; i++) {
    monthTables[i].style.display = "none";
  }
  monthTables[id].style.display = "flex";
}

let currentNav = [...Array(12).keys()];
let currentId = 0;

Array.from(ctrlBtns).forEach((ctrlBtn) => {
  ctrlBtn.addEventListener("click", (event) => {
    const currentInput = parseInt(event.target.value);

    switch (currentInput) {
      case -1:
        if (!currentId) {
          currentId = 12;
        }
        currentId = (currentId - 1) % 12;
        activateMonthTable(currentNav[Math.abs(currentId)]);
        break;
      case 0:
        clearCalendar();
        cal.classList.remove("oneDisplayMode");
        displayAllMonths();
        currentId = 0;
        break;
      case 1:
        currentId = (currentId + 1) % 12;
        activateMonthTable(currentNav[Math.abs(currentId)]);
        break;
      default:
        break;
    }
  });
});

displayAllMonths();
