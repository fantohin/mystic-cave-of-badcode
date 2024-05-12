import http.server
import socketserver
from urllib.parse import parse_qs
import json
from datetime import datetime
    
class CustomRequestHandler(http.server.BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == '/show':
            print("/show POST. Return tasklist>>>>")
                        
            try:
                # Открываем файл для чтения
                with open('tasks.json', 'r') as f:
                    # Читаем JSON данные из файла
                    all_tasks = json.load(f)  
            except:
                # Файла нет
                print("no tasks.json to load tasks from")
                all_tasks = []
            
            # Handle POST request for /add
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(json.dumps(all_tasks).encode())
            #self.wfile.write(b'POST request received on /show')
        
        
        elif self.path == '/add':
            print("/add POST. Add new task>>>>")
            content_length = int(self.headers['Content-Length'])
            new_task_data = parse_qs(self.rfile.read(content_length).decode())
        
            # Дебаг
            task_title = new_task_data['task_description']
            print(f"new task description: {task_title}")
            
            try:
                # Открываем файл для чтения
                with open('tasks.json', 'r') as f:
                    # Читаем JSON данные из файла
                    all_tasks = json.load(f)  
            except:
                # Файла нет
                print("no tasks.json to load tasks from")
                all_tasks = []
            
            # Подсчет количества объектов в массиве
            prev_tasks_count = len(all_tasks)
            print(f"task count before new one: {prev_tasks_count}")
            print(f"tasks before new one: {all_tasks}")
            
            # Добавляем новую задачу в массив
            new_task_data['id'] = prev_tasks_count
            new_task_data['task_done_level'] = 0
            new_task_data['creation_time'] = datetime.now().isoformat()
            all_tasks.append(new_task_data)
            tasks_count = len(all_tasks)
            print(f"task count after new one: {tasks_count}")
            
            # Сохранение задач
            with open("tasks.json", "w") as f:
                json.dump(all_tasks, f)
            
            # Handle POST request for /add
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            #self.wfile.write(b'POST request received on /add')
            
        elif self.path == '/set':
            print("/set POST. Changing task>>>>")
            content_length = int(self.headers['Content-Length'])
            set_task_data = parse_qs(self.rfile.read(content_length).decode())
        
            task_id = set_task_data['task_id'][0]
            print(f"change task with id: {task_id}")
            
            task_done_level = set_task_data['task_done_percentage'][0]
            task_priority = set_task_data['task_priority'][0]
            
            try:
                # Открываем файл для чтения
                with open('tasks.json', 'r') as f:
                    # Читаем JSON данные из файла
                    all_tasks = json.load(f)  
            except:
                # Файла нет
                print("no tasks.json to load tasks from")
                all_tasks = []
            
            # Ищем словарь с заданным id
            for item in all_tasks:
                if item.get("id") == int(task_id):
                    print(f"Задача до изменения: {item}")
                    if int(task_done_level) >= 0:
                        item['task_done_level'] = task_done_level
                    if int(task_priority) >= 0:
                        item['task_priority'] = task_priority
                    
                    print(f"Сохраняем tasks.json изменив задачу: {item}")
                    # Сохранение задач
                    with open("tasks.json", "w") as f:
                        json.dump(all_tasks, f)

                    # Handle POST request for /add
                    self.send_response(200)
                    self.send_header('Content-type', 'text/html')
                    self.end_headers()                        
                    
                    
                    break # Прерываем цикл после нахождения первого совпадения
            else:
                print("Словарь с заданным id не найден")

                # Handle POST request for /add
                self.send_response(400) #not sure TO_DO
                self.send_header('Content-type', 'text/html')
                self.end_headers()
            
            #self.wfile.write(b'POST request received on /set')
        else:
            # Handle other paths or return a 404
            self.send_response(404)
            self.end_headers()
            
    def do_GET(self):
        if self.path == '/':
            # Handle GET request for /
            self.send_response(200)
            self.send_header('Content-type', 'text/html')
            self.end_headers()
            self.wfile.write(b'GET request received on /')
            # Open the file
            with open('overview.html', 'rb') as file: 
                self.wfile.write(file.read()) # Read the file and send the contents 
        else:
            # Handle other paths or return a 404
            self.send_response(404)
            self.end_headers()

PORT = 8000
Handler = CustomRequestHandler
httpd = socketserver.TCPServer(("", PORT), Handler)
print("Serving on port", PORT)
httpd.serve_forever()