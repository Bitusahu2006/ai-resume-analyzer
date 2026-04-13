// ============================================
// API CONFIGURATION
// ============================================
const API_BASE_URL = 'http://localhost:8000/api';

// ============================================
// STATE MANAGEMENT
// ============================================
let currentAnalysisData = null;
let chartsInstances = {};
let currentUser = null;
let authToken = null;

// ============================================
// AUTHENTICATION FUNCTIONS
// ============================================
function openLoginModal() {
    document.getElementById('loginModal').classList.add('show');
}

function closeLoginModal() {
    document.getElementById('loginModal').classList.remove('show');
    document.getElementById('loginForm').reset();
}

function openSignupModal() {
    document.getElementById('signupModal').classList.add('show');
}

function closeSignupModal() {
    document.getElementById('signupModal').classList.remove('show');
    document.getElementById('signupForm').reset();
}

function switchToSignup(e) {
    e.preventDefault();
    closeLoginModal();
    openSignupModal();
}

function switchToLogin(e) {
    e.preventDefault();
    closeSignupModal();
    openLoginModal();
}

async function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            // Store auth data
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateAuthUI();
            closeLoginModal();
            showToast('Login successful', 'success');
        } else {
            showToast(data.detail || 'Login failed', 'error');
        }
    } catch (error) {
        console.error('Login error:', error);
        showToast('Login error', 'error');
    }
}

async function handleSignup(event) {
    event.preventDefault();
    
    const full_name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    
    if (password.length < 6) {
        showToast('Password must be at least 6 characters', 'error');
        return;
    }
    
    try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password, full_name })
        });
        
        const data = await response.json();
        
        if (response.ok && data.status === 'success') {
            // Store auth data
            authToken = data.token;
            currentUser = data.user;
            localStorage.setItem('authToken', authToken);
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            
            // Update UI
            updateAuthUI();
            closeSignupModal();
            showToast('Account created successfully', 'success');
        } else {
            showToast(data.detail || 'Signup failed', 'error');
        }
    } catch (error) {
        console.error('Signup error:', error);
        showToast('Signup error', 'error');
    }
}

function logout() {
    authToken = null;
    currentUser = null;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    
    updateAuthUI();
    showToast('Logged out successfully', 'success');
    
    // Redirect to home
    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth' });
}

function updateAuthUI() {
    const authDiv = document.getElementById('nav-auth');
    const userDiv = document.getElementById('nav-user');
    const dashboardContainer = document.getElementById('dashboardContainer');
    
    if (currentUser) {
        authDiv.style.display = 'none';
        userDiv.style.display = 'flex';
        document.getElementById('user-name').textContent = `Welcome, ${currentUser.full_name}!`;
        dashboardContainer.style.display = 'block';
    } else {
        authDiv.style.display = 'flex';
        userDiv.style.display = 'none';
        dashboardContainer.style.display = 'none';
    }
}

// Load auth state on page load
function loadAuthState() {
    const token = localStorage.getItem('authToken');
    const user = localStorage.getItem('currentUser');
    
    if (token && user) {
        authToken = token;
        currentUser = JSON.parse(user);
        updateAuthUI();
    }
}

// Close modals when clicking outside
window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const signupModal = document.getElementById('signupModal');
    
    if (event.target === loginModal) {
        closeLoginModal();
    }
    if (event.target === signupModal) {
        closeSignupModal();
    }
}

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', () => {
    loadAuthState();
    loadJobRoles();
    setupEventListeners();
    setupTabHandlers();
    setupFileUpload();
    setupRatingSlider();
});

// ============================================
// LOAD JOB ROLES
// ============================================
async function loadJobRoles() {
    try {
        const select = document.getElementById('jobRole');
        if (!select) {
            console.log('Job role selector not found in HTML');
            return;
        }
        
        const response = await fetch(`${API_BASE_URL}/job-roles`);
        const data = await response.json();
        
        if (data.status === 'success') {
            select.innerHTML = '<option value="">Select a job role...</option>';
            data.roles.forEach(role => {
                const option = document.createElement('option');
                option.value = role;
                option.textContent = role;
                select.appendChild(option);
            });
        }
    } catch (error) {
        console.error('Error loading job roles:', error);
    }
}

