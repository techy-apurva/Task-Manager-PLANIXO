const currentUser = localStorage.getItem("currentUser");

if (!currentUser) {
  window.location.href = "login.html";
}


let taskChart;

let tasks = JSON.parse(
  localStorage.getItem("tasks_" + currentUser)
) || [];


const checklist = document.querySelector(".checklist");
const newTaskBtn = document.querySelector(".newtask");

const totalCount = document.querySelector(".hor1 .count");
const completedCount = document.querySelector(".hor2 .count");
const progressCount = document.querySelector(".hor3 .count");
const overdueCount = document.querySelector(".hor4 .count");

const totalUpdate = document.querySelector(".hor1 .update");
const completedUpdate = document.querySelector(".hor2 .update");
const progressUpdate = document.querySelector(".hor3 .update");
const overdueUpdate = document.querySelector(".hor4 .update");


function saveTasks() {
  localStorage.setItem(
    "tasks_" + currentUser,
    JSON.stringify(tasks)
  );
}

function setGreeting() {
  const h = new Date().getHours();
  const gm = document.querySelector(".gm");

  const name = currentUser.split("@")[0]; // part before @(temp logic)

  if (h < 12) gm.textContent = `Good morning, ${name}!`;
  else if (h < 18) gm.textContent = `Good afternoon, ${name}!`;
  else gm.textContent = `Good evening, ${name}!`;
}

function renderTasks() {
  checklist.querySelectorAll(".task-item").forEach(item => item.remove());

  tasks.forEach((task, index) => {
    const li = document.createElement("li");
    li.classList.add("task-item");

    li.innerHTML = `
      <div class="task-row">
        <div class="left-part">
          <input type="checkbox" ${task.completed ? "checked" : ""}>
          <div class="task-text">
            <span class="task-title">${task.title}</span>
            <small class="task-due">Due: ${task.due}</small>
          </div>
        </div>
        <div class="right-part">
          <select class="priority-select"></select>
          <button class="delete-btn">✖</button>
        </div>
      </div>
    `;

    const prioritySelect = li.querySelector(".priority-select");

    if (task.completed) {
      prioritySelect.innerHTML = `<option>Completed</option>`;
      prioritySelect.value = "Completed";
      prioritySelect.className = "priority-select priority-completed";
      prioritySelect.disabled = true;
    } else {
      prioritySelect.innerHTML = `
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      `;
      prioritySelect.value = task.priority || "Low";
      prioritySelect.className =
        "priority-select priority-" + prioritySelect.value.toLowerCase();
      prioritySelect.disabled = false;
    }


    prioritySelect.addEventListener("change", () => {
      tasks[index].priority = prioritySelect.value;
      saveTasks();
      renderTasks();
    });

    li.querySelector("input").addEventListener("change", () => {
      tasks[index].completed = !tasks[index].completed;
      saveTasks();
      renderTasks();
    });

    li.querySelector(".delete-btn").addEventListener("click", () => {
      tasks.splice(index, 1);
      saveTasks();
      renderTasks();
    });

    checklist.appendChild(li);
  });

  updateStats();
  renderAnalytics();
  renderAIInsights();
  saveTasks();
  toggleUIOnTasks();
}

function updateStats() {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const inProgress = total - completed;
  const today = new Date();
today.setHours(0,0,0,0);

const overdue = tasks.filter(task => {
  if (task.completed) return false;
  if (!task.due || task.due === "No deadline") return false;

  const dueDate = new Date(task.due);
  dueDate.setHours(0,0,0,0);

  return dueDate < today;
}).length;


  totalCount.textContent = total;
  completedCount.textContent = completed;
  progressCount.textContent = inProgress;
  overdueCount.textContent = overdue;

  const lastWeekTotal = Math.max(total - 3, 0);
  const lastWeekCompleted = Math.max(completed - 2, 0);
  const lastWeekProgress = Math.max(inProgress - 1, 0);
  const lastWeekOverdue = Math.max(overdue - 1, 0);

  setUpdateText(totalUpdate, total, lastWeekTotal);
  setUpdateText(completedUpdate, completed, lastWeekCompleted);
  setUpdateText(progressUpdate, inProgress, lastWeekProgress);
  setUpdateText(overdueUpdate, overdue, lastWeekOverdue);

  setActiveTime(inProgress);
}

function setUpdateText(element, current, previous) {
  if (previous === 0 && current === 0) {
    element.textContent = "No change from last week";
    element.style.color = "#9ca3af"; // neutral gray
    return;
  }

  const percent = previous === 0
    ? 100
    : Math.round(((current - previous) / previous) * 100);

  if (percent > 0) {
    element.textContent = `+${percent}% from last week`;
    element.style.color = "#22c55e"; // green
  } else if (percent < 0) {
    element.textContent = `${percent}% from last week`;
    element.style.color = "#ef4444"; // red
  } else {
    element.textContent = "No change from last week";
    element.style.color = "#9ca3af";
  }
}


function setActiveTime(inProgress) {
  const activetime = document.querySelector(".subtitle-gm");
  activetime.textContent = `You have ${inProgress} pending tasks today.`;
}


setGreeting();
renderTasks();
toggleUIOnTasks();
const view = document.querySelector(".view");

