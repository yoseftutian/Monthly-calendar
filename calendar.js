const calendarElement = document.getElementById("calendar");
const monthYearElement = document.getElementById("monthYear");
const prevMonthButton = document.getElementById("prevMonth");
const nextMonthButton = document.getElementById("nextMonth");
const toggleViewButton = document.getElementById("toggleView");
const syncGoogleCalendarButton = document.getElementById("syncGoogleCalendar");

let currentDate = new Date();
let isWeeklyView = false;

function renderCalendar(date) {
  calendarElement.innerHTML = "";
  const year = date.getFullYear();
  const month = date.getMonth();

  const firstDayOfMonth = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  // Adding empty cells for the days before the first day of the month
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyCell = document.createElement("div");
    emptyCell.classList.add("day", "empty");
    calendarElement.appendChild(emptyCell);
  }

  // Adding cells for each day in the month
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

    // Event listener for adding events
    dayCell.addEventListener("click", () => {
      const eventTitle = prompt("הזן את כותרת האירוע:");
      if (eventTitle) {
        const event = document.createElement("div");
        event.classList.add("event");
        event.textContent = eventTitle;
        dayCell.appendChild(event);
        // saveEventToLocalStorage(date, day, eventTitle);
      }
    });

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

    // Highlight today's date
    if (
      startOfWeek.getDate() === new Date().getDate() &&
      startOfWeek.getMonth() === new Date().getMonth() &&
      startOfWeek.getFullYear() === new Date().getFullYear()
    ) {
      dayCell.classList.add("today");
    }

    // Event listener for adding events
    dayCell.addEventListener("click", () => {
      const eventTitle = prompt("הזן את כותרת האירוע:");
      if (eventTitle) {
        const event = document.createElement("div");
        event.classList.add("event");
        event.textContent = eventTitle;
        dayCell.appendChild(event);
        // saveEventToLocalStorage(startOfWeek, startOfWeek.getDate(), eventTitle);
      }
    });

    calendarElement.appendChild(dayCell);
    startOfWeek.setDate(startOfWeek.getDate() + 1);
  }

  monthYearElement.textContent = `${date.toLocaleString("he-IL", {
    month: "long",
  })}, ${date.getFullYear()}`;
}

function toggleView() {
  isWeeklyView = !isWeeklyView;
  toggleViewButton.textContent = isWeeklyView ? "תצוגה חודשית" : "תצוגה שבועית";

  if (isWeeklyView) {
    renderWeeklyCalendar(currentDate);
  } else {
    renderCalendar(currentDate);
  }
}

function changeMonth(offset) {
  if (isWeeklyView) {
    currentDate.setDate(currentDate.getDate() + offset * 7);
    renderWeeklyCalendar(currentDate);
  } else {
    currentDate.setMonth(currentDate.getMonth() + offset);
    renderCalendar(currentDate);
  }
}

// function saveEventToLocalStorage(date, day, eventTitle) {
//   const key = `${date.getFullYear()}-${date.getMonth()}-${day}`;
//   const events = JSON.parse(localStorage.getItem("events")) || {};

//   if (!events[key]) events[key] = [];
//   events[key].push(eventTitle);
//   localStorage.setItem("events", JSON.stringify(events));
//   console.log("Saving event:", events);
// }

function syncWithGoogleCalendar() {
  const start = currentDate.toISOString().replace(/[-:]/g, "").split(".")[0];
  const end = new Date(currentDate.getTime() + 3600000)
    .toISOString()
    .replace(/[-:]/g, "")
    .split(".")[0];
  const gCalUrl = `https://calendar.google.com/calendar/r/eventedit?text=אירוע+חדש&dates=${start}/${end}`;
  window.open(gCalUrl, "_blank");
}

prevMonthButton.addEventListener("click", () => changeMonth(-1));
nextMonthButton.addEventListener("click", () => changeMonth(1));
toggleViewButton.addEventListener("click", toggleView);
syncGoogleCalendarButton.addEventListener("click", syncWithGoogleCalendar);

// Initial render
renderCalendar(currentDate);