// ============================================
// EVENT LISTENERS
// ============================================
function setupEventListeners() {
    // Analyze button (only if exists)
    const analyzeBtn = document.getElementById('analyzeBtn');
    if (analyzeBtn) {
        analyzeBtn.addEventListener('click', analyzeResume);
    }
    
    // Suggestions button (only if exists)
    const suggestionsBtn = document.getElementById('suggestionsBtn');
    if (suggestionsBtn) {
        suggestionsBtn.addEventListener('click', getSuggestions);
    }
}

function setupTabHandlers() {
    const tabBtns = document.querySelectorAll('.tab-btn');
    if (tabBtns.length === 0) return; // No tabs to set up
    
    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class
            tabBtns.forEach(b => b.classList.remove('active'));
            document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked button and related content
            btn.classList.add('active');
            const tabName = btn.getAttribute('data-tab');
            document.getElementById(tabName).classList.add('active');
        });
    });
}

function setupFileUpload() {
    const fileUpload = document.querySelector('.file-upload');
    const fileInput = document.getElementById('resumeFile');
    
    if (!fileUpload || !fileInput) {
        console.error('File upload elements not found in HTML');
        return;
    }
    
    fileUpload.addEventListener('click', () => fileInput.click());
    fileUpload.addEventListener('dragover', (e) => {
        e.preventDefault();
        fileUpload.style.background = 'rgba(102, 126, 234, 0.15)';
    });
    
    fileUpload.addEventListener('dragleave', () => {
        fileUpload.style.background = 'rgba(102, 126, 234, 0.05)';
    });
    
    fileUpload.addEventListener('drop', (e) => {
        e.preventDefault();
        fileUpload.style.background = 'rgba(102, 126, 234, 0.05)';
        
        const files = e.dataTransfer.files;
        if (files.length > 0) {
            fileInput.files = files;
            updateFileLabel();
        }
    });
    
    fileInput.addEventListener('change', updateFileLabel);
}

function updateFileLabel() {
    const fileInput = document.getElementById('resumeFile');
    const fileLabel = document.querySelector('.file-label span');
    if (fileInput && fileLabel && fileInput.files.length > 0) {
        fileLabel.textContent = `✓ ${fileInput.files[0].name}`;
    }
}

function setupRatingSlider() {
    const slider = document.getElementById('rating');
    const ratingValue = document.getElementById('ratingValue');
    
    if (!slider || !ratingValue) return; // Elements not found
    
    slider.addEventListener('input', (e) => {
        const value = e.target.value;
        ratingValue.textContent = value + ' ⭐';
    });
}

