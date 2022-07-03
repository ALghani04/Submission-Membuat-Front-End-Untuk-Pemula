const incompleteBookshelfList = [];
const RENDER_EVENT = "render-todo";

document.addEventListener("DOMContentLoaded", function () {
 
    const submitForm = document.getElementById("inputBook");
    const submitBuku = document.getElementById("searchBook");
 
    submitBuku.addEventListener("submit",function(event){
        event.preventDefault();
        cariBuku();
    });

    submitForm.addEventListener("submit", function (event) {
        event.preventDefault();
        addTodo();
    });
    
    function addTodo() {
        const textTodo = document.getElementById("inputBookTitle").value;
        const textTodoo = document.getElementById("inputBookAuthor").value;
        const timestamp = document.getElementById("inputBookYear").value;
        const isCompletedd = document.getElementById("inputBookIsComplete").checked ? true : false;
      
        const generatedID = generateId();
        const todoObject = generateTodoObject(generatedID, textTodo, textTodoo, +timestamp, isCompletedd);
        incompleteBookshelfList.push(todoObject);
       
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
    }
    
    function generateId() {
        return + new Date();
    }


    function generateTodoObject(id, title, author, year, isCompleted) {
        return {
            id,
            title,
            author,
            year,
            isCompleted
        }
    }

    if(isStorageExist()){
        loadDataFromStorage();
    }
});

document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById("incompleteBookshelfList");
    uncompletedTODOList.innerHTML = "";
   
    const completedTODOList = document.getElementById("completeBookshelfList");
    completedTODOList.innerHTML = "";
   
    for(todoItem of incompleteBookshelfList){
        const todoElement = makeTodo(todoItem);
     
        if(todoItem.isCompleted == false)
            uncompletedTODOList.append(todoElement);
        else
            completedTODOList.append(todoElement);
    }
});

function cariBuku() {
    const searchBook = document.getElementById("searchBookTitle");
    const filter = searchBook.value.toUpperCase();
    const bookItem = document.querySelectorAll("section.book_shelf > .book_list > .book_item");
    
        for (let i = 0; i < bookItem.length; i++) {
        txtValue = bookItem[i].textContent || bookItem[i].innerText;
            if (txtValue.toUpperCase().indexOf(filter) > -1) {
                bookItem[i].style.display = "";
            } else {
                bookItem[i].style.display = "none";
            }
        }
}

function makeTodo(todoObject) {
 
    const textTitle = document.createElement("h2");
    textTitle.innerText = todoObject.title;
  
    const textAuthor = document.createElement("p");
    textAuthor.innerText = "Author : " + todoObject.author;

    const textYear = document.createElement("p");
    textYear.innerText = "Tahun : " + todoObject.year;

    const textContainer = document.createElement("div");
    textContainer.classList.add("action");
    textContainer.append(textTitle, textAuthor, textYear);

    const container = document.createElement("article");
    container.classList.add("book_item");
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoObject.id}`);

    
    if(todoObject.isCompleted){
        
        const a = document.createElement("button");
        a.classList.add("green");
        a.innerText = "Belum Selesai dibaca";
        a.addEventListener("click", function () {
            undoTaskFromCompleted(todoObject.id);
        
        });
   
        const b = document.createElement("button");
        b.classList.add("red");
        b.innerText = "Hapus Buku";
        b.addEventListener("click", function () {
            removeTaskFromCompleted(todoObject.id);
        });
   
        textContainer.append(a, b);
    } else {
   
        
        const c = document.createElement("button");
        c.classList.add("green");
        c.innerText = "Selesai dibaca";
        c.addEventListener("click", function () {
            addTaskToCompleted(todoObject.id);
        });


        const d = document.createElement("button");
        d.classList.add("red");
        d.innerText = "Hapus Buku";
        d.addEventListener("click", function () {
            removeTaskFromCompleted(todoObject.id);
        });
    
        textContainer.append(c,d);
    }

    return container;
}



function addTaskToCompleted(todoId) {
 
    const todoTarget = findTodo(todoId);
        if(todoTarget == null) return;
  
        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
}
  
function findTodo(todoId){
  for(todoItem of incompleteBookshelfList){
      if(todoItem.id === todoId){
          return todoItem
      }
  }

  return null
}

function removeTaskFromCompleted(todoId) {
    const todoTarget = findTodoIndex(todoId);
    if(todoTarget === -1) return;
        incompleteBookshelfList.splice(todoTarget, 1);
   
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
}

   
function undoTaskFromCompleted(todoId){
   
   
    const todoTarget = findTodo(todoId);
    if(todoTarget == null) return;
   
   
        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
        saveData();
}

function findTodoIndex(todoId) {
    for(index in incompleteBookshelfList){
        if(incompleteBookshelfList[index].id === todoId){
            return index
        }
    }
    return -1
}

function saveData() {
    if(isStorageExist()){
        const parsed = JSON.stringify(incompleteBookshelfList);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

const SAVED_EVENT = "saved-todo";
const STORAGE_KEY = "TODO_APPS";
 
 
function isStorageExist(){
  if(typeof(Storage) === undefined){
      alert("Browser kamu tidak mendukung local storage");
      return false
  }
  return true;
}

document.addEventListener(SAVED_EVENT, function() {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataFromStorage() {
    const serializedData = localStorage.getItem(STORAGE_KEY);
   
    let data = JSON.parse(serializedData);
   
    if(data !== null){
        for(todo of data){
            incompleteBookshelfList.push(todo);
        }
    }
   
   
    document.dispatchEvent(new Event(RENDER_EVENT));
}