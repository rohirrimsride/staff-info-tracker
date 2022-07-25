const inquirer = require('inquirer');
const db = require('../db/connection');
const cTable = require('console.table');
const CompanyHub = require('./dashboard');
const Department = require('../lib/Department');

// Begin functions to add a new Department to the database
// Requests relevant information from user and passes to update function
function addNewDepartment(parent) {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'department',
                message: 'What is the name of the department?',
                validate: nameInput => {
                    console.log(nameInput);
                    if (nameInput) {
                        return true;
                    } else if (!nameInput) {
                        console.log("You haven't provided a name for the new department.");
                        return false;
                    }
                },
            },
        ])
        .then((newDepartment) => {
            const departmentName = new Department(newDepartment.department)
            updateDepartmentsTable(parent, departmentName);
        })
        .catch((err) => {
            console.log(err);
            return;
        });
};

// adds new department to the departments Table
function updateDepartmentsTable(parent, departmentName) {
    const sql = `INSERT INTO departments (name) 
                VALUES (?)`;
    const params = [departmentName.department];

    db.query(sql, params, (err, rows) => {
        if (err) {
            console.log(err);
            return;
        }
        console.log(`Added ${departmentName.department} to the database.`);
        return parent.companyDashboard();
    });
};
// End functions to add a new Department to the database.

module.exports = addNewDepartment;