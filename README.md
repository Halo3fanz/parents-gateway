# Parents' Gateway
A set of NodeJS API endpoints that helps teachers manage administrative functions of their students.

## Requirements

* Node 8
* MySQL

### Dependencies

* Body-parser
* Express
* Morgan
* MySQL
* Jest (unit testing)
* nodemon
* supertest

## Setup

Clone the repo and install the dependencies. Then establish a local MySQL database using the pg.sql file. To run the app, use the command:

```bash
npm run start
```
The app will run on [http://localhost:3000](http://localhost:3000) and connect to a MySQL database.

## Testing

After setup, running the unit tests can be accomplished with the command:

```bash
npm run test
```

## Registering Students
Teachers are able to register one or more students to their classes. Students can be registered to multiple teachers.

* Endpoint: `POST /api/register`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 204
* Request body example:
```
{
  "teacher": "teacherken@gmail.com"
  "students":
    [
      "studentjon@gmail.com",
      "studenthon@gmail.com"
    ]
}
```

## Getting Common Students
One or more teachers can get a list of students that are registered to their common classes regardless if they are suspended or not.
### Single Class
A teacher can get a list of all students in his class.

* Endpoint: `GET /api/commonstudents`
* Success response status: HTTP 200
* Request example: `GET /api/commonstudents?teacher=teacherken%40gmail.com`
* Success response body:
```
{
  "students" :
    [
      "commonstudent1@gmail.com", 
      "commonstudent2@gmail.com",
      "student_only_under_teacher_ken@gmail.com"
    ]
}
```

### Muliple Classes
Multiple teachers can retrieve a list of students common to their classes.

* Request example: `GET /api/commonstudents?teacher=teacherken%40gmail.com&teacher=teacherjoe%40gmail.com`
* Success response body:
```
{
  "students" :
    [
      "commonstudent1@gmail.com", 
      "commonstudent2@gmail.com"
    ]
}
```

## Suspending Students
Teachers can suspend a specified student.

* Endpoint: `POST /api/suspend`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 204
* Request body example:
```
{
  "student" : "studentmary@gmail.com"
}
```

## Viewing Students Who Are Able To Be Notified
Teachers can retrieve a list of students who are able to receive a specified notification.
A notification consists of:
* the teacher who is sending the notification, and
* the text of the notification itself.

To receive notifications from e.g. 'teacherken@gmail.com', a student:
* MUST NOT be suspended,
* AND MUST fulfill *AT LEAST ONE* of the following:
    1. is registered with “teacherken@gmail.com"
    2. has been @mentioned in the notification

* Endpoint: `POST /api/retrievefornotifications`
* Headers: `Content-Type: application/json`
* Success response status: HTTP 200
* Request body example 1:
```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hello students! @studentagnes@gmail.com @studentmiche@gmail.com"
}
```
* Success response body 1:
```
{
  "recipients":
    [
      "studentbob@gmail.com",
      "studentagnes@gmail.com", 
      "studentmiche@gmail.com"
    ]   
}
```
In the example above, studentagnes@gmail.com and studentmiche@gmail.com can receive the notification from teacherken@gmail.com, regardless whether they are registered to him, because they are @mentioned in the notification text. studentbob@gmail.com however, has to be registered to teacherken@gmail.com.
* Request body example 2:
```
{
  "teacher":  "teacherken@gmail.com",
  "notification": "Hey everybody"
}
```
* Success response body 2:
```
{
  "recipients":
    [
      "studentbob@gmail.com"
    ]   
}
```
