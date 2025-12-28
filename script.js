/********************
 * GLOBAL DATE STATE
 ********************/
const today = new Date();
today.setHours(0, 0, 0, 0);

let selectedDate = new Date(today);

/********************
 * CONFIG
 ********************/
const DAYS = 90;

const habits = [
  { name: "&#128694; 10 mins walk", color: "yellow" },      // 🚶
  { name: "&#129496; 5 mins meditation", color: "green" }, // 🧘
  { name: "&#129504; Aptitude", color: "red" },             // 🧠
  { name: "&#128187; DSA", color: "blue" },                 // 💻
  { name: "&#128214; 3 pages reading", color: "purple" },   // 📘
  { name: "&#128167; 1 litre water", color: "cyan" }        // 💧
];


/********************
 * DATE RANGE
 ********************/
// First box = 89 days ago, last box = today
const startDate = new Date(today);
startDate.setDate(today.getDate() - (DAYS - 1));

/********************
 * TOP DATE TEXT
 ********************/
document.getElementById("date").innerText = today.toDateString();

/********************
 * WEEK CIRCLES
 ********************/
const weekContainer = document.getElementById("week");

function renderWeek() {
  weekContainer.innerHTML = "";

  const weekStart = new Date(selectedDate);
  weekStart.setDate(selectedDate.getDate() - selectedDate.getDay());

  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    d.setHours(0, 0, 0, 0);

    const circle = document.createElement("div");
    circle.innerText = ["S", "M", "T", "W", "T", "F", "S"][i];

    if (d.getTime() === today.getTime()) {
      circle.classList.add("today-circle");
    }

    if (d.getTime() === selectedDate.getTime()) {
      circle.classList.add("active-circle");
    }

    circle.onclick = () => {
      selectedDate = new Date(d);
      renderWeek();
    };

    weekContainer.appendChild(circle);
  }
}

renderWeek();

/********************
 * HABITS
 ********************/
const container = document.getElementById("habits");

habits.forEach(habit => {
  const habitName = habit.name;
  const habitColor = habit.color;
  const id = habitName.replace(/\s+/g, "_");

  const habitDiv = document.createElement("div");
  habitDiv.className = `habit ${habitColor}`;

  habitDiv.innerHTML = `
    <div class="habit-row">
      <div>
        <div class="habit-title">${habitName}</div>
        <div class="streak" id="${id}-streak">Streak: 0</div>
      </div>
      <button class="tick-btn">&#10003;</button>
    </div>
    <div class="grid"></div>
  `;

  const grid = habitDiv.querySelector(".grid");
  const tickBtn = habitDiv.querySelector(".tick-btn");
  const streakText = habitDiv.querySelector(".streak");

  let saved = JSON.parse(localStorage.getItem(id)) || [];

  /********************
   * CREATE CELLS
   ********************/
  for (let i = 0; i < DAYS; i++) {
    const cell = document.createElement("div");
    cell.className = "cell";
    if (saved[i]) cell.classList.add("done");

    cell.onclick = () => {
      selectedDate = new Date(startDate);
      selectedDate.setDate(startDate.getDate() + i);
      renderWeek();

      cell.classList.toggle("done");
      save();
      updateStreak();
    };

    grid.appendChild(cell);
  }

  const cells = grid.querySelectorAll(".cell");

  /********************
   * SAVE
   ********************/
  function save() {
    localStorage.setItem(
      id,
      JSON.stringify([...cells].map(c => c.classList.contains("done")))
    );
  }

  /********************
   * STREAK
   ********************/
  function updateStreak() {
    let s = 0;
    for (let i = cells.length - 1; i >= 0; i--) {
      if (cells[i].classList.contains("done")) s++;
      else break;
    }
    streakText.innerText = `Streak: ${s}`;
  }

  /********************
   * TICK BUTTON
   ********************/
  tickBtn.onclick = () => {
    const diffDays = Math.floor(
      (selectedDate - startDate) / (1000 * 60 * 60 * 24)
    );

    if (diffDays >= 0 && diffDays < DAYS) {
      cells[diffDays].classList.add("done");
      save();
      updateStreak();
    }
  };

  updateStreak();
  container.appendChild(habitDiv);
});
