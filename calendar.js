const calendarElement = document.getElementById("calendar");
const monthYearElement = document.getElementById("monthYear");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const toggleViewButton = document.getElementById("toggleView");
const exportICalButton = document.getElementById("exportICal");
const syncGoogleCalendarButton = document.getElementById("syncGoogleCalendar");

let currentDate = new Date();
let isWeeklyView = false;

function renderCalendar(date) {
  calendarElement.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("day", "empty");
    calendarElement.appendChild(emptyCell);
  }

  for (let day = 1; day <= daysInMonth; day++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.textContent = day;

    if (
      day === new Date().getDate() &&
      month === new Date().getMonth() &&
      year === new Date().getFullYear()
    ) {
      dayCell.classList.add("today");
    }

    calendarElement.appendChild(dayCell);
  }

  monthYearElement.textContent = `${year} ${date.toLocaleString("he-IL", {
    month: "long",
  })}`;
}

function renderWeeklyCalendar(date) {
  calendarElement.innerHTML = "";
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());

  for (let i = 0; i < 7; i++) {
    const dayCell = document.createElement("div");
    dayCell.classList.add("day");
    dayCell.textContent = startOfWeek.getDate();
    calendarElement.appendChild(dayCell);
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  }
}

function toggleView() {
  isWeeklyView = !isWeeklyView;
  if (isWeeklyView) {
    renderWeeklyCalendar(currentDate);
  } else {
    renderCalendar(currentDate);
  }
}

function changeMonth(offset) {
  currentDate.setMonth(currentDate.getMonth() + offset);
  if (isWeeklyView) {
    renderWeeklyCalendar(currentDate);
  } else {
    renderCalendar(currentDate);
  }
}

function syncWithGoogleCalendar() {
  let gCalUrl = `https://calendar.google.com/calendar/r/eventedit?text=אירוע+לוח+שנה&dates=${
    currentDate.toISOString().replace(/[-:]/g, "").split(".")[0]
  }/${
    new Date(currentDate.getTime() + 3600000)
      .toISOString()
      .replace(/[-:]/g, "")
      .split(".")[0]
  }`;
  window.open(gCalUrl, "_blank");
}

prevMonthButton.addEventListener("click", () => changeMonth(-1));
nextMonthButton.addEventListener("click", () => changeMonth(1));
toggleViewButton.addEventListener("click", toggleView);
exportICalButton.addEventListener("click", exportToICal);
syncGoogleCalendarButton.addEventListener("click", syncWithGoogleCalendar);

renderCalendar(currentDate);
