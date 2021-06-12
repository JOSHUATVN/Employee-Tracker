const mysql2 = require("mysql2");
const inquirer = require("inquirer");

const connection = mysql2.createConnection({
  host: "localhost",
  port: 3001,
  user: "root",
  password: "userpassword",
  database: "employee_db",
});

connection.connect(function (err) {
  if (err) throw err;
  userPrompt();
});

const displayedPrompt = [
  {
    name: "action",
    type: "list",
    message: "Select action",
    choices: [
      "Employees",
      "Roles",
      "Departments",
      "Add Employee",
      "Add Role",
      "Add Department",
      "Remove Employee",
      "Edit Employee",
      "QUIT",
    ],
  },
];

function userPrompt() {
  inquirer.prompt(displayedPrompt).then(function (userInput) {
    if (userInput.action === "Employees") {
      displayEmployees();
    } else if (userInput.action === "Roles") {
      displayRoles();
    } else if (userInput.action === "Departments") {
      displayDepartment();
    } else if (userInput.action === "Add Employee") {
      addEmployee();
    } else if (userInput.action === "Add Role") {
      addRole();
    } else if (userInput.action === "Add Department") {
      addDepartment();
    } else if (userInput.action === "Remove Employee") {
      removeEmployeee();
    } else if (userInput.action === "Edit Employee") {
      editEmployee();
    } else if (userInput.action === "QUIT") {
      quitApp();
    }
  });
}

function displayEmployees() {}

function displayRoles() {}

function displayDepartment() {}

function addEmployee() {}

function addRole() {}

function addDepartment() {}

function removeEmployeee() {}

function quitApp() {}
