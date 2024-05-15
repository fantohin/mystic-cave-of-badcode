
run api_1_todolist (https://github.com/fnant/mystic-cave-of-badcode/tree/main/api_1_todolist)
(refer to readme)

serve web_tasksui_todolist:
change directory to web_tasksui_todolist project root
python -m http.server %port%
e.g. python -m http.server 8080

enter full /show todolist url into tasks-json-url form
e.g. http://localhost:8000/show
submit tasks-json-url form
view tasks

to update tasks:
refresh page
fill & submit tasks-json-url form again