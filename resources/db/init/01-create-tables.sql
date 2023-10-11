CREATE TABLE IF NOT EXISTS tasks (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  status BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS lists (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  description VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks_lists (
  task_id INT NOT NULL,
  list_id INT NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
  PRIMARY KEY (task_id, list_id),
  FOREIGN KEY (task_id)
      REFERENCES tasks (id),
  FOREIGN KEY (list_id)
      REFERENCES lists (id)
);
