document.addEventListener('DOMContentLoaded', function () {
    const submitForm = document.getElementById('form');
    submitForm.addEventListener('submit', function (event) {
      event.preventDefault();
      addTodo();
    });
  });

//variabel tampungan todos
const todos = [];

//definisikan custom-event dengan nama render-todo
const RENDER_EVENT = 'render-todo';

//membuat add todo
function addTodo() {
    const textTodo = document.getElementById('title').value;
   
    const generatedID = generateId();
    const todoObject = generateTodoObject(generatedID, textTodo , false);
    todos.push(todoObject);
   
    document.dispatchEvent(new Event(RENDER_EVENT));

    //inputan kembali kosong seperti awal
    document.getElementById('title').value = "";
  }

//membuat generateID
function generateId() {
    return +new Date();
  }
   
function generateTodoObject(id, task , isCompleted) {
    return {
      id,
      task,
      isCompleted
    }
}

//membuat event-listener dari custom event RENDER-EVENT
document.addEventListener(RENDER_EVENT, function(){
    // console.log(todos);

    //tampilkan todos
    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML = '';

    for (const todoItem of todos){
        const todoElement = makeTodo(todoItem);
        completedTODOList.append(todoElement);
    }
});

//function make todo 
function makeTodo(todoObject) {
    const todoContainer = document.createElement('div');
    todoContainer.classList.add('container-cek');

    // Membuat elemen div untuk todo
    const todoElement = document.createElement('div');
    todoElement.classList.add('class-item');
    
    // Membuat elemen ul dan li untuk menampilkan task
    const ulElement = document.createElement('ul');
    const liElement = document.createElement('li');
    liElement.innerText = todoObject.task; // Isi li dengan task dari todoObject

    ulElement.append(liElement);
    
    //div tombol delete-box
    const deleteContainer = document.createElement('div');
    deleteContainer.classList.add('btn-delete');

    // Membuat tombol delete
    const deleteButton = document.createElement('input');
    deleteButton.type = 'button';
    deleteButton.value = 'Delete';
    deleteButton.classList.add('delete');

    //div done button 
    const doneContainer = document.createElement('div');
    doneContainer.classList.add('btn-delete');

    //membuat tombol done 
    const doneButton = document.createElement('input');
    doneButton.type = 'button';
    doneButton.value = 'Done';
    doneButton.classList.add('done')

    //add delete-button dan done-button to delete box
    deleteContainer.append(doneButton,deleteButton);

    // Menambahkan ul dan tombol delete ke dalam div todoElement
    todoElement.append(ulElement, deleteContainer);

    //menambahkan semua element ke dalam todoContainer
    todoContainer.append(todoElement, deleteContainer);

      // Jika task sudah selesai (isCompleted = true), lakukan perubahan
    if (todoObject.isCompleted) {
      liElement.innerText = 'task-done';
      liElement.classList.add('no-bullet');
      todoContainer.classList.add('done-box');
      deleteContainer.remove(); // Hapus tombol "Done" dan "Delete"
    } 
    
    else {
        // Fungsi untuk menghapus todo
        deleteButton.addEventListener('click', function() {
            removeTodo(todoObject.id);
      });

      // Fungsi untuk menandai task selesai
    doneButton.addEventListener('click', function() {
        todoObject.isCompleted = true;  // Update status isCompleted
        deleteContainer.remove();
        liElement.innerText = 'task-done';
        liElement.classList.add('no-bullet');
        todoContainer.classList.add('done-box');
        
      });
    }
    
    return todoContainer;
}

// Fungsi remove todo berdasarkan ID
function removeTodo(todoId) {
    const todoIndex = todos.findIndex((todo) => todo.id === todoId);
    if (todoIndex !== -1) {
        todos.splice(todoIndex, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }
}

