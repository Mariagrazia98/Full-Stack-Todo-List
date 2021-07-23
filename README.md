# FULL STACK TODO LIST

## Team name: Web lasagne

Team members:

- s281660 Diego Marino
- s289917 Federico Raimondi
- s290393 Mariagrazia Paladino
- s269792 Veronica Puggioni

## Instructions

## Users credentials

email: lasagne@polito.it
name: WebLasagne
password: weblasagne

email: carbonara@polito.it
name: WebCarbonara
password: webcarbonara 


email: arancina@polito.it
name: WebArancina
password: webarancina

## List of APIs offered by the server

Provide a short description for API with the required parameters, follow the proposed structure.

- [HTTP Method] [URL, with any parameter]
- [One-line about what this API is doing]
- [Sample request, with body (if any)]
- [Sample response, with body (if any)]
- [Error responses, if any]

## APIs

Hereafter, we report the designed HTTP APIs, also implemented in the project.

### **List all TASKS**

URL: `/api/tasks` or `/api/tasks/?filter=all`

Method: GET

Description: Get all tasks.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

```
[{
    "id": 1,
    "description": "Complete a lab",
    "important": true,
    "private": true,
    "deadline": "2021-02-01",
    "completed": false,
    "user": 1
},
 {  "id": 3,
    "description": "Phone call",
    "important": false,
    "private": true,
    "deadline": undefined,
    "completed": false,
    "user": 1
 }
...
]
```

### **Filter TASKS**

URL: `/api/tasks/?key=value`

Method: GET

Description: Filter tasks with query params. The available key-value params are listed in details below.

#### **List all IMPORTANT TASKS**

URL: `/api/tasks/?filter=important`

Method: GET

Query params key: `filter`

Query params value: `important`

Description: Get all tasks marked as important.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

```
[{
    "id": 1,
    "description": "Complete a lab",
    "important": true,
    "private": true,
    "deadline": "2021-02-01"
    "completed": false,
    "user": 1
},
 {  "id": 2,
    "description": "Water plants",
    "important": true,
    "private": false,
    "deadline": undefined,
    "completed": false,
    "user": 1
 }
...
]
```

#### **List PRIVATE TASKS**

URL: `/api/tasks/?filter=private`

Method: GET

Query params key: `filter`

Query params value: `private`

Description: Get all tasks marked as private.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

```
[{
    "id": 1,
    "description": "Complete a lab",
    "important": true,
    "private": true,
    "deadline": "2021-02-01"
    "completed": false,
    "user": 1
},
 {  "id": 4,
    "description": "Pay bills",
    "important": false,
    "private": true,
    "deadline": undefined,
    "completed": false,
    "user": 1
 }
...
]
```

#### **List COMPLETED TASKS**

URL: `/api/tasks/?filter=completed`

Method: GET

Query params key: `filter`

Query params value: `completed`

Description: Get all tasks marked as completed.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

```
[{
    "id": 1,
    "description": "Complete a lab",
    "important": true,
    "private": true,
    "deadline": "2021-02-01"
    "completed": false,
    "user": 1
},
 {  "id": 4,
    "description": "Pay bills",
    "important": false,
    "private": true,
    "deadline": undefined,
    "completed": false,
    "user": 1
 }
...
]
```

#### **List all TASKS of the NEXT 7 DAYS**

URL: `/api/tasks/?filter=next7days`

Method: GET

Query params key: `filter`

Query params value: `next7days`

Description: Get all tasks with a deadline in the next 7 days.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

```
[{
    "id": 1,,
    "description": "Complete a lab",
    "important": true,
    "private": true,
    "deadline": "2021-02-01"
    "completed": false,
    "user": 1
},
 {  "id": 17,
    "description": "Pay bills",
    "important": false,
    "private": true,
    "deadline": "2021-02-04",
    "completed": false,
    "user": 1
 }
...
]
```

#### **List TASKS with a given DEADLINE**

URL: `/api/tasks/?filter=deadline&date=YYYY-MM-DD`

Method: GET

