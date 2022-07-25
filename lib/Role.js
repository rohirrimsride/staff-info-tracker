const Department = require("./Department");

class Role extends Department {
    constructor(title, salary, department) {
        super(department);
        this.title = title;
        this.salary = salary;
    }

    getTitle() {
        return this.title;
    }

    getSalary() {
        return this.salary;
    }
}

module.exports = Role;