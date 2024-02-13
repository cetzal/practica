ALTER TABLE users ADD COLUMN user_parent_id int UNSIGNED;
ALTER TABLE users 
ADD FOREIGN KEY (user_parent_id) REFERENCES users(id);
