const inquirer = require('inquirer');
const db = require('../db/connection');
const cTable = require('console.table');
const CompanyHub = require('./dashboard');
const Role = require('../lib/Role');

// Begin functions to add a new Role to the database
// gets the most current list of departments to add to the choices of the last inquirer prompt.
function getCurrentDepartments(parent) {
    const sql = `SELECT departments.name FROM departments`;
    let departments = [];
    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        for (let i = 0; i < rows.length; i++) {
            let iteration = rows[i].name;
            departments.push(iteration);
        }
        addNewRole(parent, departments);
    });
};

// prompts user for information on what role is being added.
function addNewRole(parent, departments) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'title',
                message: "What is the name of the role?",
                validate: titleInput => {
                    if (titleInput) {
                        return true;
                    } else {
                        console.log("You haven't provided a name for the new role.");
                        return false;
                    }
                },
            },
            {
                type: 'input',
                name: 'salary',
                message: "What is the salary of the role?",
                validate: salaryInput => {
                    if (salaryInput) {
                        return true;
                    } else {
                        console.log("You haven't provided a salary for the new role.");
                        return false;
                    }
                },
            },
            {
                type: 'rawlist',
                name: 'department',
                message: "Which department does the role belong to?",
                choices: departments
            }
        ])
        .then((newRole) => {
            const createRole = new Role(newRole.title, newRole.salary, newRole.department)
            let departmentId;
            for (let i = 0; i < departments.length; i++) {
                if (createRole.department === departments[i]) {
                    departmentId = departments.indexOf(departments[i]) + 1;
                }
            }
            updateRolesTable(parent, createRole, departmentId);
        })
        .catch((err) => {
            if (err) {
                console.log(err);
                return;
            }
        });
};

// updates the database role table with the collected information.
function updateRolesTable(parent, createRole, department_id) {
    const sql = `INSERT INTO roles (title, salary, department_id) 
                VALUES (?,?,?)`;
    const params = [createRole.title, createRole.salary, department_id];

    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Added ${createRole.title} to the database.`);
        return parent.companyDashboard();
    });
};
// End functions to add a new Role to the database

module.exports = getCurrentDepartments;