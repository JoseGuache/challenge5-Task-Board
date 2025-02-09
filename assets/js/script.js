// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    return `
        <div class="task-card card p-2 mb-2 shadow-sm" id="task-${task.id}" data-id="${task.id}">
            <h5 class="card-title">${task.title}</h5>
            <p class="card-text text-muted">Due: ${task.dueDate}</p>
            <button class="btn btn-danger btn-sm" onclick="handleDeleteTask(${task.id})">
                <i class="fas fa-trash-alt"></i>
            </button>
        </div>
    `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $("#todo-cards, #in-progress-cards, #done-cards").empty();
    
    taskList.forEach(task => {
        $(`#${task.status}-cards`).append(createTaskCard(task));
    });

    // Make task cards draggable
    $(".task-card").draggable({
        revert: "invalid",
        helper: "clone",
        cursor: "move"
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const title = $("#task-title").val().trim();
    const dueDate = $("#task-due-date").val().trim();
    
    if (!title || !dueDate) {
        alert("Please enter a task title and select a due date.");
        return;
    }

    const newTask = {
        id: generateTaskId(),
        title,
        dueDate,
        status: "todo"
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    renderTaskList();
    
    // Reset form and close modal
    $("#add-task-form")[0].reset();
    $("#formModal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(taskId){
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = $(ui.draggable).data("id");
    const newStatus = event.target.id.replace("-cards", ""); // Match status format

    taskList = taskList.map(task => {
        if (task.id === taskId) {
            task.status = newStatus;
        }
        return task;
    });

    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
    renderTaskList();

    $(".task-lane .card-body").droppable({
        accept: ".task-card",
        drop: handleDrop
    });

    $("#add-task-form").on("submit", handleAddTask);
    
    $("#task-due-date").datepicker({
        dateFormat: "mm/dd/yy"
    });
});