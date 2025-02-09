// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

// Todo: create a function to generate a unique task id
function generateTaskId() {
    return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
    const taskCard = `
    <div class="task-card card p-2 mb-2 shadow-sm" id="task-${task.id}" data-id="${task.id}">
        <h5 class="card-title">${task.title}</h5>
        <p class="card-text text-muted">Due: ${dayjs(task.dueDate).format("MM/DD/YYYY")}</p>
        <button class="btn btn-danger btn-sm delete-btn" data-id="${task.id}">
            <i class="fas fa-trash-alt"></i> Delete
        </button>
    </div>
`;
    return taskCard;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
    // Clear existing task cards in the columns
    $("#todo-cards, #in-progress-cards, #done-cards").empty();

    taskList.forEach(task => {
        // Color-code based on due date
        const taskCard = createTaskCard(task);
        const dueDate = dayjs(task.dueDate);
        const today = dayjs();
        const daysLeft = dueDate.diff(today, "days");

        let cardClass = "";
        if (daysLeft < 0) {
            cardClass = "bg-danger text-white"; // Overdue tasks
        } else if (daysLeft <= 3) {
            cardClass = "bg-warning text-dark"; // Nearing deadline tasks
        }

        $(`#${task.status}-cards`).append(
            $(taskCard).addClass(cardClass)
        );
    });

    // Make task cards draggable
    $(".task-card").draggable({
        revert: "invalid",
        cursor: "move",
        zIndex: 100,
        helper: "clone",
        start: function (event, ui) {
            $(this).addClass("dragging");
        },
        stop: function (event, ui) {
            $(this).removeClass("dragging");
        }
    });

    // Handle task deletion
    $(".delete-btn").off("click").on("click", function () {
        handleDeleteTask($(this).data("id"));
    });
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
    event.preventDefault();

    const title = $("#task-title").val().trim();
    const dueDate = $("#task-due-date").val().trim();

    if (!title || !dueDate || !dayjs(dueDate, "YYYY-MM-DD", true).isValid()) {
        alert("Please enter a valid task title and select a due date.");
        return;
    }

    const newTask = {
        id: generateTaskId(),
        title,
        dueDate: dayjs(dueDate).format("YYYY-MM-DD"),
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
function handleDeleteTask(taskId) {
    taskList = taskList.filter(task => task.id !== taskId);
    localStorage.setItem("tasks", JSON.stringify(taskList));

    renderTaskList();
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
    const taskId = parseInt(ui.helper.attr("data-id"));
    const newStatus = $(event.target).closest(".lane").attr("id").split("-")[0];

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

    taskList = JSON.parse(localStorage.getItem("tasks")) || [];
    nextId = JSON.parse(localStorage.getItem("nextId")) || 1;

    renderTaskList();

    $(".lane .card-body").droppable({
        accept: ".task-card",
        tolerance: "pointer",
        drop: handleDrop
    });

    $("#add-task-form").on("submit", handleAddTask);
});