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
        <div class="task-card" id="task-${task.id}" data-id="${task.id}" draggable="true">
            <h5>${task.title}</h5>
            <p>Due: ${task.dueDate}</p>
            <button class="delete-btn" onclick="handleDeleteTask(${task.id})">Delete</button>
        </div>
    `;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    $(".task-lane").empty();
    
    taskList.forEach(task => {
        $(`#${task.status}`).append(createTaskCard(task));
    });

    $(".task-card").draggable({
        revert: "invalid",
        helper: "clone",
        cursor: "move"
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event){
    event.preventDefault();

    const title = $("#task-title").val();
    const dueDate = $("#task-due-date").val();
    
    if (!title || !dueDate) {
        alert("Please enter a task title and due date.");
        return;
    }

    const newTask = {
        id: generateTaskId(),
        title,
        dueDate,
        status: "to-do"
    };

    taskList.push(newTask);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    localStorage.setItem("nextId", JSON.stringify(nextId));

    renderTaskList();
    $("#task-title").val("");
    $("#task-due-date").val("");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event){

}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {

}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {

});