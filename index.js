const express = require('express');
const courses = require('./courses.json');
const fs = require('fs');
const path = require('path');

const server = express();

server.use(express.json());

function response (res, message, error, statusCode) {
    res.status(statusCode || 200).send({
        error: error,
        message: message
    });
}

server.get('/courses', (req, res) => {
    response(res, courses, '');
});

server.post('/courses', (req, res) => {
    const course = req.body;

    if (
        !course.name ||
        !course.price ||
        !course.description ||
        !course.instructor ||
        !course.date
    ) {
        response(res, '', 'Missing data', 400);
        return;
    }
    courses.push({id: courses.length + 1, ...course});

    //Write changes in file
    fs.writeFileSync(path.join(__dirname, 'courses.json'), JSON.stringify(courses));

    response(res, 'Crouse created', '');
});


server.get('/courses/:id', (req, res) => {
    try {
        const id = req.params.id;
        let foundCourse = null;
        courses.forEach((course) => {
            if (Number(id) === course.id) {
                foundCourse = course;
            }
        });
        if (foundCourse === null) {
            response(res, '', 'Course not found', 404);
            return;
        }
        response(res, foundCourse, '');
    } catch (error) {
        response(res, '', error, 500);
    }
});

server.listen(3000, () => {
    console.log('Listening on http://localhost:3000');
});
