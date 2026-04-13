from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import mysql.connector
from mysql.connector import Error
import fitz
import re
import time
from groq import Groq
import os
from dotenv import load_dotenv
from pydantic import BaseModel
from typing import List, Optional
import json
import jwt
from datetime import datetime, timedelta
from hashlib import sha256

# ====== LOAD ENV VARIABLES ======
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
groq_client = Groq(api_key=GROQ_API_KEY) if GROQ_API_KEY else None

# ====== JWT CONFIG ======
JWT_SECRET = "your-secret-key-change-in-production"
JWT_ALGORITHM = "HS256"
JWT_EXPIRATION_HOURS = 24

# ====== DATABASE CONFIG ======
DB_CONFIG = {
    "host": "localhost",
    "user": "root",
    "password": "Bitu@123",
    "database": "resume_analyzer_db"
}

# ====== FASTAPI APP ======
app = FastAPI(title="AI Resume Analyzer API", version="1.0.0")

# ====== CORS MIDDLEWARE ======
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ====== MODELS ======
class SignupRequest(BaseModel):
    email: str
    password: str
    full_name: str

class LoginRequest(BaseModel):
    email: str
    password: str

class AuthResponse(BaseModel):
    status: str
    message: str
    token: Optional[str] = None
    user: Optional[dict] = None

class SkillsResponse(BaseModel):
    matched_skills: List[str]
    missing_skills: List[str]
    ats_score: float
    target_role: str

class SuggestionsResponse(BaseModel):
    suggestions: str
    status: str

class FeedbackRequest(BaseModel):
    resume_score: float
    user_rating: int
    user_comment: str

# ====== DATABASE FUNCTIONS ======
def get_db_connection():
    try:
        conn = mysql.connector.connect(**DB_CONFIG)
        return conn
    except Error as e:
        print(f"Database error: {e}")
        return None

def fetch_job_roles():
    """Fetch all job roles and required skills from database"""
    conn = get_db_connection()
    if not conn:
        return []
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT role_name, required_skills FROM job_roles")
        roles = cursor.fetchall()
        return roles
    except Error as e:
        print(f"Fetch roles error: {e}")
        return []
    finally:
        conn.close()

def save_analysis(filename: str, score: float):
    """Save resume analysis to database"""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO resumes (user_id, file_name, match_score) VALUES (%s, %s, %s)",
            (1, filename, score)
        )
        conn.commit()
        return True
    except Error as e:
        print(f"Save analysis error: {e}")
        return False
    finally:
        conn.close()

def save_feedback(resume_score: float, user_rating: int, user_comment: str):
    """Save user feedback to database"""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor()
        cursor.execute(
            """
            INSERT INTO feedback (resume_score, user_rating, user_comment)
            VALUES (%s, %s, %s)
            """,
            (resume_score, user_rating, user_comment)
        )
        conn.commit()
        return True
    except Error as e:
        print(f"Feedback save error: {e}")
        return False
    finally:
        conn.close()

# ====== AUTHENTICATION FUNCTIONS ======
def hash_password(password: str) -> str:
    """Hash password using SHA256"""
    return sha256(password.encode()).hexdigest()

