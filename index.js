const mysql = require('mysql2');
const inquirer = require('inquirer');
console.log(`
 _________________________________________
|                                         |
|            Employee                     |
|                 Database                |
|_________________________________________|
`);

const db = mysql.createConnection(
  {
    host: 'localhost',
    user: 'root',
    password: 'Lampmaker77?',
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db`)
  
);

const choices = [
  "view all departments",
  "view all roles",
  "view all employees",
  "add a department",
  "add a role",
  "add an employee",
  "update an employee role"
]

function run () {
  inquirer
      .prompt([
          {
              type: 'list',
              message: "Pick a choice",
              choices: choices,
              name: "choice",
          }
      ])
      .then((data) => {
          if (data.choice === choices[0]){
              viewDepartments();
          }
          else if(data.choice === choices[1]) {
              viewRoles();
          }
          else if(data.choice === choices[2]) {
              viewEmployees();
          }
          else if(data.choice === choices[3]) {
              addDepartment();
          }
          else if(data.choice === choices[4]) {
              addRole();
          }
          else if(data.choice === choices[5]) {
              addEmployee();
          }
          else if(data.choice === choices[6]) {
              updateRole();
          }
          else {
              console.log("How")
          }
      })
      .catch((err) => console.log(err))
}

function viewDepartments() {
  db.query(`SELECT * FROM department;`, (err, results) => {
      if (err) {
          console.error(err);
      }
      console.table(results);
      run();
  });
}

function viewRoles() {
  db.query(`SELECT * FROM roles;`, (err, results) => {
      if (err) {
          console.error(err);
      }
      console.table(results);
      run();
  });
}

function viewEmployees() {
  db.query(`SELECT * FROM employee;`, (err, results) => {
      if (err) {
          console.error(err);
      }
      console.table(results);
      run();
  });
}

function addDepartment() {
    console.log("HI")
  inquirer
      .prompt([
          {
              type: 'input',
              message: "Department name you would like to add: ",
              name: "newDepartment"
          }
      ])
      .then((data) => {
          db.query(`INSERT INTO department(name) VALUES (?)`, data.newDepartment,  (err) => {
              if (err) {
                  console.error(err);
              }
              console.log(`${data.newDepartment} was successfully added :)`);
              run();
          });
      });
}

function addRole() {
  inquirer
      .prompt([
          {
              type: 'input',
              message: "Name of the role you would like to add: ",
              name: "newRole"
          },
          {
              type: 'input',
              message: "Salary of the role you would like to add: ",
              name: "newSalary"
          },
          {
              type: 'input',
              message: "Department of the role you would like to add: ",
              name: "roleDep"
          }
      ])
      .then((data) => {
          db.query(`SELECT * FROM department WHERE name = ?;`, data.roleDep, (err, results) => {
              if (err) {
                  console.error(err);
              }
              db.query(`INSERT INTO roles (title, salary, department_id) VALUES (?, ?, ?);`,
              [data.newRole, data.newSalary, results[0].id],
                  (err) => {
                      if (err) {
                          console.error(err);
                      }
                      console.log(`${data.newRole} was successfully added :)`);
                      run();
                  });
          });
      });
}

function addEmployee() {
  inquirer
      .prompt([
          {
              type: 'input',
              message: "First name of the employee you would like to add: ",
              name: "addFirstName"
          },
          {
              type: 'input',
              message: "Last name of the role you would like to add: ",
              name: "addLastName"
          },
          {
              type: 'input',
              message: "Role of the employee you would like to add: ",
              name: "addEmpRole"
          },
          {
              type: 'input',
              message: "Manager of the employee you would like to add: ",
              name: "addEmpManager"
          }
      ])
      .then((data) => {
          db.promise().query("SELECT * FROM role WHERE title = ?;", data.addEmpRole)
              .then(([res]) => {
                  db.promise().query("SELECT * FROM manager WHERE name = ?;", data.addEmpManager)
                      .then(([results]) => {
                          db.query(`INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?);`,
                              [data.addFirstName, data.addLastName, res[0].id, results[0].id],
                              (err) => {
                                  if (err) {
                                      console.error(err);
                                  }
                                  console.log(`${data.addFirstName} ${data.addLastName} was successfully added :)`);
                                  run();
                              })
                      })
              })
      })
}

function updateRole() {
    inquirer
        .prompt([
            {
                type: 'input',
                message: 'First name of the employee you would like to update:',
                name: 'updatedFirst'
            },
            {
                type: 'input',
                message: 'Last name of the employee you would like to update: ',
                name: 'updateLast'
            },
            {
                type: 'input',
                message: "New Role you would like to add: ",
                name: 'updateRole'
            }
        ])
        .then((data) => {
            db.promise().query("SELECT * FROM role WHERE title = ?;", data.updateRole)
                .then(([res]) => {
                    db.query(`UPDATE employee SET employee.role_id = ? WHERE employee.first_name = ? AND employee.last_name = ?;`,
                        [res[0].id, data.updateFirst, data.updateLast], (err) => {
                            if (err) {
                                console.log(err);
                            }
                            console.log(`${data.updateFirst}'s has been changed :)`);
                            run();
                        })
                })
        })
}

run();