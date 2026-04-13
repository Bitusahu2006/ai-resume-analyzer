# 🚀 AI Resume Analyzer

A modern, full-stack resume analysis tool powered by Groq AI that helps job seekers optimize their resumes for ATS compatibility and get AI-powered improvement suggestions.

## ✨ Features

- 📊 **ATS Compatibility Score** - Get instant feedback on how well your resume matches Applicant Tracking Systems
- 🎯 **Skills Matching** - Detect matched and missing skills for your target job role
- 🤖 **AI-Powered Suggestions** - Get intelligent recommendations from Groq LLM to improve your resume
- 📈 **Visual Analytics** - Interactive charts showing your skills profile and ATS compatibility
- 🔐 **Secure & Private** - Your resume data is encrypted and secure
- 🎨 **Modern UI** - Responsive, professional neumorphism design
- 👤 **User Authentication** - JWT-based authentication system

## 🛠️ Tech Stack

### Frontend
- **HTML5, CSS3, JavaScript** - Modern responsive design
- **Font Awesome Icons** - Professional iconography
- **Chart.js** - Interactive data visualization
- **Neumorphism UI** - Contemporary design pattern

### Backend
- **FastAPI** (Python) - High-performance REST API
- **MySQL** - Persistent data storage
- **Groq API** - AI-powered suggestions
- **PyJWT** - Secure authentication
- **PyMuPDF** - PDF document parsing

## 📦 Installation

### Prerequisites
- Python 3.8+
- MySQL Server running locally
- Groq API Key (get it from [Groq Console](https://console.groq.com))

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/ai-resume-analyzer.git
cd ai-resume-analyzer
```

### 2. Create Virtual Environment
```bash
python -m venv .venv

# On Windows:
.venv\Scripts\activate

# On macOS/Linux:
source .venv/bin/activate
```

### 3. Install Backend Dependencies
```bash
pip install -r backend/requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
```

### 5. Setup MySQL Database
```bash
mysql -u root -p
```

Run the SQL setup script:
```sql
CREATE DATABASE resume_analyzer_db;
USE resume_analyzer_db;

-- Users table
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Job roles table
CREATE TABLE job_roles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(255) UNIQUE NOT NULL,
    required_skills TEXT NOT NULL
);

-- Resumes table
CREATE TABLE resumes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    file_name VARCHAR(255),
    match_score FLOAT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Feedback table
CREATE TABLE feedback (
    id INT AUTO_INCREMENT PRIMARY KEY,
    resume_score FLOAT,
    user_rating INT,
    user_comment TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Sample job roles
INSERT INTO job_roles (role_name, required_skills) VALUES
('Senior Software Engineer', 'Python, JavaScript, SQL, REST API, Docker, Git, System Design'),
('Data Scientist', 'Python, Machine Learning, TensorFlow, Pandas, SQL, Tableau, Statistics'),
('Full Stack Developer', 'JavaScript, React, Node.js, MongoDB, HTML, CSS, Git'),
('DevOps Engineer', 'Docker, Kubernetes, AWS, CI/CD, Linux, Terraform, Jenkins'),
('UI/UX Designer', 'Figma, Adobe XD, Wireframing, Prototyping, CSS, UX Research');
```

## 🚀 Running the Application

### Start Backend Server
```bash
cd backend
python main.py
```
Backend will run on `http://localhost:8000`

### Start Frontend Server
```bash
# Open a new terminal in the project root
python -m http.server 3000 --directory frontend
```
Frontend will run on `http://localhost:3000`

### Or Use the Batch Scripts
```bash
# Windows
start.bat

# PowerShell
.\start.ps1
```

## 📖 Usage

1. **Open Application** - Go to http://localhost:3000
2. **Sign Up/Login** - Create an account or log in
3. **Upload Resume** - Choose a PDF, DOCX, or TXT file
4. **Select Job Role** - Pick your target position
5. **Get Analysis** - View ATS score, matched/missing skills, and visual charts
6. **View Suggestions** - Get AI-powered improvement recommendations
7. **Submit Feedback** - Help us improve the tool

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/signup` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/verify-token` - Verify JWT token

### Analysis
- `POST /api/analyze-resume` - Analyze resume
- `GET /api/job-roles` - Get available job roles

### AI Features
- `POST /api/get-suggestions` - Get AI suggestions
- `POST /api/generate-latex-ai` - Generate LaTeX from resume (AI-powered extraction)

### Feedback
- `POST /api/submit-feedback` - Submit user feedback
- `GET /api/health` - Health check

## 📁 Project Structure

```
ai-resume-analyzer/
├── frontend/
│   ├── index.html              # Main page
│   ├── preview.html            # Templates preview
│   ├── css/
│   │   ├── styles.css          # Main styles (neumorphism)
│   │   └── preview-styles.css  # Preview page styles
│   ├── js/
│   │   ├── script.js           # Main application logic
│   │   ├── preview.js          # Preview page logic
│   │   └── new-features.js     # New features
│   └── pdfs/
│       └── README.md           # PDF resources
├── backend/
│   ├── main.py                 # FastAPI application
│   ├── requirements.txt        # Python dependencies
│   └── create_tables.py        # Database initialization
├── .env                        # Environment variables (git ignored)
├── .gitignore                  # Git ignore file
├── README.md                   # This file
├── start.bat                   # Windows startup script
└── start.ps1                   # PowerShell startup script
```

## 🔐 Environment Variables

Create a `.env` file with:
```env
GROQ_API_KEY=your_api_key_here
```

**Note:** `.env` file is git-ignored. Never commit sensitive keys.

## 🐛 Troubleshooting

### MySQL Connection Error
- Ensure MySQL server is running
- Check localhost credentials in `backend/main.py`
- Verify database exists: `CREATE DATABASE resume_analyzer_db;`

### 422 Unprocessable Entity Error
- Clear browser cache (Ctrl+Shift+Delete)
- Restart backend server
- Check API endpoint JSON format

### GROQ API Errors
- Verify API key is correct in `.env`
- Check Groq quota on console.groq.com
- Ensure API key has appropriate permissions

### Port Already in Use
```bash
# Windows - Kill process on port 8000
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -ti:8000 | xargs kill -9
```

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see LICENSE file for details.

## 👨‍💻 Author

**Your Name/Team**
- GitHub: [@yourusername](https://github.com/yourusername)
- LinkedIn: [Your Profile](https://linkedin.com/in/yourprofile)

## 🙏 Acknowledgments

- [Groq](https://groq.com) - AI API platform
- [FastAPI](https://fastapi.tiangolo.com) - Modern web framework
- [Chart.js](https://www.chartjs.org) - JavaScript charting library
- [Font Awesome](https://fontawesome.com) - Icon library

## 📧 Support

For issues, questions, or suggestions:
1. Check [Issues](https://github.com/yourusername/ai-resume-analyzer/issues)
2. Create a new issue with detailed description
3. Include error logs and steps to reproduce

---

**Made with ❤️ for job seekers everywhere**
