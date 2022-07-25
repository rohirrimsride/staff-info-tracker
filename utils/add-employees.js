const inquirer = require('inquirer');
const db = require('../db/connection');
const cTable = require('console.table');
const CompanyHub = require('./dashboard');
const Employee = require('../lib/Employee');

// Begin functions to add a new Employee to the database
// Pulls the list of roles from the database to add as choices to the addNewEmployee title prompt
function getCurrentRoles(parent) {
    const sql1 = `SELECT roles.title FROM roles`;
    const roles = [];
    db.query(sql1, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let iteration = rows[i].title;
            roles.push(iteration);
        }
        getCurrentManagers(parent, roles);
    });
};

// Pulls the list of managers from the database to add as choices to the addNewEmployee manager prompt
function getCurrentManagers(parent, roles) {
    const sql2 = `SELECT id,
                    first_name AS first,
                    last_name AS last
                    FROM employees`;
    let managers = [];
    let noManager = 'None';
    managers.push(noManager);
    db.query(sql2, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let iteration = rows[i].first.concat(' ').concat(rows[i].last);
            managers.push(iteration);
        }
        addNewEmployee(parent, roles, managers, rows)
    });
};

// gets the new Employee info from the user
function addNewEmployee(parent, roles, managers, employeeList) {

    inquirer
        .prompt([
            {
                type: 'input',
                name: 'first_name',
                message: "What is the employee's first name?",
                validate: first_nameInput => {
                    if (first_nameInput) {
                        return true;
                    } else {
                        console.log("You forgot to provide the employee's first name.");
                        return false;
                    }
                },
            },
            {
                type: 'input',
                name: 'last_name',
                message: "What is the employee's last name?,",
                validate: last_nameInput => {
                    if (last_nameInput) {
                        return true;
                    } else {
                        console.log("You forgot to provide the employee's last name.");
                        return false;
                    }
                },
            },
            {
                type: 'rawlist',
                name: 'title',
                message: "What is the employee's role?",
                choices: roles
            },
            {
                type: 'rawlist',
                name: 'manager',
                message: "Who is the employee's manager?",
                choices: managers 
            }
        ])
        .then((newEmployee) => {
            // console.log(newEmployee);
            const employee = new Employee(newEmployee.first_name, newEmployee.last_name, newEmployee.title, newEmployee.manager);
            updateEmployeesTable(parent, roles, employee, employeeList);
        })
        .catch((err) => {
            console.log(err);
            return;
        });
};

function updateEmployeesTable(parent, roles, employee, employeeList) {

    let role_id;
    for (let i = 0; i < roles.length; i++) {
        if (employee.title === roles[i]) {
            role_id = roles.indexOf(roles[i]) + 1;
        }
    }
    
    let manager_id;
    for (let i = 0; i < employeeList.length; i++) {
        if (employee.manager === employeeList[i].first.concat(' ').concat(employeeList[i].last)) {
            manager_id = employeeList[i].id;
        } else if (employee.manager === 'None') {
            manager_id = null;
        } 
    }
    
    const sql = `INSERT INTO employees (first_name, last_name, role_id, manager_id) 
                VALUES (?,?,?,?)`;
    const params = [employee.first_name, employee.last_name, role_id, manager_id];

    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Added ${employee.first_name.concat(' ').concat(employee.last_name)} to the database.`);
        return parent.companyDashboard();
    });
};

module.exports = getCurrentRoles;