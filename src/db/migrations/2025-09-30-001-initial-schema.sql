CREATE TABLE IF NOT EXISTS schema_migrations(
  id INT AUTO_INCREMENT PRIMARY KEY,
  version VARCHAR(50) NOT NULL,
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  applied_by VARCHAR(100) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS posts (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    user_id INT NOT NULL,
    content TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS likes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    post_id INT,
    comment_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (post_id) REFERENCES posts(id) ON DELETE CASCADE,
    FOREIGN KEY (comment_id) REFERENCES comments(id) ON DELETE CASCADE,
    CHECK (post_id IS NOT NULL OR comment_id IS NOT NULL),
    CHECK (NOT (post_id IS NOT NULL AND comment_id IS NOT NULL))
);

CREATE INDEX idx_user_id ON posts(user_id);
CREATE INDEX idx_post_id ON comments(post_id);
CREATE INDEX idx_comment_user_id ON comments(user_id);
CREATE INDEX idx_username ON users(username);
CREATE INDEX idx_email ON users(email);
CREATE INDEX idx_post_created_at ON posts(created_at);
CREATE INDEX idx_comment_created_at ON comments(created_at);
CREATE INDEX idx_like_user_id ON likes(user_id);
CREATE INDEX idx_like_post_id ON likes(post_id);
CREATE INDEX idx_like_comment_id ON likes(comment_id);

INSERT INTO schema_migrations (version, applied_by) VALUES ('2025-09-30-001', 'migration_script');