def create_jwt_token(user_id: int, email: str) -> str:
    """Create JWT token"""
    payload = {
        "user_id": user_id,
        "email": email,
        "exp": datetime.utcnow() + timedelta(hours=JWT_EXPIRATION_HOURS),
        "iat": datetime.utcnow()
    }
    token = jwt.encode(payload, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return token

def verify_jwt_token(token: str) -> dict:
    """Verify JWT token"""
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        return payload
    except jwt.ExpiredSignatureError:
        return None
    except jwt.InvalidTokenError:
        return None

def user_exists(email: str) -> bool:
    """Check if user already exists"""
    conn = get_db_connection()
    if not conn:
        return False
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        return user is not None
    except Error as e:
        print(f"User check error: {e}")
        return False
    finally:
        conn.close()

def create_user(email: str, password: str, full_name: str) -> Optional[dict]:
    """Create new user in database"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        hashed_password = hash_password(password)
        
        cursor.execute(
            "INSERT INTO users (email, password_hash, full_name, created_at) VALUES (%s, %s, %s, NOW())",
            (email, hashed_password, full_name)
        )
        conn.commit()
        
        # Return created user
        cursor.execute("SELECT id, email, full_name FROM users WHERE email = %s", (email,))
        return cursor.fetchone()
    except Error as e:
        print(f"User creation error: {e}")
        return None
    finally:
        conn.close()

def verify_user(email: str, password: str) -> Optional[dict]:
    """Verify user credentials"""
    conn = get_db_connection()
    if not conn:
        return None
    
    try:
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT id, email, full_name, password_hash FROM users WHERE email = %s", (email,))
        user = cursor.fetchone()
        
        if user and user['password_hash'] == hash_password(password):
            return {
                "id": user['id'],
                "email": user['email'],
                "full_name": user['full_name']
            }
        return None
    except Error as e:
        print(f"User verification error: {e}")
        return None
    finally:
        conn.close()

# ====== RESUME ANALYZER FUNCTIONS ======
def extract_text_from_pdf(file_content: bytes) -> str:
    """Extract text from PDF file"""
    try:
        doc = fitz.open(stream=file_content, filetype="pdf")
        text = ""
        for page in doc:
            text += page.get_text()
        doc.close()
        return text.strip()
    except Exception as e:
        print(f"PDF Read Error: {e}")
        return ""

def extract_text_from_file(file_content: bytes, filename: str) -> str:
    """Extract text from various file formats (PDF, DOCX, TXT)"""
    try:
        # Get file extension
        file_ext = filename.lower().split('.')[-1]
        
        if file_ext == 'pdf':
            return extract_text_from_pdf(file_content)
        
        elif file_ext in ['docx', 'doc']:
            # Extract from Word document
            try:
                from docx import Document
                from io import BytesIO
                doc = Document(BytesIO(file_content))
                text = "\n".join([paragraph.text for paragraph in doc.paragraphs])
                return text.strip()
            except Exception as e:
                print(f"DOCX Read Error: {e}")
                return ""
        
        elif file_ext == 'txt':
            # Extract from text file
            try:
                return file_content.decode('utf-8').strip()
            except:
                return file_content.decode('latin-1').strip()
        
        else:
            return ""
    except Exception as e:
        print(f"File extraction error: {e}")
        return ""

def match_skills(resume_text: str, required_skills_str: str) -> tuple:
    """Match skills between resume and required skills"""
    required_skills = [s.strip() for s in required_skills_str.split(",") if s.strip()]
    found = []
    
    for skill in required_skills:
        pattern = rf"\b{re.escape(skill)}\b"
        if re.search(pattern, resume_text, re.IGNORECASE):
            found.append(skill)
    
    missing = [s for s in required_skills if s not in found]
    score = (len(found) / len(required_skills)) * 100 if required_skills else 0
    
    return found, missing, score

def call_groq_ai(prompt: str, system_instruction: str) -> str:
    """Call Groq AI for suggestions"""
    if not groq_client:
        return None
    
    retries = 3
    for i in range(retries):
        try:
            response = groq_client.chat.completions.create(
                messages=[
                    {"role": "system", "content": system_instruction},
                    {"role": "user", "content": prompt}
                ],
                model="llama-3.3-70b-versatile",
            )
            return response.choices[0].message.content
        except Exception as e:
            if i < retries - 1:
                time.sleep(2)
            else:
                print(f"AI Error: {e}")
                return None

# ====== API ENDPOINTS ======

# ====== AUTHENTICATION ENDPOINTS ======
@app.post("/api/auth/signup")
async def signup(req: SignupRequest):
    """Register a new user"""
    # Validate inputs
    if not req.email or not req.password or not req.full_name:
        raise HTTPException(status_code=400, detail="Missing required fields")
    
    if len(req.password) < 6:
        raise HTTPException(status_code=400, detail="Password must be at least 6 characters")
    
    # Check if user exists
    if user_exists(req.email):
        raise HTTPException(status_code=409, detail="Email already registered")
    
    # Create user
    user = create_user(req.email, req.password, req.full_name)
    if not user:
        raise HTTPException(status_code=500, detail="Failed to create user")
    
    # Generate token
    token = create_jwt_token(user['id'], user['email'])
    
    return {
        "status": "success",
        "message": "Signup successful",
        "token": token,
        "user": {
            "id": user['id'],
            "email": user['email'],
            "full_name": user['full_name']
        }
    }

@app.post("/api/auth/login")
async def login(req: LoginRequest):
    """Login user"""
    if not req.email or not req.password:
        raise HTTPException(status_code=400, detail="Missing email or password")
    
    # Verify credentials
    user = verify_user(req.email, req.password)
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    # Generate token
    token = create_jwt_token(user['id'], user['email'])
    
    return {
        "status": "success",
        "message": "Login successful",
        "token": token,
        "user": user
    }

@app.post("/api/auth/verify-token")
async def verify_token(authorization: str = Header(None)):
    """Verify JWT token"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        # Extract token from "Bearer <token>" format
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        
        payload = verify_jwt_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        return {
            "status": "success",
            "message": "Token is valid",
            "user_id": payload.get("user_id"),
            "email": payload.get("email")
        }
    except ValueError:
        raise HTTPException(status_code=401, detail="Invalid authorization header format")
    except Exception as e:
        raise HTTPException(status_code=401, detail="Token verification failed")

@app.get("/api/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "ok", "message": "API is running"}

@app.get("/api/job-roles")
async def get_job_roles():
    """Get all available job roles"""
    roles = fetch_job_roles()
    if not roles:
        return {"status": "error", "message": "No job roles found"}
    
    role_names = [r["role_name"] for r in roles]
    return {"status": "success", "roles": role_names}

@app.post("/api/analyze-resume")
async def analyze_resume(file: UploadFile = File(...), job_role: str = Form(...)):
    """Analyze resume and return skill match"""
    try:
        # Read file
        content = await file.read()
        resume_text = extract_text_from_file(content, file.filename)
        
        if not resume_text:
            return {"status": "error", "message": "Could not extract text from file. Supported formats: PDF, Word (DOCX/DOC), Text (TXT)"}
        
        # Get job role requirements
        roles = fetch_job_roles()
        target = next((r for r in roles if r["role_name"] == job_role), None)
        
        if not target:
            return {"status": "error", "message": "Job role not found"}
        
        # Match skills
        found, missing, score = match_skills(resume_text, target["required_skills"])
        
        # Save analysis
        save_analysis(file.filename, score)
        
        return {
            "status": "success",
            "ats_score": round(score, 1),
            "matched_skills": found,
            "missing_skills": missing,
            "total_required": len(found) + len(missing),
            "resume_text_preview": resume_text,
            "resume_text_full": resume_text
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/get-suggestions")
async def get_suggestions(
    job_role: str = Form(...),
    matched_skills: str = Form(...),
    missing_skills: str = Form(...),
    resume_text: str = Form(...)
):
    """Get AI suggestions for resume improvement"""
    try:
        system_prompt = "You are an expert career coach and resume advisor. Provide specific, actionable suggestions to improve a resume for a specific job role."
        
        user_prompt = f"""
Target Job Role: {job_role}

Matched Skills: {matched_skills if matched_skills else 'None'}
Missing Skills: {missing_skills if missing_skills else 'None'}

Resume Summary:
{resume_text[:1500]}

Provide 5 specific suggestions to improve this resume for the {job_role} position:
1. Skills to highlight
2. Keywords to add
3. Experience gaps to address
4. Certifications/training recommendations
5. Format and presentation tips

Be concise and actionable.
"""
        
        suggestions = call_groq_ai(user_prompt, system_prompt)
        
        if suggestions:
            return {"status": "success", "suggestions": suggestions}
        else:
            return {"status": "error", "message": "Could not generate suggestions"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

@app.post("/api/submit-feedback")
async def submit_feedback(feedback: FeedbackRequest):
    """Submit user feedback"""
    try:
        success = save_feedback(
            feedback.resume_score,
            feedback.user_rating,
            feedback.user_comment
        )
        
        if success:
            return {"status": "success", "message": "Feedback saved successfully"}
        else:
            return {"status": "error", "message": "Could not save feedback"}
    except Exception as e:
        return {"status": "error", "message": str(e)}

# ====== AI-POWERED LATEX GENERATOR ======
@app.post("/api/generate-latex-ai")
async def generate_latex_ai(resume_text: str = Form(...), user_name: str = Form(...), user_email: str = Form(...), authorization: str = Header(None)):
    """Generate LaTeX code using AI to extract resume data"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Missing authorization header")
    
    try:
        # Verify token
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid authentication scheme")
        
        payload = verify_jwt_token(token)
        if not payload:
            raise HTTPException(status_code=401, detail="Invalid or expired token")
        
        # Use Groq AI to extract and structure resume data
        system_prompt = """You are an expert resume parser. Your task is to extract ALL resume information and structure it into valid JSON.

IMPORTANT: Extract ALL information from the resume. Be thorough and detailed.

Return ONLY this exact JSON structure (no markdown, no extra text):
{
    "education": [
        {
            "school": "University name",
            "degree": "Bachelor/Master/PhD in Field",
            "gpa": "3.8 or empty string",
            "graduation": "Month Year or Year"
        }
    ],
    "skills": {
        "Languages": ["Python", "Java", "C++"],
        "Technical Skills": ["Data Analysis", "Machine Learning"],
        "Tools": ["Git", "Docker", "Linux"],
        "Frameworks": ["Django", "React", "Flask"]
    },
    "projects": [
        {
            "title": "Project Name",
            "description": "2-3 line description of what you did and impact",
            "tech_stack": "Python, Django, MySQL",
            "link": "https://github.com/user/project"
        }
    ],
    "certifications": [
        {
            "name": "Certification Name",
            "platform": "Coursera/Udemy/etc",
            "link": "https://..."
        }
    ],
    "achievements": [
        "Achievement or award description",
        "Another achievement"
    ]
}

Extract every detail. If a field is missing, use empty string "" or empty array []."""
        
        user_prompt = f"""IMPORTANT: You MUST return ONLY valid JSON with no markdown, no extra text, no explanations.

Resume Text:
{resume_text}

Extract ALL information from above resume into this JSON format (with actual data):
{{
    "education": [{{"school": "...", "degree": "...", "gpa": "...", "graduation": "..."}}],
    "skills": {{"Languages": [...], "Technical Skills": [...], "Tools": [...], "Frameworks": [...]}},
    "projects": [{{"title": "...", "description": "...", "tech_stack": "...", "link": "..."}}],
    "certifications": [{{"name": "...", "platform": "...", "link": "..."}}],
    "achievements": ["..."]
}}

CRITICAL RULES:
1. Return ONLY the JSON object, nothing else
2. Do NOT use markdown code blocks
3. Do NOT add any explanations like "Here is the extracted data:"
4. Extract EVERY detail from the resume
5. Return valid JSON that can be parsed
6. Start your response with {{ and end with }}"""
        
        ai_response = call_groq_ai(user_prompt, system_prompt)
        
        # Parse AI response
        import json
        print(f"AI Response: {ai_response[:200]}...")  # Log first 200 chars
        
        try:
            resume_data = json.loads(ai_response)
            print(f"Extracted data: {resume_data}")
        except json.JSONDecodeError as e:
            print(f"JSON Parse Error: {e}")
            print(f"Response: {ai_response}")
            # Try to extract JSON from response (in case AI added extra text)
            try:
                json_start = ai_response.find('{')
                json_end = ai_response.rfind('}') + 1
                if json_start != -1 and json_end > json_start:
                    json_str = ai_response[json_start:json_end]
                    resume_data = json.loads(json_str)
                else:
                    raise ValueError("No JSON found in response")
            except:
                # If extraction still fails, use default structure
                resume_data = {
                    "education": [],
                    "skills": {},
                    "projects": [],
                    "certifications": [],
                    "achievements": []
                }
        
        # Generate LaTeX code with extracted data
        latex_code = generate_latex_from_data(
            name=user_name,
            email=user_email,
            education=resume_data.get("education", []),
            skills=resume_data.get("skills", {}),
            projects=resume_data.get("projects", []),
            certifications=resume_data.get("certifications", []),
            achievements=resume_data.get("achievements", [])
        )
        
        return {
            "status": "success",
            "message": "LaTeX code generated with AI",
            "latex_code": latex_code,
            "extracted_data": resume_data
        }
    except Exception as e:
        return {"status": "error", "message": str(e)}

def generate_latex_from_data(name, email, education, skills, projects, certifications, achievements, format_type="professional"):
    """Generate professional LaTeX resume code from structured data"""
    
    # Escape special LaTeX characters
    def escape_latex(text):
        """Escape special characters for LaTeX"""
        if not text:
            return ""
        replacements = {
            '&': r'\&',
            '%': r'\%',
            '$': r'\$',
            '#': r'\#',
            '_': r'\_',
            '{': r'\{',
            '}': r'\}',
            '~': r'\textasciitilde{}',
            '^': r'\textasciicircum{}',
            '\\': r'\textbackslash{}'
        }
        result = str(text)
        for old, new in replacements.items():
            result = result.replace(old, new)
        return result
    
    latex = r"""\documentclass[11pt]{article}
\usepackage[utf8]{inputenc}
\usepackage[T1]{fontenc}
\usepackage[margin=0.5in]{geometry}
\usepackage{hyperref}
\usepackage{xcolor}
\usepackage{enumitem}

\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}

\setlist[itemize]{leftmargin=*}

\pagestyle{empty}

\newcommand{\sectiontitle}[1]{{\Large\textbf{#1}}\vspace{0.2cm}\\}

\begin{document}

% Header
\begin{center}
    {\LARGE\textbf{""" + escape_latex(name.strip()) + r"""}} \\[0.1cm]
    \href{mailto:""" + email.strip() + r"""}{""" + email.strip() + r"""}
\end{center}

\vspace{0.3cm}

"""
    
    # Education Section
    if education and len(education) > 0:
        has_content = any(edu.get("school") or edu.get("degree") for edu in education)
        if has_content:
            latex += r"""\sectiontitle{EDUCATION}
"""
            for edu in education:
                school = escape_latex(edu.get("school", "").strip())
                degree = escape_latex(edu.get("degree", "").strip())
                gpa = escape_latex(edu.get("gpa", "").strip())
                graduation = escape_latex(edu.get("graduation", "").strip())
                
                if school or degree:
                    if school:
                        latex += r"""\textbf{""" + school + r"""}"""
                        if graduation:
                            latex += r""" --- """ + graduation
                        latex += r""" \\
"""
                    if degree:
                        latex += degree
                        if gpa:
                            latex += r""" (GPA: """ + gpa + r""")"""
                        latex += r"""
"""
                    latex += r"""\vspace{0.15cm}
"""
    
    # Skills Section
    if skills and len(skills) > 0:
        has_skills = any(isinstance(v, list) and len(v) > 0 for v in skills.values())
        if has_skills:
            latex += r"""\sectiontitle{TECHNICAL SKILLS}
\begin{itemize}[noitemsep, topsep=0pt]
"""
            for category, skills_list in skills.items():
                if isinstance(skills_list, list) and len(skills_list) > 0:
                    cleaned_skills = [escape_latex(s.strip()) for s in skills_list if s.strip()]
                    if cleaned_skills:
                        latex += r"""    \item \textbf{""" + escape_latex(category) + r""":} """ + ", ".join(cleaned_skills) + r"""
"""
            latex += r"""\end{itemize}
\vspace{0.15cm}

"""
    
    # Projects Section
    if projects and len(projects) > 0:
        has_projects = any(p.get("title") for p in projects)
        if has_projects:
            latex += r"""\sectiontitle{PROJECTS}
\begin{itemize}[noitemsep, topsep=0pt]
"""
            for project in projects:
                title = escape_latex(project.get("title", "").strip())
                description = escape_latex(project.get("description", "").strip())
                tech_stack = escape_latex(project.get("tech_stack", "").strip())
                link = project.get("link", "").strip()
                
                if title:
                    latex += r"""    \item \textbf{""" + title + r"""}"""
                    if link and link != "":
                        latex += r""" --- \href{""" + link + r"""}{View}"""
                    latex += r""" \\
"""
                    if description:
                        latex += r"""    """ + description + r"""
"""
                    if tech_stack:
                        latex += r"""    \textit{Tech: """ + tech_stack + r"""}
"""
            latex += r"""\end{itemize}
\vspace{0.15cm}

"""
    
    # Certifications Section
    if certifications and len(certifications) > 0:
        has_certs = any(c.get("name") for c in certifications)
        if has_certs:
            latex += r"""\sectiontitle{CERTIFICATIONS}
\begin{itemize}[noitemsep, topsep=0pt]
"""
            for cert in certifications:
                cert_name = escape_latex(cert.get("name", "").strip())
                platform = escape_latex(cert.get("platform", "").strip())
                link = cert.get("link", "").strip()
                
                if cert_name:
                    latex += r"""    \item \textbf{""" + cert_name + r"""}"""
                    if platform:
                        latex += r""" --- """ + platform
                    if link and link != "":
                        latex += r""" (\href{""" + link + r"""}{View})"""
                    latex += r"""
"""
            latex += r"""\end{itemize}
\vspace{0.15cm}

"""
    
    # Achievements Section
    if achievements and len(achievements) > 0:
        has_achievements = any(a for a in achievements)
        if has_achievements:
            latex += r"""\sectiontitle{ACHIEVEMENTS}
\begin{itemize}[noitemsep, topsep=0pt]
"""
            for achievement in achievements:
                achievement_clean = escape_latex(achievement.strip() if isinstance(achievement, str) else str(achievement).strip())
                if achievement_clean:
                    latex += r"""    \item """ + achievement_clean + r"""
"""
            latex += r"""\end{itemize}

"""
    
    latex += r"""\end{document}"""
    
    return latex

# ====== RUN SERVER ======
class LaTeXRequest(BaseModel):
    name: str
    email: str
    phone: Optional[str] = ""
    linkedin: Optional[str] = ""
    github: Optional[str] = ""
    portfolio: Optional[str] = ""
    education: List[dict] = []
    skills: dict = {}
    projects: List[dict] = []
    certifications: List[dict] = []
    achievements: List[str] = []
    template: str = "modern"
    include_photo: bool = False
    include_links: bool = True
    color_mode: bool = False

def generate_modern_template(data: LaTeXRequest) -> str:
    """Generate modern professional LaTeX resume"""
    primary_color = "0052CC" if data.color_mode else "000000"
    latex = "\\documentclass[11pt]{article}\n"
    latex += "\\usepackage[utf-8]{inputenc}\n\\usepackage[margin=0.5in]{geometry}\n"
    latex += "\\usepackage{hyperref}\n\\usepackage{xcolor}\n\\usepackage{enumitem}\n"
    latex += f"\\definecolor{{primary}}{{HTML}}{{{primary_color}}}\n"
    latex += "\\hypersetup{colorlinks=true, linkcolor=primary, urlcolor=primary}\n"
    latex += "\\setlist[itemize]{leftmargin=*}\n\\pagestyle{empty}\n"
    latex += "\\begin{document}\n\\begin{center}\n"
    latex += f"{{\\Large\\textbf{{{data.name}}}}}\\\\ \n"
    latex += f"\\href{{mailto:{data.email}}}{{{data.email}}}"
    if data.phone:
        latex += f" $\\cdot$ {data.phone}"
    latex += "\n\\end{center}\n\\end{document}"
    return latex

def generate_classic_template(data: LaTeXRequest) -> str:
    """Generate classic professional LaTeX resume"""
    latex = "\\documentclass[11pt]{article}\n"
    latex += "\\usepackage[utf-8]{inputenc}\n\\usepackage[margin=0.6in]{geometry}\n"
    latex += "\\usepackage{hyperref}\n\\usepackage{enumitem}\n"
    latex += "\\hypersetup{colorlinks=true, linkcolor=blue, urlcolor=blue}\n"
    latex += "\\setlist[itemize]{leftmargin=*}\n\\pagestyle{empty}\n"
    latex += "\\begin{document}\n\\begin{center}\n"
    latex += f"\\textbf{{\\Large {data.name}}}\\\\ \n"
    latex += f"\\href{{mailto:{data.email}}}{{{data.email}}}"
    if data.phone:
        latex += f" $\\cdot$ {data.phone}"
    latex += "\n\\end{center}\n\\end{document}"
    return latex

def generate_creative_template(data: LaTeXRequest) -> str:
    """Generate creative LaTeX resume with colors"""
    latex = "\\documentclass[11pt]{article}\n"
    latex += "\\usepackage[utf-8]{inputenc}\n\\usepackage[margin=0.5in]{geometry}\n"
    latex += "\\usepackage{hyperref}\n\\usepackage{xcolor}\n\\usepackage{enumitem}\n"
    latex += "\\definecolor{accent}{HTML}{007BFF}\n"
    latex += "\\hypersetup{colorlinks=true, linkcolor=accent, urlcolor=accent}\n"
    latex += "\\begin{document}\n\\begin{center}\n"
    latex += f"{{\\Large\\textbf{{{data.name}}}}}\\\\ \n"
    latex += f"{{\\color{{accent}}\\href{{mailto:{data.email}}}{{{data.email}}}}}"
    if data.phone:
        latex += f" $\\cdot$ {data.phone}"
    latex += "\n\\end{center}\n\\end{document}"
    return latex

def generate_minimal_template(data: LaTeXRequest) -> str:
    """Generate minimal clean LaTeX resume"""
    latex = "\\documentclass[10pt]{article}\n"
    latex += "\\usepackage[utf-8]{inputenc}\n\\usepackage[margin=0.7in]{geometry}\n"
    latex += "\\usepackage{hyperref}\n\\usepackage{enumitem}\n"
    latex += "\\hypersetup{colorlinks=true, linkcolor=black, urlcolor=black}\n"
    latex += "\\setlist[itemize]{leftmargin=*}\n\\pagestyle{empty}\n"
    latex += "\\setlength{\\parindent}{0pt}\n\\begin{document}\n\n"
    latex += f"\\noindent \\textbf{{\\Large {data.name}}}\\\\ \n"
    latex += f"\\href{{mailto:{data.email}}}{{{data.email}}}"
    if data.phone:
        latex += f" $\\cdot$ {data.phone}"
    latex += "\n\n\\end{document}"
    return latex

def generate_latex_resume(data: LaTeXRequest) -> str:
    """Generate LaTeX resume with selected template"""
    template = getattr(data, 'template', 'modern')
    
    if template == 'classic':
        return generate_classic_template(data)
    elif template == 'creative':
        return generate_creative_template(data)
    elif template == 'minimal':
        return generate_minimal_template(data)
    else:  # modern (default)
        return generate_modern_template(data)

# NOTE: LaTeX generation is now 100% client-side in the frontend (JavaScript)
# This endpoint is deprecated and disabled
# @app.post("/api/generate-latex")
# async def generate_latex(data: LaTeXRequest, authorization: str = Header(None)):
#     """Generate LaTeX resume code"""
#     if not authorization:
#         raise HTTPException(status_code=401, detail="Missing authorization header")
#     
#     try:
#         # Verify token
#         scheme, token = authorization.split()
#         if scheme.lower() != "bearer":
#             raise HTTPException(status_code=401, detail="Invalid authentication scheme")
#         
#         payload = verify_jwt_token(token)
#         if not payload:
#             raise HTTPException(status_code=401, detail="Invalid or expired token")
#         
#         # Generate LaTeX code
#         latex_code = generate_latex_resume(data)
#         
#         return {
#             "status": "success",
#             "message": "LaTeX code generated successfully",
#             "latex_code": latex_code
#         }
#     except Exception as e:
#         return {"status": "error", "message": str(e)}

# ====== RUN SERVER ======
if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
