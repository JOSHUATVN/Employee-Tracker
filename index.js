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
        res[i].manager_id = "NONE";
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
          res[i].manager = " NONE";
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
            managers.unshift("0: NONE");
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
                    res[i].manager = "NONE";
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
}

function addRole() {
  let query3 =
    "SELECT roles.title AS roles, roles.salary, department.department_name FROM roles INNER JOIN department ON department.id = roles.department_id;";
  let query4 = "SELECT department.department_name FROM department";

  connection.query(query3, function (err, res) {
    if (err) throw err;
    console.table(res);
    connection(query4, function (err, res) {
      if (err) throw err;
      let listOfDepartments = res;
      let addRolePropmt = [
        {
          name: "add_role",
          type: "input",
          message: "Enter employee's role",
        },
        {
          name: "add_salary",
          type: "input",
          message: "Enter employee's salary",
        },
        {
          name: "select_department",
          type: "list",
          message: "Select employee's designated department",
          choices: function () {
            departments = [];
            for (i = 0; i < listOfDepartments.length; i++) {
              const rolesID = i + 1;
              departments.push(
                rolesID + ": " + listOfDepartments[i].department_name
              );
            }
            departments.unshift("0: EXIT");
            return departments;
          },
        },
      ];
      inquirer.prompt(addRolePropmt).then(function (result) {
        if (result.select_department === "0: EXIT") {
          userPrompt();
        } else {
          console.log(result);
          let query = "INSERT INTO roles SET ?";
          connection.query(
            query,
            {
              title: result.add_role,
              salary: result.add.salary,
              department_id: parseInt(result.select_department.split(":")[0]),
            },
            function (err, res) {
              if (err) throw err;
            }
          );

          let addMorePrompt = [
            {
              name: "add_more",
              type: "list",
              message: "Would you like to add another role?",
              choices: ["Yes", "EXIT"],
            },
          ];
          inquirer.prompt(addMorePrompt).then(function (result) {
            let query =
              "SELECT roles.id, roles.title AS roles, roles.salary, department.department_name FROM roles INNER JOIN department ON department.id = roles.department_id;";

            connection.query(query, function (err, res) {
              if (err) throw err;
              if (result.add_more === "Yes") {
                addRole();
              } else if (result.add_more === "EXIT") {
                console.table(res);
                userPrompt();
              }
            });
          });
        }
      });
    });
  });
}

function addDepartment() {
  let query = "SELECT department.department_name FROM department;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    let addDepartmentPromt = [
      {
        name: "add_department",
        type: "input",
        message: "Enter new department",
      },
    ];
    inquirer.prompt(addDepartmentPromt).then(function (result) {
      console.log(result);
      let query = "INSERT INTO department SET ?";
      connection.query(
        query,
        {
          department_name: result.add_department,
        },
        function (err, res) {
          if (err) throw err;
        }
      );

      let addMorePrompt = [
        {
          name: "add_more",
          type: "list",
          message: "Would you like to add another department?",
          choices: ["Yes", "EXIT"],
        },
      ];
      inquirer.prompt(addMorePrompt).then(function (result) {
        let query = "SELECT department.department_name FROM department";
        connection.query(query, function (err, res) {
          if (err) throw err;
          if (result.add_more === "Yes") {
            addDepartment();
          } else if (result.add_more === "EXIT") {
            console.table(res);
            userPrompt();
          }
        });
      });
    });
  });
}

