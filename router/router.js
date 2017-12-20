var express = require('express');
var jsonfile = require('jsonfile');
var router = express.Router();

var dataFilePath = './data/data.json';
var fileFormat = { spaces: 2, EOL: '\r\n' };

router.get('/api/todos', function(req, res, next) {
  jsonfile.readFile(dataFilePath, function(err, json) {
    res.send(json);
    console.log('Todo list requested', err);
  });
});

router.get('/api/todos/:id', function(req, res, next) {
  if (/^\d+$/.test(req.params.id)) {
    jsonfile.readFile(dataFilePath, function(err, todos) {
      var requestedTodo = todos.find(function(todo) {
        return todo.id === Number(req.params.id);
      });
      res.send(requestedTodo);
      console.log(`Todo #${requestedTodo.id} requested`);
    });
  }
});

router.post('/api/todos', function(req, res, next) {
  jsonfile.readFile(dataFilePath, function(err, todos) {
    if (!err) {
      const todo = Object.assign({
        completed: false,
        created_at: new Date().toISOString(),
        id: todos.length,
      }, req.body);
      console.log('req.body', req.body)
      todos.push(todo)
      jsonfile.writeFile(dataFilePath, todos, fileFormat, function(err) {
        if (!err) {
          res.send(todo);
          console.log(`New todo created: ${JSON.stringify(todo, null, 2)}`);
        }
      });
    }
  });
});

router.put('/api/todos/:id', function(req, res, next) {
  if (/^\d+$/.test(req.params.id)) {
    jsonfile.readFile(dataFilePath, function(err, todos) {
      if (!err) {
        var requestedTodoIndex;
        var requestedTodo = todos.find(function(todo, index) {
          if (todo.id === Number(req.params.id)) {
            requestedTodoIndex = index;
            return true;
          }
          return false;
        });
        if (requestedTodo) {
          requestedTodo = Object.assign(requestedTodo, req.body, { modified_at: new Date().toISOString() });
          todos[requestedTodoIndex] = requestedTodo;
          jsonfile.writeFile(dataFilePath, todos, fileFormat, function(err) {
            if (!err) {
              res.send(requestedTodo);
              console.log(`Todo #${requestedTodo.id} updated:\n${JSON.stringify(requestedTodo, null, 2)}`);
            }
          });
        }
      }
    });
  }
});

module.exports = router;
