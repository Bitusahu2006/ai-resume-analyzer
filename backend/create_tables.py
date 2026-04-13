import mysql.connector
from datetime import datetime

# Connect to MySQL
connection = mysql.connector.connect(
    host="localhost",
    user="root",
    password="Bitu@123",
    database="resume_analyzer_db"
)

cursor = connection.cursor()

try:
    # Create users table
    cursor.execute("""
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        full_name VARCHAR(255) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_email (email)
    )
    """)
    print("✓ Users table created/verified")
    
    # Check if resumes table exists and add user_id column
    cursor.execute("SHOW TABLES LIKE 'resumes'")
    if cursor.fetchone():
        try:
            cursor.execute("ALTER TABLE resumes ADD COLUMN user_id INT")
            print("✓ Added user_id column to resumes table")
        except:
            print("✓ user_id column already exists in resumes table")
        
        try:
            cursor.execute("ALTER TABLE resumes ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")
            print("✓ Added foreign key to resumes table")
        except:
            print("✓ Foreign key already exists in resumes table")
    
    # Check if feedback table exists and add user_id column
    cursor.execute("SHOW TABLES LIKE 'feedback'")
    if cursor.fetchone():
        try:
            cursor.execute("ALTER TABLE feedback ADD COLUMN user_id INT")
            print("✓ Added user_id column to feedback table")
        except:
            print("✓ user_id column already exists in feedback table")
        
        try:
            cursor.execute("ALTER TABLE feedback ADD FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE")
            print("✓ Added foreign key to feedback table")
        except:
            print("✓ Foreign key already exists in feedback table")
    
    connection.commit()
    print("\n✅ Database initialized successfully!")
    
except Exception as e:
    print(f"❌ Error: {e}")
    connection.rollback()
finally:
    cursor.close()
    connection.close()
