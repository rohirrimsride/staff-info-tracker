const inquirer = require('inquirer');
const db = require('../db/connection');
const cTable = require('console.table');
const { addNewDepartment, getCurrentDepartments } = require('./add-table-fields.js');
// const getCurrentDepartments = require('./add-table-fields.js');

function CompanyHub() {
    
}

CompanyHub.prototype.companyDashboard = function() {
    inquirer
        .prompt({
            type: 'rawlist',
            name: 'selection',
            message: "What would you like to do?",
            choices: ['View All Employees', 'Add Employee', 'Update Employee Role', 
                'View All Roles', 'Add Role', 'View All Departments', 'Add Department']
        })
        .then(({ selection }) => {
            if (selection === 'View All Employees') {
                this.viewEmployees();
            }
            if (selection === 'View All Roles') {
                this.viewRoles();
            }
            if (selection === 'View All Departments') {
                this.viewDepartments();
            }
            if (selection === 'Add Department') {
                addNewDepartment(this);
            }
            if (selection === 'Add Role') {
                getCurrentDepartments(this);
            }
        });
};

// Connects to the Department Table and display results.
CompanyHub.prototype.viewDepartments = function() {
    const sql = `SELECT departments.id, departments.name FROM departments`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('\n', '\n');
        console.log('Departments');
        console.log(rows);
        console.table(rows);
        return this.companyDashboard();
    });
};

// Connects to the Roles Table and displays the results.
CompanyHub.prototype.viewRoles = function() {
    const sql = `SELECT roles.id, roles.title, 
                departments.name AS department , roles.salary 
                FROM roles
                LEFT JOIN departments
                ON roles.department_id = departments.id`;

    db.query(sql, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log('\n', '\n');
        console.log('Roles');
        console.table(rows);
        return this.companyDashboard();
    });
}

// Connects to Employee Table and displays the results.
CompanyHub.prototype.viewEmployees = function() {
    const sql = `SELECT employees.id, employees.first_name, employees.last_name, 
                roles.title AS title, 
                departments.name AS department, 
                roles.salary AS salary, 
                employees.manager_id AS manager
                FROM employees
                LEFT JOIN roles
                ON employees.role_id = roles.id
                LEFT JOIN departments
                ON roles.department_id = departments.id`;

    db.query(sql, (err, rows) => {
        if (err) {
        console.log(err);
        return;
        }
        console.log('\n', '\n');
        console.log('Employees');
        console.table(rows);
        return this.companyDashboard();
    });
}



module.exports = CompanyHub;