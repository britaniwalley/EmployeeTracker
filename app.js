const mysql = require("mysql");
const inquirer = require("inquirer");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "Xenophanes1!",
  database: "employee_tracker",
});

const initialPrompt = () => {
  inquirer
    .prompt({
      name: "mainMenu",
      type: "list",
      message:
        "Welcome to Employee Tracker, Are you here to ADD, VIEW or UPDATE?",
      choices: ["ADD", "VIEW", "UPDATE", "QUIT"],
    })
    .then((answer) => {
      if (answer.mainMenu === "ADD") {
        addMainMenu();
      } else if (answer.mainMenu === "VIEW") {
        viewMainMenu();
      } else if (answer.mainMenu === "UPDATE") {
        updateMainMenu();
      } else {
        connection.end();
      }
    });
};

const addMainMenu = () => {
  inquirer
    .prompt({
      name: "addMenu",
      type: "list",
      message: "Would you like to ADD a EMPLOYEE, ROLE, or DEPARTMENT?",
      choices: ["EMPLOYEE", "ROLE", "DEPARTMENT", "MAIN MENU"],
    })
    .then((answer) => {
      if (answer.addMenu === "EMPLOYEE") {
        addEmployee();
      } else if (answer.addMenu === "ROLE") {
        addRole();
      } else if (answer.addMenu === "DEPARTMENT") {
        addDepartment();
      } else {
        initialPrompt();
      }
    });
};

const addEmployee = () => {
  inquirer
    .prompt([
      {
        name: "employeeID",
        type: "input",
        message: "What is the employees ID number?",
      },
      {
        name: "employeeFirstName",
        type: "input",
        message: "What is the employees first name?",
      },
      {
        name: "employeeLastName",
        type: "input",
        message: "What is the employees last name?",
      },
      {
        name: "employeeRoleID",
        type: "input",
        message: "What is the employees Role ID?",
      },
      {
        name: "employeeManagerID",
        type: "input",
        message: "What is the employees Manager ID? (if applicable)",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO employee SET ?",
        {
          id: answer.employeeID,
          first_name: answer.employeeFirstName,
          last_name: answer.employeeLastName,
          role_id: answer.employeeRoleID,
          manager_id: answer.employeeManagerID,
        },
        (err) => {
          if (err) throw err;
          console.log("Employee has been added!");
          initialPrompt();
        }
      );
    });
};

const addRole = () => {
  inquirer
    .prompt([
      {
        name: "roleID",
        type: "input",
        message: "What is the ID number of the role?",
      },
      {
        name: "roleTitle",
        type: "input",
        message: "What is the title of the role?",
      },
      {
        name: "roleSalary",
        type: "input",
        message: "What is the salary of the role?",
      },
      {
        name: "roleDepartmentID",
        type: "input",
        message: "What is the departments Role ID?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO role SET ?",
        {
          id: answer.roleID,
          title: answer.roleTitle,
          salary: answer.roleSalary,
          department_id: answer.roleDepartmentID,
        },
        (err) => {
          if (err) throw err;
          console.log("Role has been added!");
          initialPrompt();
        }
      );
    });
};

const addDepartment = () => {
  inquirer
    .prompt([
      {
        name: "departmentID",
        type: "input",
        message: "What is the ID of the department?",
      },
      {
        name: "departmentTitle",
        type: "input",
        message: "What is the title of the department?",
      },
    ])
    .then((answer) => {
      connection.query(
        "INSERT INTO department SET ?",
        {
          id: answer.departmentID,
          name: answer.departmentTitle,
        },
        (err) => {
          if (err) throw err;
          console.log("Department has been added!");
          initialPrompt();
        }
      );
    });
};

const viewMainMenu = () => {
  inquirer
    .prompt({
      name: "viewMenu",
      type: "list",
      message: "Would you like to VIEW a EMPLOYEE, ROLE, or DEPARTMENT?",
      choices: ["EMPLOYEE", "ROLE", "DEPARTMENT", "MAIN MENU"],
    })
    .then((answer) => {
      if (answer.viewMenu === "EMPLOYEE") {
        viewEmployee();
      } else if (answer.viewMenu === "ROLE") {
        viewRole();
      } else if (answer.viewMenu === "DEPARTMENT") {
        viewDepartment();
      } else {
        initialPrompt();
      }
    });
};

