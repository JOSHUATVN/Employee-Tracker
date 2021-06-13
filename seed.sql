USE employee_db;

INSERT INTO department(department_name)
VALUES
('Sales'),
('Managment'),
('Accounting'),
('Quality Control'),
('Reception'),
('Supplier Relations'),
('Warehouse Crew'),
('Customer Service');


INSERT INTO employees(first_name, last_name, role_id, manager_id)
VALUES
('Micheal', 'Scott', 2,),
('Jim', 'Halpert', ,),
('Pamela', 'Beasly', ,),
('Jan', 'Levinson', ,),
('Roy', 'Anderson', ,),
('Creed', 'Bratton', ,),
('Meredith', 'Palmer', ,),
('Angela', 'Martin', ,),
('Kevin', 'Malone', ,),
('Oscar', 'Martinez', ,),
('Phyllis', 'Lapin', ,),
('Stanley', 'Hudson', ,),
('Todd', 'Packer', ,),
('Dwight', 'Schrute', ,),
('Ryan', 'Howard', ,),
('Kelly','Kapoor', ,),
('Darrel','Philbin', ,),
('Toby','Flenderson', ,),
('Hidetoshi','Hasagawa', ,),
('Glenn','Tenner', ,),
('Nate','Nickerson', ,),
('Lonney','Collins', ,),
('Matt','Daly', ,),
('Madge','Madsen', ,),
('Jerry','DiCanio', ,),
('Phillip','Jones', ,),
('David','Wallace', ,);


INSERT INTO roles(title, salary, department_id)
VALUES
('Regional Manager', 80000, 2),
('Branch Manager', 50000, 2),
('Chief Financial Officer', 110000, 2),
('Head of Accounting', 60000, 3),
('Accounting',57000, 3),
('Sales Consultant', 40000, 4),
('Human Resources', 50000, 5),
('Foreman',45000, 6),
('Warehouse Crew', 30000, 6),
('Quality Control', 50000, 7),
('Customer Service', 50000, 8);