// ============================================
// ANALYZE RESUME
// ============================================
async function analyzeResume() {
    const fileInput = document.getElementById('resumeFile');
    const jobRole = document.getElementById('jobRole').value;
    const analyzeBtn = document.getElementById('analyzeBtn');
    
    // Validation
    if (!fileInput.files.length) {
        showToast('Please select a resume file', 'error');
        return;
    }
    
    if (!jobRole) {
        showToast('Please select a job role', 'error');
        return;
    }
    
    // Prepare form data
    const formData = new FormData();
    formData.append('file', fileInput.files[0]);
    formData.append('job_role', jobRole);
    
    // Show loading state
    analyzeBtn.disabled = true;
    analyzeBtn.innerHTML = '<span class="loading"></span> Analyzing...';
    
    try {
        const fetchOptions = {
            method: 'POST',
            body: formData
        };
        
        // Add auth header only if token exists
        if (authToken) {
            fetchOptions.headers = {
                'Authorization': `Bearer ${authToken}`
            };
        }
        
        const response = await fetch(`${API_BASE_URL}/analyze-resume`, fetchOptions);
        
        const data = await response.json();
        
        if (data.status === 'success') {
            currentAnalysisData = data;
            displayResults(data);
            showToast('✓ Resume analyzed successfully!', 'success');
        } else {
            showToast(data.message || 'Error analyzing resume', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error analyzing resume', 'error');
    } finally {
        analyzeBtn.disabled = false;
        analyzeBtn.innerHTML = '<i class="fas fa-chart-pie"></i> Analyze Resume';
    }
}

// ============================================
// DISPLAY RESULTS
// ============================================
function displayResults(data) {
    // Hide empty state, show results
    document.getElementById('emptyState').style.display = 'none';
    document.getElementById('resultsContainer').style.display = 'block';
    
    // Update ATS Score
    updateAtsScore(data.ats_score);
    
    // Display Skills
    displaySkills(data.matched_skills, data.missing_skills);
    
    // Display Charts
    displayCharts(data.matched_skills, data.missing_skills);
    
    // Display Resume Preview
    displayResumePreview(data.resume_text_preview);
    
    // Scroll to results
    document.getElementById('resultsContainer').scrollIntoView({ behavior: 'smooth' });
}

function updateAtsScore(score) {
    const scoreValue = document.getElementById('scoreValue');
    const scoreFill = document.getElementById('scoreFill');
    const scoreMessage = document.getElementById('scoreMessage');
    
    scoreValue.textContent = Math.round(score);
    
    // Update circle progress
    const circumference = 2 * Math.PI * 45;
    const offset = circumference - (score / 100) * circumference;
    scoreFill.style.strokeDashoffset = offset;
    scoreFill.style.strokeDasharray = circumference;
    
    // Update message
    if (score < 50) {
        scoreMessage.textContent = '⚠️ Score below target - Follow suggestions to improve';
        scoreMessage.style.color = '#e74c3c';
    } else if (score < 70) {
        scoreMessage.textContent = '📈 Good score - Improvements recommended';
        scoreMessage.style.color = '#f39c12';
    } else if (score < 90) {
        scoreMessage.textContent = '✓ Excellent compatibility!';
        scoreMessage.style.color = '#2ecc71';
    } else {
        scoreMessage.textContent = '🌟 Perfect match!';
        scoreMessage.style.color = '#27ae60';
    }
}

function displaySkills(matched, missing) {
    const matchedContainer = document.getElementById('matchedSkills');
    const missingContainer = document.getElementById('missingSkills');
    
    // Display matched skills
    matchedContainer.innerHTML = matched.length > 0 
        ? matched.map(skill => `<span class="skill-badge skill-matched">✓ ${skill}</span>`).join('')
        : '<p style="color: #999; text-align: center; padding: 1rem;">No matched skills found</p>';
    
    // Display missing skills
    missingContainer.innerHTML = missing.length > 0
        ? missing.map(skill => `<span class="skill-badge skill-missing">✗ ${skill}</span>`).join('')
        : '<p style="color: #999; text-align: center; padding: 1rem;">No missing skills!</p>';
}

function displayCharts(matched, missing) {
    // Skills Pie Chart
    const skillsCtx = document.getElementById('skillsChart').getContext('2d');
    
    if (chartsInstances.skillsChart) {
        chartsInstances.skillsChart.destroy();
    }
    
    chartsInstances.skillsChart = new Chart(skillsCtx, {
        type: 'doughnut',
        data: {
            labels: ['Matched Skills', 'Missing Skills'],
            datasets: [{
                data: [matched.length, missing.length],
                backgroundColor: [
                    'rgba(132, 250, 176, 0.8)',
                    'rgba(255, 107, 107, 0.8)'
                ],
                borderColor: ['#27ae60', '#c0392b'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        }
    });
    
    // Skills Breakdown Bar Chart
    const breakdownCtx = document.getElementById('breakdownChart').getContext('2d');
    
    if (chartsInstances.breakdownChart) {
        chartsInstances.breakdownChart.destroy();
    }
    
    chartsInstances.breakdownChart = new Chart(breakdownCtx, {
        type: 'bar',
        data: {
            labels: ['Matched', 'Missing'],
            datasets: [{
                label: 'Skills Count',
                data: [matched.length, missing.length],
                backgroundColor: [
                    'rgba(132, 250, 176, 0.8)',
                    'rgba(255, 107, 107, 0.8)'
                ],
                borderColor: ['#27ae60', '#c0392b'],
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            indexAxis: 'y',
            plugins: {
                legend: {
                    display: false
                }
            },
            scales: {
                x: {
                    beginAtZero: true
                }
            }
        }
    });
}

function displayResumePreview(preview) {
    const previewBox = document.getElementById('resumePreview');
    previewBox.textContent = preview;
}

// ============================================
// GET AI SUGGESTIONS
// ============================================
async function getSuggestions() {
    if (!currentAnalysisData) {
        showToast('Please analyze a resume first', 'error');
        return;
    }
    
    const suggestionsBtn = document.getElementById('suggestionsBtn');
    const suggestionsContent = document.getElementById('suggestionsContent');
    const jobRole = document.getElementById('jobRole').value;
    
    // Prepare form data
    const formData = new FormData();
    formData.append('job_role', jobRole);
    formData.append('matched_skills', currentAnalysisData.matched_skills.join(', '));
    formData.append('missing_skills', currentAnalysisData.missing_skills.join(', '));
    formData.append('resume_text', currentAnalysisData.resume_text_preview);
    
    // Show loading state
    suggestionsBtn.disabled = true;
    suggestionsBtn.innerHTML = '<span class="loading"></span> Generating...';
    suggestionsContent.innerHTML = '';
    
    try {
        const response = await fetch(`${API_BASE_URL}/get-suggestions`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            suggestionsContent.innerHTML = data.suggestions;
            showToast('✓ Suggestions generated!', 'success');
        } else {
            suggestionsContent.innerHTML = '<p style="color: #e74c3c;">Could not generate suggestions. Please try again.</p>';
            showToast(data.message || 'Error generating suggestions', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        suggestionsContent.innerHTML = '<p style="color: #e74c3c;">Error generating suggestions</p>';
        showToast('Error generating suggestions', 'error');
    } finally {
        suggestionsBtn.disabled = false;
        suggestionsBtn.innerHTML = '<i class="fas fa-wand-magic-wand"></i> Generate Suggestions';
    }
}

// ============================================
// OVERLEAF LATEX GENERATOR
// ============================================
let selectedTemplate = 'modern';


// ============================================
// SUBMIT FEEDBACK
// ============================================
async function submitFeedback() {
    const feedbackText = document.getElementById('feedbackText').value;
    const rating = document.getElementById('rating').value;
    
    if (!feedbackText.trim()) {
        showToast('Please enter your feedback', 'error');
        return;
    }
    
    const feedbackBtn = event.target;
    feedbackBtn.disabled = true;
    feedbackBtn.innerHTML = '<span class="loading"></span> Submitting...';
    
    try {
        const response = await fetch(`${API_BASE_URL}/submit-feedback`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                resume_score: currentAnalysisData ? currentAnalysisData.ats_score : 0,
                user_rating: parseInt(rating),
                user_comment: feedbackText
            })
        });
        
        const data = await response.json();
        
        if (data.status === 'success') {
            document.getElementById('feedbackText').value = '';
            document.getElementById('rating').value = '3';
            document.getElementById('ratingValue').textContent = '3 ⭐';
            showToast('✓ Thank you for your feedback!', 'success');
        } else {
            showToast(data.message || 'Error submitting feedback', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showToast('Error submitting feedback', 'error');
    } finally {
        feedbackBtn.disabled = false;
        feedbackBtn.innerHTML = '<i class="fas fa-paper-plane"></i> Submit Feedback';
    }
}

// ============================================
// UTILITY FUNCTIONS
// ============================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    toast.className = `toast ${type} show`;
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

function scrollToAnalyzer() {
    if (!currentUser) {
        openSignupModal();
        return;
    }
    document.getElementById('analyzer').scrollIntoView({ behavior: 'smooth' });
}

// Placeholder for future features


// ============================================
// API HEALTH CHECK
// ============================================
async function checkApiHealth() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const data = await response.json();
        if (data.status === 'ok') {
            console.log('✓ API is connected');
        }
    } catch (error) {
        console.warn('⚠️ API not connected. Make sure backend is running on http://localhost:8000');
    }
}

// Check API on load
checkApiHealth();
