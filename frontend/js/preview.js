// ============ RESUME TEMPLATES DATA ============

const templatesData = {
    modern: {
        name: 'Modern',
        pdfPath: './pdfs/modern_resume.pdf',
        overleafCode: `\\documentclass[11pt,a4paper]{article}

% Packages for formatting
\\usepackage[utf8]{inputenc}
\\usepackage[T1]{fontenc}
\\usepackage{geometry}
\\geometry{left=0.5in, right=0.5in, top=0.5in, bottom=0.5in}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{titlesec}
\\usepackage{xcolor}

% Formatting for links
\\hypersetup{
    colorlinks=true,
    linkcolor=blue,
    filecolor=magenta,
    urlcolor=blue,
}

% Formatting for section headers
\\titleformat{\\section}{\\large\\bfseries\\uppercase}{}{0em}{}[\\titlerule]
\\titlespacing{\\section}{0pt}{12pt}{6pt}

\\pagestyle{empty} % Removes page numbers

\\begin{document}

% -------------------- HEADER --------------------
\\begin{center}
    {\\Huge \\textbf{Bitu Sahu}} \\\\ \\vspace{6pt}
    \\href{mailto:bitusahu1437@gmail.com}{bitusahu1437@gmail.com} \\ \$|\$ \\ 
    +91 7004784852 \\ \$|\$ \\ 
    \\href{www.linkedin.com/in/bitu-sahu-68b412334}{linkedin.com/in/bitu-sahu} \\ \$|\$ \\ 
    \\href{https://github.com/Bitusahu2006}{github.com/Bitusahu2006}
\\end{center}

% -------------------- SUMMARY --------------------
\\section{Profile Summary}
Results-driven AI \\& Data Science student (9.04 CGPA) with strong foundations in Machine Learning, Natural Language Processing (NLP), and Computer Vision. Adept at using Python and modern data frameworks to build end-to-end intelligent systems, from data pipeline engineering to interactive web deployments. Passionate about leveraging data to solve complex problems and actively seeking roles in Python Development, AI, and Data Science.

% -------------------- TECHNICAL SKILLS --------------------
\\section{Technical Skills}
\\begin{itemize}[leftmargin=0.15in, label={}]
    \\item \\textbf{Languages:} Python (Advanced), SQL, C++, Java, JavaScript
    \\item \\textbf{AI, ML \\& Data Science:} Machine Learning (Supervised/Unsupervised), NLP, Computer Vision, Pandas, NumPy, Scikit-learn, Matplotlib, Plotly, OpenCV
    \\item \\textbf{Development \\& Deployment:} Streamlit, REST APIs, HTML/CSS, Git, GitHub
    \\item \\textbf{Databases \\& Core Concepts:} MySQL, Relational Database Management (RDBMS), Data Structures \\& Algorithms (DSA), Object-Oriented Programming (OOP)
\\end{itemize}

% -------------------- PROJECTS --------------------
\\section{Key Projects}

\\noindent \\textbf{AI Resume Analyzer System} \$|\$ \\textit{Python, NLP, Streamlit, MySQL, Plotly} 
\\begin{itemize}[leftmargin=0.2in, topsep=2pt, itemsep=0pt]
    \\item Architected an intelligent web application to automate the resume screening process, extracting key entities, skills, and metrics using Natural Language Processing (NLP).
    \\item Developed an interactive dashboard using Streamlit and Plotly to visualize skill-matching percentages, providing users with instant, data-backed feedback to improve their profiles.
    \\item Engineered a robust backend utilizing Python and MySQL to securely manage and query applicant data.
\\end{itemize}
\\vspace{4pt}

\\noindent \\textbf{Real-Time Theft Detection System} \$|\$ \\textit{Python, OpenCV, Computer Vision}
\\begin{itemize}[leftmargin=0.2in, topsep=2pt, itemsep=0pt]
    \\item Built a computer vision application designed to identify suspicious activities and potential theft in real-time video feeds.
    \\item Utilized OpenCV for image processing, background subtraction, and contour detection to accurately track motion and trigger automated alerts.
    \\item Optimized the algorithmic efficiency to ensure low-latency processing suitable for live camera integration.
\\end{itemize}
\\vspace{4pt}

\\noindent \\textbf{Jarvis Voice-Activated AI Assistant} \$|\$ \\textit{Python, Speech Recognition, OpenCV, APIs}
\\begin{itemize}[leftmargin=0.2in, topsep=2pt, itemsep=0pt]
    \\item Developed a cross-platform desktop AI assistant capable of automating system-level commands (volume control, application launching, screen capturing) via voice triggers.
    \\item Implemented a dual-layer authentication system featuring both standard login and a secure voice-biometric bypass for seamless access.
    \\item Integrated external Web APIs and Text-to-Speech (TTS) engines to fetch real-time information and deliver dynamic audio responses.
\\end{itemize}

% -------------------- EDUCATION --------------------
\\section{Education}

\\noindent \\textbf{CGC University} \\hfill Jhanjeri, India \\\\
\\textit{Bachelor of Technology in Artificial Intelligence and Data Science (CGPA: 9.04)} \\hfill \\textit{2024 -- 2028} \\vspace{4pt}

\\noindent \\textbf{St. John's Inter College} \\hfill Ranchi, Jharkhand \\\\
\\textit{Senior Secondary Education (Percentage: 87.00\\%)} \\hfill \\textit{2023 -- 2024}

% -------------------- CERTIFICATIONS --------------------
\\section{Certifications}
\\begin{itemize}[leftmargin=0.2in, itemsep=0pt]
    \\item \\textbf{GenAI Powered Data Analytics Job Simulation} --- Forage
    \\item \\textbf{AI Tools Workshop} --- Be10X
    \\item \\textbf{Programming Fundamentals using Python} --- Infosys Springboard
    \\item \\textbf{Data Science \\& Analytics} --- HP Foundation
\\end{itemize}

% -------------------- ACHIEVEMENTS --------------------
\\section{Achievements \\& Extracurriculars}
\\begin{itemize}[leftmargin=0.2in, itemsep=0pt]
    \\item \\textbf{Award of Merit:} Recognized by CGC University for outstanding academic excellence.
    \\item \\textbf{Problem Solving:} Consistently developing logic and algorithmic thinking through regular Data Structures \\& Algorithms (DSA) practice.
\\end{itemize}

\\end{document}`
    },
    classic: {
        name: 'Classic',
        pdfPath: './pdfs/classic_resume.pdf',
        overleafCode: `\\documentclass[a4paper,10pt]{article}
\\usepackage[left=0.7in,right=0.7in,top=0.7in,bottom=0.7in]{geometry}
\\usepackage{enumitem}
\\usepackage{hyperref}
\\usepackage{xcolor}

\\hypersetup{
    colorlinks=true,
    linkcolor=black,
    urlcolor=blue
}

\\begin{document}

\\begin{center}
    {\\LARGE \\textbf{Bitu Sahu}} \\\\
    \\vspace{2pt}
    \\href{mailto:bitusahu1437@gmail.com}{bitusahu1437@gmail.com} \\quad | \\quad 
    +91 7004784852 \\quad | \\quad 
    \\href{https://linkedin.com/in/bitu-sahu}{LinkedIn} \\quad | \\quad 
    \\href{https://github.com/Bitusahu2006}{GitHub}
\\end{center}

\\vspace{-8pt}
\\hrule
\\vspace{6pt}

%---------------- PROFILE SUMMARY ----------------
\\section*{Profile Summary}
AI \\& Data Science student (CGPA: 9.04) with strong interest in Machine Learning, NLP, and Generative AI. Skilled in Python and data-driven problem solving, with hands-on experience building real-world applications like AI Resume Analyzer and Jarvis AI Assistant.

%---------------- EDUCATION ----------------
\\section*{Education}
\\textbf{CGC University, Jhanjeri} \\hfill 2024 -- 2028 \\\\
B.Tech in Artificial Intelligence \\& Data Science (CGPA: 9.04)

\\vspace{4pt}
\\textbf{St. John's Inter College, Ranchi} \\hfill 2023 -- 2024 \\\\
Senior Secondary Education (87\\%)

%---------------- PROJECTS ----------------
\\section*{Projects}

\\textbf{Jarvis AI: Advanced Personal Assistant} \\hfill \\href{https://github.com/Bitusahu2006}{GitHub}
\\begin{itemize}[noitemsep,topsep=0pt]
    \\item Built a cross-platform AI assistant using Python capable of executing system commands via voice.
    \\item Implemented features like volume control, screenshots, and app management.
\\end{itemize}

\\textbf{AI Resume Analyzer} \\hfill \\href{https://github.com/Bitusahu2006}{GitHub}
\\begin{itemize}[noitemsep,topsep=0pt]
    \\item Built an NLP-based web app to analyze resumes and provide suggestions.
    \\item Extracted skills using NLP and visualized insights using Plotly.
\\end{itemize}

%---------------- SKILLS ----------------
\\section*{Skills}
\\textbf{Programming:} Python, C++, Java \\\\
\\textbf{Data Science:} Machine Learning, Data Analysis \\\\
\\textbf{Tools:} Git, GitHub, Streamlit, MySQL

%---------------- CERTIFICATIONS ----------------
\\section*{Certifications}
\\begin{itemize}[noitemsep,topsep=0pt]
    \\item GenAI Powered Data Analytics Job Simulation — Forage
    \\item AI Tools Workshop — Be10X
    \\item Programming Fundamentals using Python — Infosys Springboard
\\end{itemize}

\\end{document}`
    },
    creative: {
        name: 'Creative',
        pdfPath: './pdfs/creative_resume.pdf',
        overleafCode: `\\documentclass[11pt]{article}
\\usepackage[utf-8]{inputenc}
\\usepackage[margin=0.7in]{geometry}
\\usepackage{hyperref}
\\usepackage{xcolor}
\\usepackage{fontawesome5}

\\definecolor{headerColor}{RGB}{255, 107, 107}
\\definecolor{accentColor}{RGB}{102, 126, 234}

\\setlength{\\parindent}{0pt}
\\pagestyle{empty}

\\newcommand{\\coloredheader}[1]{%
    {\\fontsize{28}{28}\\selectfont\\textbf{\\textcolor{headerColor}{#1}}}
}

\\newcommand{\\sectionheading}[1]{%
    \\vspace{0.25cm}
    {\\textcolor{accentColor}{\\textbf{\\large #1}}}\\\\
}

\\begin{document}

\\centerline{\\coloredheader{YOUR NAME}}
\\centerline{\\small \\textcolor{accentColor}{Creative Developer \& Problem Solver}}
\\vspace{0.2cm}
\\centerline{Email: your.email@example.com | Phone: (123) 456-7890}
\\vspace{0.3cm}

\\sectionheading{About Me}
Passionate developer with expertise in creating user-friendly solutions.

\\sectionheading{Experience}

{\\textbf{\\textcolor{accentColor}{$\\bullet$}} \\textbf{Senior Developer} - ABC Company (2020-Present)}\\\\
Developed high-impact features and led technical initiatives

{\\textbf{\\textcolor{accentColor}{$\\bullet$}} \\textbf{Full Stack Developer} - XYZ Tech (2018-2020)}\\\\
Built end-to-end web applications using modern tech stack

\\sectionheading{Skills}
\\textcolor{accentColor}{Web}: React, Vue.js, HTML/CSS, Node.js \\\\
\\textcolor{accentColor}{Mobile}: React Native, Flutter \\\\
\\textcolor{accentColor}{Backend}: Python, JavaScript, PostgreSQL

\\sectionheading{Education}
Bachelor of Science in Computer Science - University Name (2018)

\\end{document}`
    },
    minimal: {
        name: 'Minimal',
        pdfPath: './pdfs/minimal_resume.pdf',
        overleafCode: `\\documentclass[10pt]{article}
\\usepackage[utf-8]{inputenc}
\\usepackage[margin=0.6in]{geometry}
\\usepackage{hyperref}

\\setlength{\\parindent}{0pt}
\\pagestyle{empty}

\\newcommand{\\sectionheading}[1]{%
    {\\textbf{#1}}\\\\
}

\\begin{document}

\\textbf{\\LARGE YOUR NAME}\\\\
your.email@example.com | (123) 456-7890 | linkedin.com/in/yourprofile

\\sectionheading{SUMMARY}
Results-oriented professional with strong technical expertise and leadership skills.

\\sectionheading{EXPERIENCE}
\\textbf{Senior Developer} - ABC Company | 2020-Present
\\begin{itemize}
    \\item Key achievements and responsibilities
    \\item Quantifiable results and impact
    \\item Technical accomplishments
\\end{itemize}

\\textbf{Developer} - Previous Company | 2018-2020
\\begin{itemize}
    \\item Relevant experience
    \\item Skills applied
\\end{itemize}

\\sectionheading{SKILLS}
Python · JavaScript · React · SQL · AWS · Docker · Git

\\sectionheading{EDUCATION}
Bachelor of Science in Computer Science | University Name | 2018

\\end{document}`
    }
};

