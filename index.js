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

function displayEmployees() {
  let query = "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.department_name AS department, employees.manager_id " +
  "FROM employees " +
  "JOIN roles ON roles.id = employees.role_id " +
  "JOIN department ON roles.department_id = department.id " +
  "ORDER BY employees.id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    for(i = 0; i < res.length; i++) {
      if(res[i].manager_id === 0) {
        res[i].manager_id = "Null"
      } else {
        res[i].manager = res[res[i].manager_id - 1]. first_name + " " + res[res[i].manager_id - 1].last_name;
      };
      delete res[i].manager_id;
    };
    console.table(res);
    userPrompt();
  });
};

function displayRoles() {
  let query = "SELECT department.department_name AS departments FROM department;";
}

function displayDepartment() {}

function addEmployee() {}

function addRole() {}

function addDepartment() {}

function removeEmployeee() {}

function quitApp() {}
