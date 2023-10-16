CREATE TABLE IF NOT EXISTS lists (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255),
  ext_id VARCHAR(255) UNIQUE,
  ext_subscription_id VARCHAR(255) UNIQUE,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE,
  description VARCHAR(255),
  is_done BOOLEAN NOT NULL DEFAULT FALSE,
  list_id INT,
  ext_id VARCHAR(255) UNIQUE,
  last_synced_at TIMESTAMP,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
  FOREIGN KEY (list_id)
      REFERENCES lists (id)
);

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  password VARCHAR(255),
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);

CREATE TABLE IF NOT EXISTS microsoft_integrations (
  id SERIAL PRIMARY KEY,
  user_id INT NOT NULL,
  access_token TEXT NOT NULL,
  id_token TEXT NOT NULL,
  refresh_token TEXT NOT NULL,
  expires_on TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL,
    FOREIGN KEY (user_id)
      REFERENCES users (id)
);

CREATE TABLE IF NOT EXISTS subscriptions (
  id SERIAL PRIMARY KEY,
  subscription_id VARCHAR(255) NOT NULL,
  resource VARCHAR(255) NOT NULL,
  ext_list_id VARCHAR(255) NOT NULL,
  expiration_date_time TIMESTAMP NOT NULL,
  created_at TIMESTAMP NOT NULL,
  updated_at TIMESTAMP NOT NULL
);