// ============ DOM ELEMENTS ============

const templateBtns = document.querySelectorAll('.template-btn');
const pdfFrame = document.getElementById('pdfFrame');
const codeContent = document.getElementById('codeContent');
const copyCodeBtn = document.getElementById('copyCodeBtn');
const openOverleafBtn = document.getElementById('openOverleafBtn');
const downloadPdfBtn = document.getElementById('downloadPdfBtn');
const statusMessage = document.getElementById('statusMessage');
const loadingModal = document.getElementById('loadingModal');

let currentTemplate = 'modern';

// ============ INITIALIZE ============

document.addEventListener('DOMContentLoaded', () => {
    loadTemplate('modern');
    attachEventListeners();
});

// ============ EVENT LISTENERS ============

function attachEventListeners() {
    // Template buttons
    templateBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const template = btn.dataset.template;
            switchTemplate(template);
        });
    });

    // Code actions
    copyCodeBtn.addEventListener('click', copyCodeToClipboard);
    openOverleafBtn.addEventListener('click', openInOverleaf);
    downloadPdfBtn.addEventListener('click', downloadPdf);
}

// ============ TEMPLATE SWITCHING ============

function switchTemplate(templateName) {
    if (currentTemplate === templateName) return;

    // Update button states
    templateBtns.forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.template === templateName) {
            btn.classList.add('active');
        }
    });

    // Load template
    loadTemplate(templateName);
    currentTemplate = templateName;
}

