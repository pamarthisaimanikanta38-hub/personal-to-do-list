// LocalStorage Key & Initial Default Tasks
const KEY = "personal_todo_tasks";
const DEFAULT_TASKS = [
  { id: "1", name: "Complete Python Assignment", cat: "Study", priority: "High", status: "Pending" },
  { id: "2", name: "Buy Groceries", cat: "Personal", priority: "Medium", status: "Completed" },
  { id: "3", name: "Workout at Gym", cat: "Health", priority: "Low", status: "Pending" }
];

let tasks = JSON.parse(localStorage.getItem(KEY)) || DEFAULT_TASKS;
const save = () => localStorage.setItem(KEY, JSON.stringify(tasks));

// DOM Elements
const f = document.getElementById("task-form"),
      tId = document.getElementById("task-id"),
      tName = document.getElementById("task-name"),
      tCat = document.getElementById("task-cat"),
      tPri = document.getElementById("task-priority"),
      tSta = document.getElementById("task-status"),
      subBtn = document.getElementById("sub-btn"),
      cancelBtn = document.getElementById("cancel-btn"),
      tbody = document.getElementById("task-tbody"),
      noTask = document.getElementById("no-task"),
      search = document.getElementById("search"),
      fCat = document.getElementById("filter-cat"),
      fPri = document.getElementById("filter-priority"),
      fSta = document.getElementById("filter-status");

// Render Tasks to Table
function render() {
  const q = search.value.trim().toLowerCase();
  const list = tasks.filter(t => 
    t.name.toLowerCase().includes(q) &&
    (fCat.value === "all" || t.cat === fCat.value) &&
    (fPri.value === "all" || t.priority === fPri.value) &&
    (fSta.value === "all" || t.status === fSta.value)
  );

  noTask.style.display = list.length ? "none" : "block";
  tbody.innerHTML = list.map(t => `
    <tr>
      <td>${t.name}</td>
      <td>${t.cat}</td>
      <td><span class="badge ${t.priority === 'High' ? 'bg-high' : 'bg-green'}">${t.priority}</span></td>
      <td><span class="badge ${t.status === 'Pending' ? 'bg-pending' : 'bg-green'}">${t.status}</span></td>
      <td>
        <button class="act-btn act-edit" onclick="editTask('${t.id}')">Edit</button>
        <button class="act-btn act-del" onclick="delTask('${t.id}')">Delete</button>
      </td>
    </tr>
  `).join("");
}

// Add or Update Task
f.onsubmit = (e) => {
  e.preventDefault();
  const name = tName.value.trim();
  if (!name) return alert("Please enter task name!");

  if (tId.value) {
    const t = tasks.find(x => x.id === tId.value);
    if (t) Object.assign(t, { name, cat: tCat.value, priority: tPri.value, status: tSta.value });
  } else {
    tasks.unshift({ id: Date.now().toString(), name, cat: tCat.value, priority: tPri.value, status: tSta.value });
  }
  save(); resetForm(); render();
};

// Edit, Cancel, Delete Operations
window.editTask = (id) => {
  const t = tasks.find(x => x.id === id);
  if (!t) return;
  tId.value = t.id; tName.value = t.name; tCat.value = t.cat; tPri.value = t.priority; tSta.value = t.status;
  subBtn.textContent = "Update Task"; cancelBtn.style.display = "inline-block";
};

function resetForm() {
  f.reset(); tId.value = ""; tPri.value = "Medium"; tSta.value = "Pending";
  subBtn.textContent = "Add Task"; cancelBtn.style.display = "none";
}
cancelBtn.onclick = resetForm;

window.delTask = (id) => {
  if (confirm("Are you sure you want to delete this task?")) {
    tasks = tasks.filter(x => x.id !== id);
    if (tId.value === id) resetForm();
    save(); render();
  }
};

// Search & Filter Events
[search, fCat, fPri, fSta].forEach(el => el.oninput = render);
document.getElementById("reset-btn").onclick = () => {
  search.value = ""; fCat.value = fPri.value = fSta.value = "all"; render();
};

render();
