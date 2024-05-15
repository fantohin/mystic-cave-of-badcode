Date.prototype.addDays = function(days) {
    var date = new Date(this.valueOf());
    date.setDate(date.getDate() + days);
    return date;
}


document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('task-form');
    taskForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting normally

        const tasksJsonUrl = taskForm.elements['tasks-json-url'].value;

        if (tasksJsonUrl) {
            const formData = new FormData();
            // Example: Add a field to the form data
            // formData.append('key', 'value');

            fetch(tasksJsonUrl, {
                method: 'POST',
                body: formData
            })
           .then(response => response.json())
           .then(data => {
                const taskContainer = document.getElementById('task-container');
                const completedTaskContainer = document.getElementById('completed-task-container');
                const tasks = data.sort((a, b) => {
                    const priorityA = parseInt(a.task_priority, 10);
                    const priorityB = parseInt(b.task_priority, 10);
                    if (priorityA!== priorityB) {
                        return priorityB - priorityA;
                    }
                    const creationTimeA = new Date(a.creation_time);
                    const creationTimeB = new Date(b.creation_time);
                    return creationTimeA.getTime() - creationTimeB.getTime();
                });

                const lastDisplayedPriority = {};
                let taskGroup = null;
                tasks.forEach((task, index) => {
                    if (!lastDisplayedPriority[task.task_priority]) {
                        if (taskGroup) taskContainer.appendChild(taskGroup);
                        taskGroup = document.createElement('div');
                        taskGroup.classList.add('task-group');
                        taskGroup.innerHTML = `<h3>${task.task_priority}</h3>`;
                        lastDisplayedPriority[task.task_priority] = true;
                    }

                    const taskElement = document.createElement('div');
                    const taskShortDate = new Date(task.creation_time);
                    const taskShortDoByDate = new Date(task.creation_time).addDays(Number(task.task_days[0]));
                    const taskHoursLeft = Math.abs(taskShortDoByDate.getTime() - new Date().getTime()) / 36e5;
                    taskElement.classList.add('task');
                    taskElement.innerHTML = `<span class="task-title">${task.task_description}, ${taskHoursLeft.toFixed(1)}ч</span><br><span class="task-details">Сделать до: ${taskShortDoByDate.toLocaleDateString("en-US")}, Созданно: ${taskShortDate.toLocaleDateString("en-US")}, Сделанно на: ${Number(task.task_done_level)}</span>`;

                    if (task.task_done_level < 100) {
                        taskGroup.appendChild(taskElement);
                        if (index === tasks.length - 1) taskContainer.appendChild(taskGroup);
                    } else {
                        completedTaskContainer.appendChild(taskElement);
                    }
                });
            })
           .catch(error => console.error('Error fetching tasks:', error));
        } else {
            console.log("No URL provided.");
        }
    });
});