function loadTemplate(templateName) {
    const template = templatesData[templateName];
    if (!template) return;

    showLoading(true);

    // Small delay for visual feedback
    setTimeout(() => {
        // Load PDF
        pdfFrame.src = template.pdfPath;

        // Load Code
        codeContent.textContent = template.overleafCode;

        showLoading(false);
        showStatus(`${template.name} template loaded!`, 'success');
    }, 500);
}

// ============ COPY CODE ============

function copyCodeToClipboard() {
    const code = templatesData[currentTemplate].overleafCode;

    navigator.clipboard.writeText(code).then(() => {
        showStatus('Code copied to clipboard!', 'success');
        
        // Visual feedback on button
        const originalText = copyCodeBtn.textContent;
        copyCodeBtn.textContent = '✓ Copied!';
        setTimeout(() => {
            copyCodeBtn.textContent = originalText;
        }, 2000);
    }).catch(err => {
        showStatus('Failed to copy code', 'error');
        console.error('Copy failed:', err);
    });
}

// ============ OPEN IN OVERLEAF ============

function openInOverleaf() {
    const code = templatesData[currentTemplate].overleafCode;
    const templateName = templatesData[currentTemplate].name;

    // Encode the code for URL
    const encodedCode = encodeURIComponent(code);

    // Overleaf new project URL with code
    const overleafUrl = `https://www.overleaf.com/docs?snip=${encodedCode}&name=${templateName}%20Resume`;

    // Open in new window
    window.open(overleafUrl, '_blank');

    showStatus('Opening Overleaf... (Check for pop-up blocker)', 'info');
}

