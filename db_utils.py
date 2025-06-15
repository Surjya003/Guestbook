import sqlite3
import datetime
from contextlib import contextmanager

DATABASE = 'guestbook.db'

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def clear_all_messages():
    """Clear all messages from the database (useful for testing)"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('DELETE FROM messages')
        conn.commit()
        print("All messages cleared from database")

def add_sample_messages():
    """Add some sample messages for testing"""
    sample_messages = [
        ("Alice Johnson", "This is such a wonderful guestbook! Thanks for creating this space for us to share our thoughts."),
        ("Bob Smith", "Great work on the design. Very clean and user-friendly!"),
        ("Carol Davis", "Hello from New York! 👋 Love the simplicity of this guestbook."),
        ("David Wilson", "Testing the message functionality. Everything works perfectly!"),
        ("Emma Brown", "What a lovely way to connect with other visitors. Keep up the great work! 🌟")
    ]
    
    with get_db_connection() as conn:
        cursor = conn.cursor()
        for name, message in sample_messages:
            timestamp = datetime.datetime.now().isoformat()
            cursor.execute('''
                INSERT INTO messages (name, message, timestamp)
                VALUES (?, ?, ?)
            ''', (name, message, timestamp))
        conn.commit()
        print(f"Added {len(sample_messages)} sample messages")

def get_message_count():
    """Get the total number of messages"""
    with get_db_connection() as conn:
        cursor = conn.cursor()
        cursor.execute('SELECT COUNT(*) FROM messages')
        count = cursor.fetchone()[0]
        return count

if __name__ == '__main__':
    print(f"Current message count: {get_message_count()}")
    
    # Uncomment the following lines to add sample data or clear database
    # add_sample_messages()
    # clear_all_messages()