const express = require('express');
const app = express();
const Database = require('better-sqlite3');
const db = new Database('tasks.db');
const idempotencyStore = new Map();

db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL
  )
`);

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
})

app.get('/hello', (req, res) => {
    res.send("Hello, This is my first API!");
});

app.get('/bye', (req, res) => {
    res.send("good bye from my api!");
})

app.get('/tasks', (req, res) => {
    const limit = 10;
    const after = req.query.after ? Number(req.query.after) : 0;

    const tasks = db.prepare('Select * FROM tasks WHERE id > ? ORDER BY id LIMIT ?').all(after, limit);
    res.send(tasks);
});

app.get('/tasks-offset', (req, res) => {
    const limit = 5;
    const page = Number(req.query.page) || 1;
    const offsetVal = (page - 1) * limit;

    const tasks = db.prepare('SELECT * FROM tasks ORDER BY id LIMIT ? OFFSET ?').all(limit, offsetVal);
    res.send(tasks);
});

app.post('/tasks', (req, res) => {
    const idempotencyKey = req.headers['idempotency-key'];

    if(idempotencyKey && idempotencyStore.has(idempotencyKey)){
        const cachedResponse = idempotencyStore.get(idempotencyKey);
        return res.status(cachedResponse.status).send(cachedResponse.body);
    }

    if(typeof req.body.title !== 'string' || req.body.title.trim() === ''){
        return res.status(400).send('Title must be a non-empty string');
    }


    const result = db.prepare('INSERT INTO tasks (title) VALUES (?)').run(req.body.title);
    const newTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(result.lastInsertRowid);

    if(idempotencyKey){
       idempotencyStore.set(idempotencyKey, {status: 201, body: newTask});
    }

    res.status(201).send(newTask);
});

app.get('/tasks/:id', (req, res) => {
    const task = db.prepare('SELECT * from tasks WHERE id = ?').get(req.params.id);

    if(!task){
        return res.status(404).send('Task not found');
    }
    res.send(task);
});

app.put('/tasks/:id', (req, res) => {

    if (typeof req.body.title !== 'string' || req.body.title.trim() === '') {
        return res.status(400).send('Title must be a non-empty string');
    }

    const task = db.prepare('SELECT * from tasks WHERE id = ?').get(req.params.id);

    if(!task){
        return res.status(404).send('Task not found');
    }

    db.prepare('UPDATE tasks SET title = ? WHERE id = ?').run(req.body.title, req.params.id)
    const updatedTask = db.prepare('SELECT * FROM tasks WHERE id = ?').get(req.params.id);
    res.send(updatedTask);
});

app.delete('/tasks/:id', (req, res) => {

    const task = db.prepare('SELECT * from tasks WHERE id = ?').get(req.params.id);

    if(!task)
    {
        return res.status(404).send('Task not found');
    }

    db.prepare('DELETE FROM tasks WHERE id = ?').run(req.params.id)
    res.send("Deleted");
});

app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went wrong on our end.');
});

app.listen(3000, ()=>{
    console.log('Server is running');
})