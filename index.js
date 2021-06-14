const mysql = require("mysql");
const inquirer = require("inquirer");
const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "134679Jtvn!!!",
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
    message: "Select an action",
    choices: [
      "View Employees",
      "View Roles",
      "View Departments",
      "Add Department",
      "Add Role",
      "Add Employee",
      "Edit Employee",
      "Remove Employee",
      "QUIT",
    ],
  },
];

function userPrompt() {
  inquirer.prompt(displayedPrompt).then(function (result) {
    if (result.action === "View Employees") {
      viewEmployees();
    } else if (result.action === "View Departments") {
      viewDepartments();
    } else if (result.action === "View Roles") {
      viewRoles();
    } else if (result.action === "Add Employee") {
      addEmployee();
    } else if (result.action === "Add Department") {
      addDepartment();
    } else if (result.action === "Add Role") {
      addRole();
    } else if (result.action === "Edit Employee") {
      updateEmployee();
    } else if (result.action === "Remove Employee") {
      removeEmployee();
    } else if (result.action === "QUIT") {
      quitApp();
    }
  });
}

function viewEmployees() {
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
  });
}
function viewDepartments() {
  let query = "SELECT department.department_name AS departments FROM department;";
  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    userPrompt();
  });
}
function viewRoles() {
  let query =
    "SELECT roles.title, roles.salary, department.department_name AS department FROM roles INNER JOIN department ON department.id = roles.department_id;";

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
    connection.query(query1, function (err, res) {
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
      let listOfManagers = res;
      let addEmployeePrompt = [
        {
          name: "first_name",
          type: "input",
          message: "Enter employee's first name.",
        },

        {
          name: "last_name",
          type: "input",
          message: "Enter employee's last name.",
        },

        {
          name: "select_role",
          type: "list",
          message: "Select employee's role.",
          choices: function () {
            roles = [];
            for (i = 0; i < listOfRoles.length; i++) {
              const rolesID = i + 1;
              roles.push(rolesID + ": " + listOfRoles[i].title);
            }
            roles.unshift("0: Exit");
            return roles;
          },
        },

        {
          name: "select_manager",
          type: "list",
          message: "Select new employee's manager",
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
            managers.unshift("E: Exit");
            return managers;
          },
          when: function (results) {
            return results.select_role !== "0: Exit";
          },
        },
      ];

      inquirer
        .prompt(addEmployeePrompt)

        .then(function (result) {
          if (
            result.select_role === "0: Exit" ||
            result.select_manager === "E: Exit"
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

                manager_id: parseInt(result.select_manager.split(":")[0]),
              },
              function (err, res) {
                if (err) throw err;
              }
            );
            let addPrompt = [
              {
                name: "add_more",
                type: "list",
                message: "Would you like to add another employee?",
                choices: ["Yes", "Exit"],
              },
            ];
            inquirer
              .prompt(addPrompt)

              .then(function (result) {
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
                  } else if (result.add_more === "Exit") {
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

function addDepartment() {
  let query = "SELECT department.department_name FROM department;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    let addDepartmentPrompt = [
      {
        name: "new_department",
        type: "input",
        message: "Enter a new company department.",
      },
    ];    inquirer
      .prompt(addDepartmentPrompt)

      .then(function (result) {
        console.log(result);
        let query = "INSERT INTO department SET ?";
        connection.query(
          query,
          {
            department_name: result.new_department,
          },
          function (err, res) {
            if (err) throw err;
          }
        );
        let addPrompt = [
          {
            name: "add_more",
            type: "list",
            message: "Would you like to add another department?",
            choices: ["Yes", "Exit"],
          },
        ];
        inquirer
          .prompt(addPrompt)

          .then(function (result) {
            let query = "SELECT department.department_name FROM department";

            connection.query(query, function (err, res) {
              if (err) throw err;
              if (result.add_more === "Yes") {
                addDepartment();
              } else if (result.add_more === "Exit") {
                console.table(res);
                userPrompt();
              }
            });
          });
      });
  });
}

function addRole() {
  let query1 =
    "SELECT roles.title AS roles, roles.salary, department.department_name FROM roles INNER JOIN department ON department.id = roles.department_id;";
  let query2 = "SELECT department.department_name FROM department";
  connection.query(query1, function (err, res) {
    if (err) throw err;
    console.table(res);
    connection.query(query2, function (err, res) {
      if (err) throw err;
      let departmentList = res;
      let addRolePrompt = [
        {
          name: "add_role",
          type: "input",
          message: "Enter a new company role.",
        },

        {
          name: "add_salary",
          type: "input",
          message: "Enter a salary for this role.",
        },

        {
          name: "select_department",
          type: "list",
          message: "Select a department.",
          choices: function () {
            departments = [];

            for (i = 0; i < departmentList.length; i++) {
              const rolesID = i + 1;
              departments.push(rolesID + ": " + departmentList[i].department_name);
            }
            departments.unshift("0: Exit");
            return departments;
          },
        },
      ];

      inquirer
        .prompt(addRolePrompt)

        .then(function (result) {
          if (result.select_department === "0: Exit") {
            userPrompt();
          } else {
            console.log(result);
            let query = "INSERT INTO roles SET ?";
            connection.query(
              query,
              {
                title: result.add_role,
                salary: result.add_salary,

                department_id: parseInt(result.select_department.split(":")[0]),
              },
              function (err, res) {
                if (err) throw err;
              }
            );
            let addPrompt = [
              {
                name: "add_more",
                type: "list",
                message: "Would you like to add another role?",
                choices: ["Yes", "Exit"],
              },
            ];

            inquirer
              .prompt(addPrompt)
              .then(function (result) {
                let query =
                  "SELECT roles.id, roles.title AS roles, roles.salary, department.department_name FROM roles INNER JOIN department ON department.id = roles.department_id;";
                connection.query(query, function (err, res) {
                  if (err) throw err;
                  if (result.add_more === "Yes") {
                    addRole();
                  } else if (result.add_more === "Exit") {
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

function updateEmployee() {
  let query = "SELECT title FROM roles";
  let query2 =
    "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.department_name, employees.manager_id " +
    "FROM employees " +
    "JOIN roles ON roles.id = employees.role_id " +
    "JOIN department ON roles.department_id = department.id " +
    "ORDER BY employees.id;";

  connection.query(query, function (err, res) {
    if (err) throw err;
    let listOfRoles = res;
    connection.query(query2, function (err, res) {
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
          message: "Select employee to edit",
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
            employees.unshift("0: Exit");
            return employees;
          },
        },
      ];
      inquirer
        .prompt(addEmployeePrompt)

        .then(function (result) {
          if (result.select_employee === "0: Exit") {
            userPrompt();
          } else {
            let empSelect = result.select_employee.split(":")[0];

            let updateEmployeePrompt = [
              {
                name: "select_role",
                type: "list",
                message: "Edit employee role.",

                choices: function () {
                  roles = [];

                  for (i = 0; i < listOfRoles.length; i++) {
                    const rolesID = i + 1;
                    roles.push(rolesID + ": " + listOfRoles[i].title);
                  }
                  roles.unshift("0: Exit");
                },
              },

              {
                name: "select_manager",
                type: "list",
                message: "Edit employee manager",

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
                  managers.unshift("E: Exit");
                  return managers;
                },
                when: function (results) {
                  return results.select_role !== "0: Exit";
                },
              },
            ];

            inquirer
              .prompt(updateEmployeePrompt)

              .then(function (result) {
                if (
                  result.select_role === "0: Exit" ||
                  result.select_manager === "E: Exit"
                ) {
                  userPrompt();
                } else {
                  console.log(result);
                  let query =
                    "UPDATE employees SET ? WHERE employees.id = " + empSelect;
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
                  let addPrompt = [
                    {
                      name: "add_more",
                      type: "list",
                      message: "Would you like to update/edit another employee?",
                      choices: ["Yes", "Exit"],
                    },
                  ];
                  inquirer
                    .prompt(addPrompt)

                    .then(function (result) {
                      let query =
                        "SELECT employees.first_name, employees.last_name, roles.title, roles.salary, department.department_name, employees.manager_id " +
                        "FROM employees " +
                        "JOIN roles ON roles.id = employees.role_id " +
                        "JOIN department ON roles.department_id = department.id " +
                        "ORDER BY employees.id;";

                      connection.query(query, function (err, res) {
                        if (err) throw err;

                        if (result.add_more === "Yes") {
                          updateEmployee();
                        } else if (result.add_more === "Exit") {
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

function removeEmployee() {
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
          for (i = 0; i < listOfEmployees.length; i++) {
            employees.push(
              listOfEmployees[i].id + ": " + listOfEmployees[i].employee
            );
          }
          employees.unshift("0: Exit");
          return employees;
        },
      },
      {
        name: "confirm",
        type: "list",
        message: function (results) {
          return (
            "Are you sure you want to Remove " +
            results.select_employee.split(": ")[1]
          );
        },

        choices: ["Yes", "No"],

        when: function (results) {
          return results.select_employee !== "0: Exit";
        },
      },
    ];
    inquirer.prompt(addEmployeePrompt).then(function (result) {
      if (result.select_employee === "0: Exit") {
        userPrompt();
      } else if (result.confirm === "No") {
        deleteEmployee();
      } else {
        let query =
          "DELETE FROM employees WHERE employees.id =" +
          result.select_employee.split(": ")[0];
        connection.query(query, function (err, res) {
          if (err) throw err;
        });
        let addPrompt = [
          {
            name: "add_more",
            type: "list",
            message: "Would you like to remove another employee?",
            choices: ["Yes", "Exit"],
          },
        ];
        inquirer.prompt(addPrompt).then(function (result) {
          let query =
            "SELECT employees.id, employees.first_name, employees.last_name FROM employees;";
          connection.query(query, function (err, res) {
            if (err) throw err;
            for (i = 0; i < res.length; i++) {
              res[i].employee = res[i].first_name + " " + res[i].last_name;
              delete res[i].first_name;
              delete res[i].last_name;
            }
            if (result.add_more === "Yes") {
              deleteEmployee();
            } else if (result.add_more === "Exit") {
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
  console.log("Goodbye!");
}
