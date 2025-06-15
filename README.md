# 📘 Professional Guestbook

A modern, professional guestbook web application built with Flask and SQLite. Allow visitors to leave messages and share their thoughts in a clean, responsive interface.

![Python](https://img.shields.io/badge/python-v3.7+-blue.svg)
![Flask](https://img.shields.io/badge/flask-v2.3+-green.svg)
![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Status](https://img.shields.io/badge/status-active-success.svg)

## 🌟 Features

- **Modern Professional Design** - Clean, corporate-style interface
- **Real-time Message Display** - Auto-refreshing message feed
- **Input Validation** - Client and server-side validation with character counters
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **SQLite Database** - Lightweight, file-based database storage
- **RESTful API** - JSON endpoints for easy integration
- **Spam Protection** - Basic spam detection and filtering
- **Professional Typography** - Clean, readable fonts and layout
- **Smooth Animations** - Subtle animations for better user experience
- **Error Handling** - Comprehensive error handling and user feedback

## 🚀 Demo

![Guestbook Demo](demo-screenshot.png)

*Professional interface with real-time message updates*

## 📋 Table of Contents

- [Installation](#installation)
- [Usage](#usage)
- [API Endpoints](#api-endpoints)
- [Project Structure](#project-structure)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## 🛠️ Installation

### Prerequisites

- Python 3.7 or higher
- pip (Python package installer)

### Quick Start

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/professional-guestbook.git
   cd professional-guestbook
   ```

2. **Create a virtual environment** (recommended)
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the application**
   ```bash
   python app.py
   ```

5. **Open your browser**
   ```
   http://localhost:5000
   ```

## 🎯 Usage

### For Visitors

1. **Leave a Message**: Fill in your name and message, then click "Post Message"
2. **View Messages**: Scroll down to see all messages from other visitors
3. **Real-time Updates**: Messages refresh automatically every 30 seconds

### For Developers

The application provides a clean API for integration:

```python
# Example: Adding a message programmatically
import requests

response = requests.post('http://localhost:5000/submit', json={
    'name': 'John Doe',
    'message': 'Hello from the API!'
})
```

## 🔌 API Endpoints

| Method | Endpoint | Description | Parameters |
|--------|----------|-------------|------------|
| `GET` | `/` | Main guestbook page | - |
| `POST` | `/submit` | Submit a new message | `name`, `message` |
| `GET` | `/messages` | Get all messages (JSON) | - |
| `GET/POST` | `/api/messages` | RESTful messages endpoint | - |

### API Examples

**Get all messages:**
```bash
curl http://localhost:5000/messages
```

**Submit a new message:**
```bash
curl -X POST http://localhost:5000/submit \
  -H "Content-Type: application/json" \
  -d '{"name": "Jane Smith", "message": "Great guestbook!"}'
```

**Response format:**
```json
[
  {
    "id": 1,
    "name": "Jane Smith",
    "message": "Great guestbook!",
    "timestamp": "2024-01-15T10:30:00"
  }
]
```

## 📁 Project Structure

```
professional-guestbook/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── db_utils.py           # Database utilities (optional)
├── guestbook.db          # SQLite database (auto-created)
├── README.md             # This file
├── LICENSE               # MIT License
├── .gitignore           # Git ignore rules
├── templates/
│   ├── index.html        # Main guestbook page
│   └── error.html        # Error page template
├── static/
│   ├── css/
│   │   └── style.css     # Professional styling
│   └── js/
│       └── app.js        # Frontend JavaScript
└── screenshots/
    └── demo-screenshot.png
```

## ⚙️ Configuration

### Environment Variables

Create a `.env` file for custom configuration:

```env
FLASK_ENV=development
FLASK_DEBUG=True
SECRET_KEY=your-secret-key-here
DATABASE_PATH=guestbook.db
PORT=5000
HOST=0.0.0.0
```

### Database Configuration

The application uses SQLite by default. The database schema:

```sql
CREATE TABLE messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    timestamp TEXT NOT NULL
);
```

### Customization

**Change the color scheme:**
Edit `static/css/style.css` and modify the CSS variables:

```css
:root {
    --primary-color: #1e40af;
    --secondary-color: #3b82f6;
    --accent-color: #06b6d4;
}
```

**Modify validation rules:**
Edit the validation in `app.py`:

```python
def validate_message_data(name, message):
    # Customize validation rules here
    max_name_length = 50
    max_message_length = 500
```

## 🚀 Deployment

### Heroku Deployment

1. **Create a Heroku app**
   ```bash
   heroku create your-guestbook-app
   ```

2. **Add Procfile**
   ```
   web: python app.py
   ```

3. **Deploy**
   ```bash
   git push heroku main
   ```


   ```

## 🧪 Testing

Run the test suite:

```bash
python -m pytest tests/
```

Test API endpoints:

```bash
# Test GET endpoint
curl http://localhost:5000/messages

# Test POST endpoint
curl -X POST http://localhost:5000/submit \
  -H "Content-Type: application/json" \
  -d '{"name": "Test User", "message": "Test message"}'
```

## 🔧 Development

### Setting up for development

1. **Install development dependencies**
   ```bash
   pip install -r requirements-dev.txt
   ```

2. **Run in debug mode**
   ```bash
   export FLASK_ENV=development
   python app.py
   ```

3. **Database utilities**
   ```bash
   # Add sample data
   python db_utils.py

   # Clear all messages
   python -c "from db_utils import clear_all_messages; clear_all_messages()"
   ```

## 📊 Features Roadmap

- [ ] User authentication and profiles
- [ ] Message moderation system
- [ ] Email notifications for new messages
- [ ] Message categories and tags
- [ ] Export messages to PDF/CSV
- [ ] Multi-language support
- [ ] Advanced spam filtering
- [ ] Message reactions (like/dislike)
- [ ] Admin dashboard
- [ ] Message search functionality

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Add tests** for new functionality
5. **Commit your changes**
   ```bash
   git commit -m 'Add amazing feature'
   ```
6. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
7. **Open a Pull Request**

### Code Style

- Follow PEP 8 for Python code
- Use meaningful variable and function names
- Add comments for complex logic
- Write tests for new features

## 🐛 Bug Reports

Found a bug? Please create an issue with:

- **Bug description**
- **Steps to reproduce**
- **Expected behavior**
- **Screenshots** (if applicable)
- **Environment details** (OS, Python version, etc.)

## 📝 Changelog

### v1.0.0 (2024-01-15)
- Initial release
- Professional design implementation
- SQLite database integration
- RESTful API endpoints
- Responsive design
- Input validation and spam protection

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2025 SurjyaKamal Saha

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 👨‍💻 Author

**Your Name**
- GitHub: [@Surjya003](https://github.com/Surjya003)
- Email:surjyakamalsaha@gmail.com.com
- LinkedIn: [@surjyakamal-saha](https://www.linkedin.com/in/surjyakamal-saha-6a7553220/)
-portfolio:(https://surjya003.netlify.app/)

## 🙏 Acknowledgments

- Flask community for the excellent web framework
- SQLite for the lightweight database solution
- Contributors and testers who helped improve this project

## 📞 Support

If you like this project, please give it a ⭐ on GitHub!

For support, email your.email@example.com or create an issue on GitHub.

---

<div align="center">
  <p>Made with ❤️ by <a href="https://github.com/Surjya003">Surjyakamal Saha</a></p>
  <p>
    <a href="#top">Back to top ⬆️</a>
  </p>
</div>
```



### LICENSE

```text:LICENSE
MIT License

Copyright (c) 2024 Professional Guestbook

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.