let tasks = [];

function addTask() {
    let input = document.getElementById("taskInput");
    if (input.value.trim() === "") return;

    let task = {
        id: Date.now(),
        text: input.value,
        completed: false
    };
    tasks.push(task);
    input.value = "";
    renderTasks();
}

function toggleTask(id) {
    let task = tasks.find(t => t.id === id);
    task.completed = !task.completed;
    renderTasks();
}

function deleteTask(id) {
    tasks = tasks.filter(t => t.id !== id);
    renderTasks();
}

function renderTasks(filter = "all") {
    let list = document.getElementById("taskList");
    list.innerHTML = "";
    let filteredTasks = tasks.filter(task =>
        filter === "all" ||
        (filter === "active" && !task.completed) ||
        (filter === "completed" && task.completed)
    );

    filteredTasks.forEach(task => {
        let li = document.createElement("li");
        li.innerHTML = `
            <span class="${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id})">${task.text}</span>
            <button onclick="deleteTask(${task.id})">🗑</button>
        `;
        list.appendChild(li);
    });

    document.getElementById("taskSummary").innerText =
        `${tasks.filter(t => t.completed).length} / ${tasks.length} done`;
}

function filterTasks(filter) {
    document.querySelectorAll('.filters button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    renderTasks(filter);
}

// Add event listener for Enter key
document.getElementById("taskInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        addTask();
    }
});

// Dragging functionality
const container = document.getElementById("draggableContainer");
let isDragging = false;
let currentX;
let currentY;
let initialX;
let initialY;
let xOffset = 0;
let yOffset = 0;

container.addEventListener("mousedown", dragStart);
document.addEventListener("mousemove", drag);
document.addEventListener("mouseup", dragEnd);

function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;

    if (e.target === container || e.target.closest(".drag-handle")) {
        isDragging = true;
    }
}

function drag(e) {
    if (isDragging) {
        e.preventDefault();

        currentX = e.clientX - initialX;
        currentY = e.clientY - initialY;

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, container);
    }
}

function dragEnd(e) {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
}

function setTranslate(xPos, yPos, el) {
    el.style.transform = `translate(${xPos}px, ${yPos}px)`;
}

// Center the container initially
window.addEventListener('load', () => {
    const centerX = (window.innerWidth - container.offsetWidth) / 2;
    const centerY = (window.innerHeight - container.offsetHeight) / 2;
    setTranslate(centerX, centerY, container);
    xOffset = centerX;
    yOffset = centerY;
});