function editEmployee() {
  let query = "SELECT title FROM roles";
  let query0 =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.department_name, employees.manager_id " +
    "FROM employees " +
    "JOIN roles ON roles.id = employees.role_id " +
    "JOIN department ON roles.department_id = department.id " +
    "ORDER BY employees.id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    let listOfRoles = res;
    connection.query(query0, function (err, res) {
      if (err) throw err;
      for (i = 0; i < res.length; i++) {
        if (res[i].manager_id === 0) {
          res[i].manager = "NONE";
        } else {
          res[i].manager =
            res[res[i].manager_id - 1].first_name +
            " " +
            res[res[i].manager_id - 1].last_name;
        }
        delete res[i].manager_id;
      }
      console.table(res);
      let listOfEmployees = res;
      let addEmployeePrompt = [
        {
          name: "select_employee",
          type: "list",
          message: "Select an employee to update/edit",
          choices: function () {
            employees = [];
            for (i = 0; i < listOfEmployees.length; i++) {
              const managerID = i + 1;
              employees.push(
                managerID +
                  ": " +
                  listOfEmployees[i].first_name +
                  " " +
                  listOfEmployees[i].last_name
              );
            }
            employees.unshift("0: EXIT");
            return employees;
          },
        },
      ];
      inquirer.prompt(addEmployeePrompt).then(function (result) {
        if (result.select_employee === "0: EXIT") {
          userPrompt();
        } else {
          let selectEmployee = result.select_employee.split(":")[0];
          let promptEmployee = [
            {
              name: "select_role",
              type: "list",
              message: "Update/edit employee's role",
              choices: function () {
                roles = [];
                for (i = 0; i < listOfRoles.length; i++) {
                  const rolesID = i + 1;
                  roles.push(rolesID + ":" + listOfRoles[i].title);
                }
                roles.unshift("0: EXIT");
                return roles;
              },
            },

            {
              name: "select_manager",
              type: "list",
              message: "Update/edit employee's manager",
              choices: function () {
                managers = [];
                for (i = 0; i < listOfEmployees.length; i++) {
                  const managerID = i + 1;
                  if (
                    result.select_employee.split(": ")[1] !==
                    listOfEmployees[i].first_name +
                      " " +
                      listOfEmployees[i].last_name
                  ) {
                    managers.push(
                      managerID +
                        ": " +
                        listOfEmployees[i].first_name +
                        " " +
                        listOfEmployees[i].last_name
                    );
                  }
                }
                managers.unshift("0: NONE");
                managers.unshift("E: EXIT");
                return managers;
              },
              when: function (results) {
                return results.select_role !== "0: EXIT";
              },
            },
          ];
          inquirer.prompt(promptEmployee).then(function (result) {
            if (
              result.select_role === "0: EXIT" ||
              result.select_manager === "E: EXIT"
            ) {
              userPrompt();
            } else {
              console.log(result);
              let query =
                "UPDATE employees SET ? WHERE employees.id = " + selectEmployee;
              connection.query(
                query,
                {
                  role_id: parseInt(result.select_role.split(":")[0]),
                  manager_id: parseInt(result.select_manager.split(":")[0]),
                },
                function (err, res) {
                  if (err) throw err;
                }
              );
              let addMorePrompt = [
                {
                  name: "add_more",
                  type: "list",
                  message: "Would you like to add another employee?",
                  choices: ["Yes", "EXIT"],
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
                    updateEmployees();
                  } else if (result.add_more === "EXIT") {
                    for (i = 0; i < res.length; i++) {
                      if (res[i].manager_id === 0) {
                        res[i].manager = "NONE";
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
        }
      });
    });
  });
}

function removeEmployeee() {
  let query =
    "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    for (i = 0; i < res.length; i++) {
      res[i].employee = res[i].first_name + " " + res[i].last_name;
      delete res[i].first_name;
      delete res[i].last_name;
    }
    console.table(res);
    let listOfEmployees = res;
    let addEmployeePrompt = [
      {
        name: "select_employee",
        type: "list",
        message: "Remove employee",
        choices: function () {
          employees = [];
          for (i = 0; i < employeeList.length; i++) {
            employees.push(
              employeeList[i].id + ": " + employeeList[i].employee
            );
          }
          employees.unshift("0: EXIT");
          return employees;
        },
      },

      {
        name: "confirm_removal",
        type: "list",
        message: function (results) {
          return (
            "Are you sure you want to remove this employee?" +
            results.select_employee.split(": ")[1]
          );
        },
        choices: ["YES", "NO"],
        when: function (results) {
          return results.select_employee !== "0: EXIT";
        },
      },
    ];
    inquirer.prompt(addEmployeePrompt).then(function (result) {
      if (result.select_employee === "0: EXIT") {
        userPrompt();
      } else if (result.confirm_removal === "NO") {
        removeEmployeee();
      } else {
        let query =
          "DELETE FROM employees WHERE employees.id =" +
          result.select_employee.split(": ")[0];
        connection.query(query, function (err, res) {
          if (err) throw err;
        });
        let addMorePrompt = [
          {
            name: "add_more",
            type: "list",
            message: "Would you like to remove more employees?",
            choices: ["YES", "EXIT"],
          },
        ];
        inquirer.prompt(addMorePrompt).then(function (result) {
          let query =
            "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";

          connection.query(query, function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
              res[i].employee = res[i].first_name + " " + res[i].last_name;
              delete res[i].first_name;
              delete res[i].last_name;
            }
            if (result.add_more === "YES") {
              removeEmployeee();
            } else if (result.add_more === "EXIT") {
              console.table(res);
              userPrompt();
            }
          });
        });
      }
    });
  });
}

function quitApp() {
  connection.end();
  console.log("Good Bye");
}
