const express = require('express');

const server = express();
server.use(express.json());

const projects = [
    {
        id: '1',
        title: 'My Project',
        tasks: ['task 01'],
    },
];

let requestCounter = 0;

function findProjectIndex(req, res, next) {
    const { id } = req.params;
    const project = projects.find((proj) => {
        return proj.id === id;
    });

    if (!project) {
        return res.status(400).json({ error: 'Project not found' });
    }

    const projectIndex = projects.indexOf(project);

    req.projectIndex = projectIndex;

    return next();
}

function incrementReqCounter(req, res, next) {
    requestCounter++;
    next();
    console.log('Number of requests until now: ', requestCounter);
}

server.post('/projects', incrementReqCounter, (req, res) => {
    const newProject = {
        ...req.body,
        tasks: [],
    };

    projects.push(newProject);

    return res.json(projects);
});

server.get('/projects', incrementReqCounter, (req, res) => {
    return res.json(projects);
});

server.put('/projects/:id', incrementReqCounter, findProjectIndex, (req, res) => {
    const { title } = req.body;
    projects[req.projectIndex].title = title;

    return res.json(projects[req.projectIndex]);
});

server.delete('/projects/:id', incrementReqCounter, findProjectIndex, (req, res) => {
    projects.splice(req.projectIndex, 1);

    return res.send();
});

server.post('/projects/:id/tasks', incrementReqCounter, findProjectIndex, (req, res) => {
    const { title: task } = req.body;
    const project = projects[req.projectIndex];
    project.tasks.push(task);

    return res.json(projects);
});

server.listen(3000);
