document.addEventListener("DOMContentLoaded", () => {
  const todoInput = document.getElementById("todoInput");
  const addTodoButton = document.getElementById("addTodo");
  const todoList = document.getElementById("todoList");

  // Check if chrome.storage is available
  if (chrome && chrome.storage && chrome.storage.local) {
    console.log("Chrome storage is available");
    loadTodos();
  } else {
    console.error("chrome.storage.local is not available");
    // Display an error message to the user
    const errorMsg = document.createElement("p");
    errorMsg.textContent =
      "Error: Unable to access storage. Please check extension permissions.";
    errorMsg.style.color = "red";
    document.body.insertBefore(errorMsg, todoList);
  }

  addTodoButton.addEventListener("click", () => {
    const todoText = todoInput.value.trim();
    if (todoText) {
      addTodo(todoText);
      todoInput.value = "";
    }
  });

  function loadTodos() {
    chrome.storage.local.get(["todos"], (result) => {
      const todos = result.todos || [];
      todos.forEach((todo) => addTodoToList(todo));
    });
  }

  function addTodo(todoText) {
    chrome.storage.local.get(["todos"], (result) => {
      const todos = result.todos || [];
      todos.push(todoText);
      chrome.storage.local.set({ todos: todos }, () => {
        addTodoToList(todoText);
      });
    });
  }

  function addTodoToList(todoText) {
    const li = document.createElement("li");
    li.textContent = todoText;
    li.addEventListener("click", () => {
      removeTodo(todoText);
      li.remove();
    });
    todoList.appendChild(li);
  }

  function removeTodo(todoText) {
    chrome.storage.local.get(["todos"], (result) => {
      const todos = result.todos || [];
      const updatedTodos = todos.filter((todo) => todo !== todoText);
      chrome.storage.local.set({ todos: updatedTodos });
    });
  }
});
