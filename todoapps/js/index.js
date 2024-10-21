document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
    });

    if (isStorageExist()) {
      loadDataFromStorage();
    }
  });

//variabel tampungan todos
const todos = [];

//definisikan custom-event dengan nama render-todo
const RENDER_EVENT = 'render-todo';

//membuat add todo
function addTodo() {
    const textTodo = document.getElementById('title').value;
    const timestamp = document.getElementById('date').value;
   
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo, timestamp, false);
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
  }

//membuat generateID
function generateId() {
    return +new Date();
  }
   
function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted
    }
}

//membuat event-listener dari custom-event RENDER_EVENT
document.addEventListener(RENDER_EVENT, function () {
    // console.log(todos);

    // tampilan sebelum todo dilakukan 
    const uncompletedTODOList = document.getElementById('todos');
    uncompletedTODOList.innerHTML = '';
   
    //tammpilan todo setelah dilakukan 
    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';


    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);

      if(!todoItem.isCompleted){
        uncompletedTODOList.append(todoElement);
      } else {
          completedTODOList.append(todoElement);
      }
    }

    //ta
  });

// makeTodo 
function makeTodo(todoObject) {
    const textTitle = document.createElement('h2');
    textTitle.innerText = todoObject.task;
   
    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = todoObject.timestamp;
   
    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textTimestamp);
   
    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `todo-${todoObject.id}`);

    // pengecekan sudah dilakukan apa belum (isCompleted)
    if(todoObject.isCompleted){
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function(){
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');
    
        trashButton.addEventListener('click', function(){
            removeTaskFromCompleted(todoObject.id);
        });
    
        container.append(undoButton, trashButton);

    } else {
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function(){
            addTaskCompleted(todoObject.id);
        });

        container.append(checkButton);
    }
    return container;
  }

function addTaskCompleted (todoID){
    const todoTarget = findTodo(todoID);

    if(todoTarget == null ) return;

    todoTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findTodo(todoID){
    for (const todoItem of todos){
        if(todoItem.id === todoID){
             return todoItem;
        }
    }

      return null;
}


  //remove todo
function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
    
    if (todoTarget === -1) return;
    
    todos.splice(todoTarget, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}
   
   
  //undo todo
function undoTaskFromCompleted(todoId) {
    const todoTarget = findTodo(todoId);
   
    if (todoTarget == null) return;
   
    todoTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

  //function cari index untuk menghapus
function findTodoIndex(todoID){
    for (const index in todos){
        if(todos[index].id === todoID){
            return index;
        }
    }

    return -1;
}

function saveData() {
  if (isStorageExist()) {
    const parsed = JSON.stringify(todos);
    localStorage.setItem(STORAGE_KEY, parsed);
    document.dispatchEvent(new Event(SAVED_EVENT));
  }
}

const SAVED_EVENT = 'saved-todo';
const STORAGE_KEY = 'TODO_APPS';
 
function isStorageExist() /* boolean */ {
  if (typeof (Storage) === undefined) {
    alert('Browser kamu tidak mendukung local storage');
    return false;
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function () {
  alert('data disimpan');
  console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
  const serializedData = localStorage.getItem(STORAGE_KEY);
  let data = JSON.parse(serializedData);
 
  if (data !== null) {
    for (const todo of data) {
      todos.push(todo);
    }
  }
 
  document.dispatchEvent(new Event(RENDER_EVENT));
}