const viewEmployee = () => {
  connection.query("SELECT * FROM employee", (err, res) => {
    if (err) throw err;
    res.forEach(({ id, first_name, last_name, role_id, manager_id }) => {
      console.log(
        `${id} | ${first_name} | ${last_name} | ${role_id} | ${manager_id}`
      );
    });
    console.log("-----------------------------------");
    viewMainMenu();
  });
};

const viewRole = () => {
  connection.query("SELECT * FROM role", (err, res) => {
    if (err) throw err;
    res.forEach(({ id, title, salary, department_id }) => {
      console.log(`${id} | ${title} | ${salary} | ${department_id}`);
    });
    console.log("-----------------------------------");
    viewMainMenu();
  });
};

const viewDepartment = () => {
  connection.query("SELECT * FROM department", (err, res) => {
    if (err) throw err;
    res.forEach(({ id, name }) => {
      console.log(`${id} | ${name}`);
    });
    console.log("-----------------------------------");
    viewMainMenu();
  });
};

const updateMainMenu = () => {
  inquirer
    .prompt({
      name: "updateMenu",
      type: "list",
      message: "Would you like to UPDATE a EMPLOYEE, ROLE, or DEPARTMENT?",
      choices: ["EMPLOYEE", "ROLE", "DEPARTMENT", "MAIN MENU"],
    })
    .then((answer) => {
      if (answer.updateMenu === "EMPLOYEE") {
        updateEmployee();
      } else if (answer.updateMenu === "ROLE") {
        updateRole();
      } else if (answer.updateMenu === "DEPARTMENT") {
        updateDepartment();
      } else {
        initialPrompt();
      }
    });
};

const updateEmployee = () => {
  connection.query("SELECT * FROM employee", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices() {
            const employeeArray = [];
            results.forEach(({ first_name }) => {
              employeeArray.push(first_name);
            });
            return employeeArray;
          },
          message: "Which employee would you like to update?",
        },
      ])
      .then((answer) => {
        let chosenEmployee;
        results.forEach((employee) => {
          if (employee.first_name === answer.choice) {
            chosenEmployee = employee;
            connection.query("DELETE FROM employee WHERE ?", [
              {
                first_name: answer.choice,
              },
            ]);
          } else {
            console.log("Ready to update..");
          }
        });
        addEmployee();
      });
  });
};

const updateRole = () => {
  connection.query("SELECT * FROM role", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices() {
            const roleArray = [];
            results.forEach(({ title }) => {
              roleArray.push(title);
            });
            return roleArray;
          },
          message: "Which role would you like to update?",
        },
      ])
      .then((answer) => {
        let chosenRole;
        results.forEach((role) => {
          if (role.title === answer.choice) {
            chosenRole = role;
            connection.query("DELETE FROM role WHERE ?", [
              {
                title: answer.choice,
              },
            ]);
          } else {
            console.log("Ready to update..");
          }
        });
        addRole();
      });
  });
};

const updateDepartment = () => {
  connection.query("SELECT * FROM department", (err, results) => {
    if (err) throw err;
    inquirer
      .prompt([
        {
          name: "choice",
          type: "rawlist",
          choices() {
            const departmentArray = [];
            results.forEach(({ name }) => {
              departmentArray.push(name);
            });
            return departmentArray;
          },
          message: "Which department would you like to update?",
        },
      ])
      .then((answer) => {
        let chosenDepartment;
        results.forEach((department) => {
          if (department.title === answer.choice) {
            chosenDepartment = department;
            connection.query("DELETE FROM department WHERE ?", [
              {
                title: answer.choice,
              },
            ]);
          } else {
            console.log("Ready to update..");
          }
        });
        addDepartment();
      });
  });
};

connection.connect((err) => {
  if (err) throw err;

  initialPrompt();
});
