document.addEventListener("DOMContentLoaded", () => {
  const taskInput = document.getElementById("taskInput");
  const addTaskBtn = document.getElementById("addTaskBtn");
  const taskList = document.getElementById("taskList");
  const taskCount = document.getElementById("taskCount");
  const clearCompletedBtn = document.getElementById("clearCompleted");
  const filterButtons = document.querySelectorAll(".filter-btn");

  let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
  let currentFilter = "all";

  // Initialize the app
  function init() {
    renderTasks();
    updateTaskCount();
    addEventListeners();
  }

  // Add event listeners
  function addEventListeners() {
    addTaskBtn.addEventListener("click", addTask);
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") addTask();
    });
    clearCompletedBtn.addEventListener("click", clearCompleted);

    filterButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        filterButtons.forEach((b) => b.classList.remove("active"));
        btn.classList.add("active");
        currentFilter = btn.dataset.filter;
        renderTasks();
      });
    });
  }

  // Add a new task
  function addTask() {
    const taskText = taskInput.value.trim();
    if (taskText === "") return;

    const newTask = {
      id: Date.now(),
      text: taskText,
      completed: false,
    };

    tasks.push(newTask);
    saveTasks();
    renderTasks();
    taskInput.value = "";
    taskInput.focus();
    updateTaskCount();
  }

  // Toggle task completion
  function toggleTask(id) {
    tasks = tasks.map((task) =>
      task.id === id ? { ...task, completed: !task.completed } : task
    );
    saveTasks();
    renderTasks();
    updateTaskCount();
  }

  // Delete a task
  function deleteTask(id, e) {
    e.stopPropagation();
    tasks = tasks.filter((task) => task.id !== id);
    saveTasks();
    renderTasks();
    updateTaskCount();
  }

  // Clear completed tasks
  function clearCompleted() {
    tasks = tasks.filter((task) => !task.completed);
    saveTasks();
    renderTasks();
    updateTaskCount();
  }

  // Filter tasks based on current filter
  function getFilteredTasks() {
    switch (currentFilter) {
      case "active":
        return tasks.filter((task) => !task.completed);
      case "completed":
        return tasks.filter((task) => task.completed);
      default:
        return tasks;
    }
  }

  // Render tasks to the DOM
  function renderTasks() {
    const filteredTasks = getFilteredTasks();

    taskList.innerHTML = filteredTasks
      .map(
        (task) => `
            <li class="task-item ${task.completed ? "completed" : ""}" 
                onclick="toggleTask(${task.id})">
                <input type="checkbox" class="task-checkbox" 
                    ${task.completed ? "checked" : ""} 
                    onchange="toggleTask(${task.id})">
                <span class="task-text">${task.text}</span>
                <button class="delete-btn" 
                    onclick="deleteTask(${task.id}, event)">❌</button>
            </li>
        `
      )
      .join("");
  }

  // Update the task count
  function updateTaskCount() {
    const activeTasks = tasks.filter((task) => !task.completed).length;
    taskCount.textContent = `${activeTasks} ${
      activeTasks === 1 ? "item" : "items"
    } left`;
  }

  // Save tasks to localStorage
  function saveTasks() {
    localStorage.setItem("tasks", JSON.stringify(tasks));
  }

  // Make functions available globally for inline event handlers
  window.toggleTask = toggleTask;
  window.deleteTask = deleteTask;

  // Initialize the app
  init();
});
