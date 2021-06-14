USE employee_db;

INSERT INTO department(department_name)
VALUES
('Sales'),
('Managment'),
('Accounting'),
('Quality Control'),
('Reception'),
('Supplier Relations'),
('Customer Service');


INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('Micheal', 'Scott', 2,3),
('Jim', 'Halpert',3 ,0),
('Pamela', 'Beasly',4 ,0),
('Creed', 'Bratton',6 ,0),
('Meredith', 'Palmer',6 ,0),
('Angela', 'Martin',8 ,0),
('Kevin', 'Malone',8 ,0),
('Oscar', 'Martinez',8 ,0),
('Phyllis', 'Lapin',3 ,0),
('Stanley', 'Hudson',3 ,0),
('Dwight', 'Schrute',3 ,0),
('Ryan', 'Howard',3 ,0),
('Kelly','Kapoor',9 ,0),

INSERT INTO roles(title, salary, department_id)
VALUES
('Branch Manager', 50000, 2),
('Accounting',57000, 3),
('Sales Consultant', 40000, 4),
('Human Resources', 50000, 5),
('Quality Control', 50000, 7),
('Customer Service', 50000, 8);




