// const Department = require("./Department");
const Role = require("./Role");

class Employee extends Role {
    constructor(firstName, lastName, title, manager) {
        super(title);
        this.first_name = firstName;
        this.last_name = lastName;
        this.manager = manager;
    }

    getFirstName() {
        return this.first_name;
    }

    getLastName() {
        return this.last_name;
    }

    getManager() {
        return this.manager;
    }
}

module.exports = Employee;