const mysql2 = require("mysql2");
const inquirer = require("inquirer");
const { restoreDefaultPrompts } = require("inquirer");

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
  let query =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.department_name AS department, employees.manager_id " +
    "FROM employees " +
    "JOIN roles ON roles.id = employees.role_id " +
    "JOIN department ON roles.department_id = department.id " +
    "ORDER BY employees.id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      if (res[i].manager_id === 0) {
        res[i].manager_id = "Null";
      } else {
        res[i].manager =
          res[res[i].manager_id - 1].first_name +
          " " +
          res[res[i].manager_id - 1].last_name;
      }
      delete res[i].manager_id;
    }
    console.table(res);
    userPrompt();
  });
}

function displayRoles() {
  let query =
    "SELECT roles.title, roles.salary, department.department_name AS department FROM roles INNER JOIN department ON department.id = roles.department_id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    userPrompt();
  });
}

function displayDepartment() {
  let query =
    "SELECT department.department_name AS departments FROM department;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    userPrompt();
  });
}

function addEmployee() {
  let query = "SELECT title FROM roles";
  let query1 =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.department_name, employees.manager_id " +
    "FROM employees " +
    "JOIN roles ON roles.id = employees.role_id " +
    "JOIN department ON roles.department_id = department.id " +
    "ORDER BY employees.id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    let listOfRoles = res;
    connection.query(query, function (err, res) {
      if (err) throw err;
      for (i = 0; i < res.length; i++) {
        if (res[i].manager_id === 0) {
          res[i].manager = " Null";
        } else {
          res[i].manager =
            res[res[i].manager_id - 1].first_name +
            " " +
            res[res[i].manager_id - 1].last_name;
        }
        delete res[i].manager_id;
      }
      console.table(res);

      let listOfManagers = res;
      let addEmployeePrompt = [
        {
          name: "first_name",
          type: "input",
          message: "Enter employee's first name",
        },
        {
          name: "last_name",
          type: "input",
          message: "Enter employee's last name",
        },
        {
          name: "select_role",
          type: "list",
          message: "Select employee's role",

          choices: function () {
            roles = [];
            for (i = 0; i < listOfRoles.length; i++) {
              const rolesID = i + 1;
              roles.push(rolesID + ": " + listOfRoles[i].title);
            }
            roles.unshift("0: EXIT");
            return roles;
          },
        },

        {
          name: "select_manager",
          type: "list",
          message: "Select employee's manager",

          choices: function () {
            managers = [];
            for (i = 0; i < listOfManagers.length; i++) {
              const managerID = i + 1;
              managers.push(
                managerID +
                  ": " +
                  listOfManagers[i].first_name +
                  " " +
                  listOfManagers[i].last_name
              );
            }
            managers.unshift("0: Null");
            manager.unshift("E: EXIT");
            return managers;
          },
          when: function () {
            return results.select_role !== "0: EXIT";
          },
        },
      ];
      inquirer.prompt(addEmployeePrompt).then(function (result) {
        if (
          result.select_role === "0: EXIT" ||
          result.select_manager === "E: EXIT"
        ) {
          userPrompt();
        } else {
          console.log(result);
          let query = "INSERT INTO employees SET ?";
          connection.query(
            query,
            {
              first_name: result.first_name,
              last_name: result.last_name,
              role_id: parseInt(result.select_role.split(":")[0]),
            },
            function (err, res) {
              if (err) throw err;
            }
          );
          addMorePrompt = [
            {
              name: "add_more",
              type: "list",
              message: "Would you like to add another employee?",
              choices: ["YES", "EXIT"],
            },
          ];
          inquirer.prompt(addMorePrompt).then(function (result) {
            let query =
              "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.department_name, employees.manager_id " +
              "FROM employees " +
              "JOIN roles ON roles.id = employees.role_id " +
              "JOIN department ON roles.department_id = department.id " +
              "ORDER BY employees.id;";

            connection.query(query, function (err, res) {
              if (err) throw err;
              if (result.add_more === "Yes") {
                addEmployee();
              } else if (result.add_more === "EXIT") {
                for (i = 0; i < res.length; i++) {
                  if (res[i].manager_id === 0) {
                    res[i].manager = "Null";
                  } else {
                    res[i].manager =
                      res[res[i].manager_id - 1].first_name +
                      " " +
                      res[res[i].manager_id - 1].last_name;
                  }
                  delete res[i].manager_id;
                }
                console.table(res);
                userPrompt();
              }
            });
          });
        }
      });
    });
  });
};

function addRole() {}

function addDepartment() {}

function removeEmployeee() {}

function quitApp() {}