Query params key 1: `filter`

Query params value 1: `deadline`

Query params key 2: `date`

Query params value 2: `YYYY-MM-DD`

Description: Get all tasks with a given deadline. The date must be in ISO 8601 format.

Request body: _None_

Response: `200 OK` (success) or `500 Internal Server Error` (generic error).

Response body: An array of objects, each describing a task.

`Example URL: /api/tasks/?filter=deadline&date=2021-02-01`

```
[{
    "id": 1,
    "description": "Complete a lab",
    "important": true,
    "private": true,
    "deadline": "2021-02-01"
    "completed": false,
    "user": 1
},
 {  "id": 7,
    "description": "Pay bills",
    "important": false,
    "private": true,
    "deadline": "2021-02-01",
    "completed": false,
    "user": 1
 }
...
]
```

### **Get TASK with a given ID**

URL: `/api/tasks/:taskID`

Method: GET

Description: Get task with a given ID.

Request body: _None_

Response: `200 OK` (success), `404 Not Found` (task not found), `500 Internal Server Error` (generic error).

Response body: A task object.

`Example URL: /api/tasks/1`

```
{
    "id": 1,,
    "description": "Complete a lab",
    "important": true,
    "private": true,
    "deadline": "2021-02-01"
    "completed": false,
    "user": 1;
}
```

### **Add new Task**

URL: `/api/tasks`

Method: POST

Description: Add new Task.

Request body: An object representing the new task (Content-Type: application/json).

```
{
    "description": "Complete a lab",
    "important": true,
    "private": true,
    "deadline": "2021-02-01"
    "completed": false,
    "user": 1;
}
```

Response: `201 Created` (success), `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

`Example URL: /api/tasks`

### **Modify "completed" field of a TASK with a given ID**

URL: `/api/tasks?completeTaskID=<taskID>`

Method: PUT

Description: Update the column "completed" of an existing task, identified by its id.

Request body: An object representing the new value of completed (Content-Type: application/json).

```
{
    "isCompleted": 1,
}
```

Response: `200 OK` (success), `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

`Example URL: /api/tasks?completeTaskID=6`

### **Update a TASK with a given ID**

URL: `/api/tasks/:taskID`

Method: PUT

Description: Update the columns of an existing task, identified by its id.

Request body: An object representing the updated task (Content-Type: application/json).

```
{
    "description": "Complete a lab",
    "important": false,
    "private": true,
    "deadline": "2021-02-01"
    "completed": false,
    "user": 1;
}
```

Response: `200 OK` (success), `503 Service Unavailable` (generic error). If the request body is not valid, `422 Unprocessable Entity` (validation error).

Response body: _None_

`Example URL: /api/tasks/6`

### **Delete TASK with a given ID**

URL: `/api/tasks/:taskID`

Method: DELETE

Description: delete task with a given ID.

Request body: _None_

Response: `204 No Content` (success), `503 Service Unavailable` (generic error).

Response body: _None_

`Example URL: /api/tasks/1`


### **LOGIN**

URL: `/api/sessions`

Method: POST

Description: Login
Request body: An object representing credential user(Content-Type: application/json).

```
{
    "username": lasagne@polito.it;
    "password": weblasagne;
}
```
Response: `401 Unauthorized` (user not authenticated), `200 OK` (user authenticated).

Response body: 
```
{
    "id": "1",
    "name": "WebLasagne",
    "email": lasagne@polito.it,
}
```
`Example URL: api/sessions`

### **LOGOUT**

URL: `/api/sessions/current`

Method: DELETE

Description: logout

Request body: _None_

Response:  _None_

Response body: _None_
`Example URL: api/sessions/current`

### **Get UserInfo**

URL: `api/sessions/current`

Method: GET

Description: Get the information about the user: "id", "email" and "name".

Request body: _None_

Response: `200 OK` (success), `401 Unauthorized` (fail).

Response body: A task object.

`Example URL: api/sessions/current`

```
{
    "id": 1,
    "name": "WebLasagne",
    "email": "lasagne@polito.it"
}
```
