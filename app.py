from flask import Flask, render_template, request, jsonify, redirect, url_for
import sqlite3
import datetime
import os
from contextlib import contextmanager

app = Flask(__name__)
app.config['SECRET_KEY'] = 'your-secret-key-here'

# Database configuration
DATABASE = 'guestbook.db'

def init_db():
    """Initialize the database with the messages table"""
    with sqlite3.connect(DATABASE) as conn:
        cursor = conn.cursor()
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS messages (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT NOT NULL,
                message TEXT NOT NULL,
                timestamp TEXT NOT NULL
            )
        ''')
        
        # Check if we have any messages, if not, add a welcome message
        cursor.execute('SELECT COUNT(*) FROM messages')
        count = cursor.fetchone()[0]
        
        if count == 0:
            cursor.execute('''
                INSERT INTO messages (name, message, timestamp)
                VALUES (?, ?, ?)
            ''', (
                'Welcome Bot',
                'Welcome to our guestbook! Feel free to leave your thoughts and messages here.',
                datetime.datetime.now().isoformat()
            ))
        
        conn.commit()

@contextmanager
def get_db_connection():
    """Context manager for database connections"""
    conn = sqlite3.connect(DATABASE)
    conn.row_factory = sqlite3.Row  # This enables column access by name
    try:
        yield conn
    finally:
        conn.close()

def validate_message_data(name, message):
    """Validate the message data"""
    errors = []
    
    if not name or not name.strip():
        errors.append("Name is required")
    elif len(name.strip()) > 50:
        errors.append("Name must be 50 characters or less")
    
    if not message or not message.strip():
        errors.append("Message is required")
    elif len(message.strip()) > 500:
        errors.append("Message must be 500 characters or less")
    
    return errors

# Routes
@app.route('/')
def index():
    """Show the homepage with the guestbook form"""
    return render_template('index.html')

@app.route('/submit', methods=['POST'])
def submit_message():
    """Accept and store new messages via POST"""
    try:
        # Get data from request
        if request.is_json:
            data = request.get_json()
            name = data.get('name', '').strip()
            message = data.get('message', '').strip()
        else:
            name = request.form.get('name', '').strip()
            message = request.form.get('message', '').strip()
        
        # Validate data
        errors = validate_message_data(name, message)
        if errors:
            if request.is_json:
                return jsonify({'error': '; '.join(errors)}), 400
            else:
                return render_template('index.html', error='; '.join(errors), name=name, message=message)
        
        # Save to database
        timestamp = datetime.datetime.now().isoformat()
        
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                INSERT INTO messages (name, message, timestamp)
                VALUES (?, ?, ?)
            ''', (name, message, timestamp))
            conn.commit()
            
            # Get the inserted message
            message_id = cursor.lastrowid
            cursor.execute('SELECT * FROM messages WHERE id = ?', (message_id,))
            new_message = cursor.fetchone()
        
        # Return response based on request type
        if request.is_json:
            return jsonify({
                'id': new_message['id'],
                'name': new_message['name'],
                'message': new_message['message'],
                'timestamp': new_message['timestamp']
            }), 201
        else:
            return redirect(url_for('index'))
            
    except Exception as e:
        print(f"Error submitting message: {e}")
        if request.is_json:
            return jsonify({'error': 'Failed to save message'}), 500
        else:
            return render_template('index.html', error='Failed to save message')

@app.route('/messages', methods=['GET'])
def get_messages():
    """Send stored messages in JSON format to frontend"""
    try:
        with get_db_connection() as conn:
            cursor = conn.cursor()
            cursor.execute('''
                SELECT id, name, message, timestamp 
                FROM messages 
                ORDER BY timestamp DESC
            ''')
            messages = cursor.fetchall()
        
        # Convert to list of dictionaries
        messages_list = []
        for message in messages:
            messages_list.append({
                'id': message['id'],
                'name': message['name'],
                'message': message['message'],
                'timestamp': message['timestamp']
            })
        
        return jsonify(messages_list)
        
    except Exception as e:
        print(f"Error fetching messages: {e}")
        return jsonify({'error': 'Failed to fetch messages'}), 500

@app.route('/api/messages', methods=['GET', 'POST'])
def api_messages():
    """API endpoint that handles both GET and POST for messages"""
    if request.method == 'GET':
        return get_messages()
    elif request.method == 'POST':
        return submit_message()

# Error handlers
@app.errorhandler(404)
def not_found(error):
    return render_template('error.html', error="Page not found"), 404

@app.errorhandler(500)
def internal_error(error):
    return render_template('error.html', error="Internal server error"), 500

if __name__ == '__main__':
    # Initialize database
    init_db()
    
    # Run the app
    app.run(debug=True, host='0.0.0.0', port=5000)