// ============ DOWNLOAD PDF ============

function downloadPdf() {
    const template = templatesData[currentTemplate];
    const pdfPath = template.pdfPath;

    // Create a link element and trigger download
    const link = document.createElement('a');
    link.href = pdfPath;
    link.download = `${currentTemplate}_resume.pdf`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showStatus('PDF download started!', 'success');
}

// ============ UI HELPERS ============

function showLoading(show) {
    if (show) {
        loadingModal.classList.remove('hidden');
    } else {
        loadingModal.classList.add('hidden');
    }
}

function showStatus(message, type = 'info') {
    statusMessage.textContent = message;
    statusMessage.className = `status-message show ${type}`;

    setTimeout(() => {
        statusMessage.classList.remove('show');
    }, 3000);
}

// ============ KEYBOARD SHORTCUTS ============

document.addEventListener('keydown', (e) => {
    // Ctrl+C / Cmd+C - Copy Code
    if ((e.ctrlKey || e.metaKey) && e.key === 'c' && document.activeElement === document.body) {
        copyCodeToClipboard();
    }

    // Arrow keys to switch templates
    if (e.key === 'ArrowRight') {
        switchToNextTemplate();
    } else if (e.key === 'ArrowLeft') {
        switchToPreviousTemplate();
    }
});

function switchToNextTemplate() {
    const templates = ['modern', 'classic', 'creative', 'minimal'];
    const currentIndex = templates.indexOf(currentTemplate);
    const nextIndex = (currentIndex + 1) % templates.length;
    switchTemplate(templates[nextIndex]);
}

function switchToPreviousTemplate() {
    const templates = ['modern', 'classic', 'creative', 'minimal'];
    const currentIndex = templates.indexOf(currentTemplate);
    const prevIndex = (currentIndex - 1 + templates.length) % templates.length;
    switchTemplate(templates[prevIndex]);
}
