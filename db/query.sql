SELECT *
FROM role
JOIN department ON roles.department_id = department.id;

SELECT *
FROM employee
JOIN role ON employee.role_id = roles.id;