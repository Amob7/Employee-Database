const inquirer = require('inquirer');
const choices = [
    "view all departments",
    "view all roles",
    "view all employees",
    "add a department",
    "add a role",
    "add an employee",
    "update an eployee role"
]

function run () {
    inquirer
        .prompt([
            {
                type: 'list',
                message: "Pick a choice",
                choices: choices,
                name: choices,
            }
        ])
        .then((data) => {
            if (data.choices[0]){
                viewDepartments();
            }
            else if(data.choices === choices[1]) {
                viewRoles();
            }
            else if(data.choices === choices[2]) {
                viewEmployees();
            }
            else if(data.choices === choices[3]) {
                addDepartment();
            }
            else if(data.choices === choices[4]) {
                addRole();
            }
            else if(data.choices === choices[5]) {
                addEmployee();
            }
            // else if(data.choices === choices[6]) {
            //     updateRole();
            // }
            else {
                console.log("How")
            }
        })
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

module.exports = run;