function renderAIInsights() {

  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const highPriority = tasks.filter(t => t.priority === "High").length;

  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  const insight1 = document.getElementById("insight1");
  const insight2 = document.getElementById("insight2");
  
  const insight3 = document.getElementById("insight3");

  if (highPriority > 0) {
    insight1.innerHTML = `You have <b>${highPriority}</b> high-priority tasks. Try completing them earlier in the day.`;
  } else {
    insight1.innerHTML = `Great! No high-priority tasks pending. You're well organized.`;
  }

  if (percent >= 70) {
    insight2.innerHTML = `Excellent work! You've completed <b>${percent}%</b> of your tasks.`;
  } else if (percent >= 40) {
    insight2.innerHTML = `Good progress. You've completed <b>${percent}%</b> of tasks so far.`;
  } else {
    insight2.innerHTML = `Let's get started! Only <b>${percent}%</b> completed. You can do it!`;
  }


if (pending <= 3) {
  insight3.innerHTML = "Your workload is balanced. You're managing tasks well.";
} 
else if (pending <= 6) {
  insight3.innerHTML = "You have many pending tasks. Consider completing small tasks first.";
} 
else {
  insight3.innerHTML = "You're overloaded today. Try postponing low-priority tasks.";
}


}

//temp fake data for analysis
 function renderAnalytics() {

   const completed = tasks.filter(t => t.completed).length;
   const low = tasks.filter(t => t.priority === "Low").length;
   const medium = tasks.filter(t => t.priority === "Medium").length;
  const high = tasks.filter(t => t.priority === "High").length;

  const ctx = document.getElementById("taskChart");

   if (taskChart) taskChart.destroy();
   taskChart = new Chart(ctx, {
     type: "line",
     data: {
       labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
       datasets: [
         {
           label: "Completed",
           data: [0, 2, 4, 6, 8, 10, completed],
           borderColor: "#22c55e",
           backgroundColor: "rgba(34,197,94,0.15)",
           tension: 0.5,
           fill: true
         },
         {
           label: "Low Priority",
           data: [1, 2, 3, 4, 5, 6, low],
           borderColor: "#3b82f6",
           backgroundColor: "rgba(59,130,246,0.15)",
           tension: 0.5,
           fill: true
         },
         {
           label: "Medium Priority",
           data: [0, 1, 1, 2, 3, 4, medium],
           borderColor: "#f59e0b",
           backgroundColor: "rgba(245,158,11,0.15)",
           tension: 0.5,
           fill: true
         },
         {
           label: "High Priority",
           data: [0, 0, 1, 1, 2, 3, high],
           borderColor: "#ef4444",
           backgroundColor: "rgba(239,68,68,0.15)",
           tension: 0.5,
           fill: true
         }
       ]
     },
     options: {
      responsive: true,
       maintainAspectRatio: false,
       plugins: {
         legend: {
           position: "bottom"
         }
       },
       scales: {
        y: {
          beginAtZero: true
        }
       }
     }
   });
}

function addNewTask() {
  const title = prompt("Enter task title:");
  if (!title) return;

  const due = prompt("Enter due date(yyyy-mm-dd):");

  tasks.unshift({
    title,
    due: due || "No deadline",
    completed: false,
    priority: "Low"
  });

  saveTasks();
  renderTasks();
  renderAnalytics();
}
newTaskBtn.addEventListener("click", addNewTask);

const emptyBtns = document.getElementsByClassName("empty-btn");

Array.from(emptyBtns).forEach(btn => {
  btn.addEventListener("click", addNewTask);
});

function toggleUIOnTasks() { const taskRight = document.getElementById("taskright");
   const emptyState = document.getElementById("emptyState"); 
   const taskLeft = document.getElementById("taskleft"); 
   if (tasks.length === 0) { 
    taskRight.style.display = "none"; 
    emptyState.style.display = "block"; 
    taskLeft.style.display="none"; 
  } else { taskRight.style.display = "block"; 
    emptyState.style.display = "none"; 
    taskLeft.style.display="block";
  } 
}

const profileIcon = document.getElementById("profileIcon");
const dropdown = document.getElementById("profileDropdown");
const logoutBtn = document.getElementById("logoutBtn");

// Dropdown 
profileIcon.addEventListener("click", () => {
  dropdown.style.display =
    dropdown.style.display === "block" ? "none" : "block";
});


document.addEventListener("click", (e) => {
  if (!profileIcon.contains(e.target) &&
      !dropdown.contains(e.target)) {
    dropdown.style.display = "none";
  }
});


logoutBtn.addEventListener("click", () => {
  localStorage.removeItem("currentUser");
  window.location.href = "../login/login.html";
});

const settingsBtn = document.getElementById("settingsBtn");
const helpBtn = document.getElementById("helpBtn");

if (settingsBtn) {
  settingsBtn.addEventListener("click", () => {
    alert("⚙️ Settings are coming soon!\nWe're working on something awesome 🚀");
  });
}

if (helpBtn) {
  helpBtn.addEventListener("click", () => {
    alert("❓ Help section is coming soon!\nSupport and guides will be added soon 😊");
  });
}

