// ============================================
// NEW FEATURES - Links, Projects, Certifications
// ============================================

// Store project and certification data
let projectsList = [];
let certificationsList = [];

// Add Project Input Field
function addProjectField() {
    const count = projectsList.length + 1;
    const projectId = 'project-' + count;
    
    const projectDiv = document.createElement('div');
    projectDiv.id = projectId;
    projectDiv.className = 'form-group';
    projectDiv.innerHTML = `
        <div style="border-left: 3px solid var(--primary-color); padding: 10px; margin: 10px 0; background: var(--bg-light); border-radius: 5px;">
            <input type="text" class="form-control" placeholder="Project Name" style="margin-bottom: 8px;">
            <input type="text" class="form-control" placeholder="Description" style="margin-bottom: 8px;">
            <input type="text" class="form-control" placeholder="URL/GitHub Link" style="margin-bottom: 8px;">
            <input type="text" class="form-control" placeholder="Key Metrics (e.g., 10K+ users, 95% accuracy)" style="margin-bottom: 8px;">
            <button class="btn-secondary btn-small" onclick="removeProjectField('${projectId}')" style="width: 100%;">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    
    document.getElementById('projectsList').appendChild(projectDiv);
    projectsList.push({id: projectId, name: '', desc: '', url: '', metrics: ''});
}

function removeProjectField(id) {
    document.getElementById(id).remove();
    projectsList = projectsList.filter(p => p.id !== id);
}

// Add Certification Input Field
function addCertificationField() {
    const count = certificationsList.length + 1;
    const certId = 'cert-' + count;
    
    const certDiv = document.createElement('div');
    certDiv.id = certId;
    certDiv.className = 'form-group';
    certDiv.innerHTML = `
        <div style="border-left: 3px solid var(--secondary-color); padding: 10px; margin: 10px 0; background: var(--bg-light); border-radius: 5px;">
            <input type="text" class="form-control" placeholder="Certification Name" style="margin-bottom: 8px;">
            <input type="text" class="form-control" placeholder="Issued by" style="margin-bottom: 8px;">
            <input type="text" class="form-control" placeholder="Year/Date" style="margin-bottom: 8px;">
            <input type="text" class="form-control" placeholder="Certificate URL" style="margin-bottom: 8px;">
            <button class="btn-secondary btn-small" onclick="removeCertificationField('${certId}')" style="width: 100%;">
                <i class="fas fa-trash"></i> Remove
            </button>
        </div>
    `;
    
    document.getElementById('certificationsList').appendChild(certDiv);
    certificationsList.push({id: certId, name: '', issuer: '', year: '', url: ''});
}

function removeCertificationField(id) {
    document.getElementById(id).remove();
    certificationsList = certificationsList.filter(c => c.id !== id);
}

// Collect all optimization data
function collectOptimizationData() {
    const data = {
        github: document.getElementById('githubLink').value || '',
        linkedin: document.getElementById('linkedinLink').value || '',
        portfolio: document.getElementById('portfolioLink').value || '',
        projects: [],
        certifications: []
    };

    // Collect projects
    document.querySelectorAll('#projectsList > div').forEach(div => {
        const inputs = div.querySelectorAll('input');
        data.projects.push({
            name: inputs[0].value,
            description: inputs[1].value,
            url: inputs[2].value,
            metrics: inputs[3].value
        });
    });

    // Collect certifications
    document.querySelectorAll('#certificationsList > div').forEach(div => {
        const inputs = div.querySelectorAll('input');
        data.certifications.push({
            name: inputs[0].value,
            issuer: inputs[1].value,
            year: inputs[2].value,
            url: inputs[3].value
        });
    });

    return data;
}

// Categorize Skills
function categorizeSkills(skills) {
    const categories = {
        programming: ['python', 'javascript', 'java', 'c++', 'c#', 'rust', 'go', 'kotlin', 'swift', 'php', 'ruby', 'sql'],
        tools: ['git', 'docker', 'kubernetes', 'jenkins', 'gitlab', 'github', 'jira', 'aws', 'azure', 'gcp', 'figma'],
        frameworks: ['react', 'angular', 'vue', 'django', 'flask', 'fastapi', 'express', 'spring', 'tensorflow', 'pytorch', 'keras'],
        databases: ['mysql', 'postgresql', 'mongodb', 'redis', 'elasticsearch', 'cassandra', 'firebase'],
        soft_skills: ['communication', 'leadership', 'problem solving', 'teamwork', 'time management', 'critical thinking']
    };

    const categorized = {
        programming: [],
        tools: [],
        frameworks: [],
        databases: [],
        soft_skills: []
    };

    skills.forEach(skill => {
        const lower = skill.toLowerCase();
        let found = false;

        for (const [category, keywords] of Object.entries(categories)) {
            if (keywords.some(keyword => lower.includes(keyword))) {
                categorized[category].push(skill);
                found = true;
                break;
            }
        }

        if (!found && !categorized.soft_skills.includes(skill)) {
            categorized.soft_skills.push(skill);
        }
    });

    return categorized;
}

// Display Categorized Skills in Results
function displayCategorizedSkills(skills) {
    const categorized = categorizeSkills(skills);
    let html = '<div style="display: grid; gap: 1rem;">';

    if (categorized.programming.length > 0) {
        html += `<div><strong>💻 Programming:</strong> ${categorized.programming.join(', ')}</div>`;
    }
    if (categorized.frameworks.length > 0) {
        html += `<div><strong>⚙️ Frameworks:</strong> ${categorized.frameworks.join(', ')}</div>`;
    }
    if (categorized.tools.length > 0) {
        html += `<div><strong>🛠️ Tools:</strong> ${categorized.tools.join(', ')}</div>`;
    }
    if (categorized.databases.length > 0) {
        html += `<div><strong>🗄️ Databases:</strong> ${categorized.databases.join(', ')}</div>`;
    }
    if (categorized.soft_skills.length > 0) {
        html += `<div><strong>💬 Soft Skills:</strong> ${categorized.soft_skills.join(', ')}</div>`;
    }

    html += '</div>';
    return html;
}

// Optimize Links
function validateAndOptimizeLinks() {
    const links = {
        github: document.getElementById('githubLink').value,
        linkedin: document.getElementById('linkedinLink').value,
        portfolio: document.getElementById('portfolioLink').value
    };

    const issues = [];

    if (!links.github) {
        issues.push('❌ GitHub profile is missing - Add your GitHub URL for better visibility');
    } else if (!links.github.includes('github.com')) {
        issues.push('⚠️ Invalid GitHub URL - Should contain github.com');
    }

    if (!links.linkedin) {
        issues.push('❌ LinkedIn profile is missing - Essential for professional networking');
    } else if (!links.linkedin.includes('linkedin.com')) {
        issues.push('⚠️ Invalid LinkedIn URL - Should contain linkedin.com');
    }

    if (!links.portfolio) {
        issues.push('⚠️ Portfolio/Website is missing - Consider adding one to showcase projects');
    }

    return { links, issues };
}

// Evaluate Projects
function evaluateProjects(projects) {
    const evaluation = {
        total: projects.length,
        withMetrics: 0,
        withUrls: 0,
        suggestions: []
    };

    projects.forEach((project, index) => {
        if (!project.name || project.name.trim() === '') {
            return;
        }

        if (project.metrics && project.metrics.trim() !== '') {
            evaluation.withMetrics++;
        } else {
            evaluation.suggestions.push(`Project "${project.name}": Add quantifiable metrics (e.g., 50K+ users, 98% accuracy)`);
        }

        if (project.url && project.url.trim() !== '') {
            evaluation.withUrls++;
        } else {
            evaluation.suggestions.push(`Project "${project.name}": Add GitHub or live URL link`);
        }
    });

    return evaluation;
}

// Complete Optimization Function
async function optimizeComplete() {
    const fileInput = document.getElementById('resumeFile');
    const jobRole = document.getElementById('jobRole').value;
    
    if (!fileInput.files.length) {
        showToast('Please upload a resume first', 'error');
        return;
    }

    if (!jobRole) {
        showToast('Please select a job role', 'error');
        return;
    }

    const optimizationData = collectOptimizationData();
    const linkEvaluation = validateAndOptimizeLinks();
    const projectEvaluation = evaluateProjects(optimizationData.projects);

    // Create optimization report
    let report = '<div style="background: var(--bg-light); padding: 1.5rem; border-radius: 15px;">';
    
    // Links Optimization Report
    report += '<h4 style="color: var(--primary-color); margin-bottom: 1rem;">🔗 Links Optimization Report</h4>';
    if (linkEvaluation.issues.length > 0) {
        report += '<ul style="list-style: none; padding: 0;">';
        linkEvaluation.issues.forEach(issue => {
            report += `<li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">${issue}</li>`;
        });
        report += '</ul>';
    } else {
        report += '<p style="color: green;">✓ All important links are configured!</p>';
    }

    // Project Evaluation Report
    if (optimizationData.projects.length > 0) {
        report += '<h4 style="color: var(--primary-color); margin-top: 1.5rem; margin-bottom: 1rem;">📁 Project Evaluation</h4>';
        report += `<p>Total Projects: <strong>${projectEvaluation.total}</strong></p>`;
        report += `<p>With Metrics: <strong>${projectEvaluation.withMetrics}/${projectEvaluation.total}</strong></p>`;
        report += `<p>With URLs: <strong>${projectEvaluation.withUrls}/${projectEvaluation.total}</strong></p>`;
        
        if (projectEvaluation.suggestions.length > 0) {
            report += '<h5 style="margin-top: 1rem;">Suggestions:</h5>';
            report += '<ul style="list-style: none; padding: 0;">';
            projectEvaluation.suggestions.forEach(suggestion => {
                report += `<li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">💡 ${suggestion}</li>`;
            });
            report += '</ul>';
        }
    }

    // Certifications Report
    if (optimizationData.certifications.length > 0) {
        report += '<h4 style="color: var(--primary-color); margin-top: 1.5rem; margin-bottom: 1rem;">🏆 Certifications</h4>';
        report += '<ul style="list-style: none; padding: 0;">';
        optimizationData.certifications.forEach(cert => {
            if (cert.name) {
                report += `<li style="padding: 0.5rem 0; border-bottom: 1px solid var(--border-color);">
                    <strong>${cert.name}</strong> | ${cert.issuer} (${cert.year})
                </li>`;
            }
        });
        report += '</ul>';
    }

    report += '</div>';

    // Display report in results container
    const resultsContainer = document.getElementById('resultsContainer');
    const optimizationSection = document.createElement('div');
    optimizationSection.className = 'ai-suggestions';
    optimizationSection.innerHTML = '<h3>📈 Complete Optimization Report</h3>' + report;
    resultsContainer.appendChild(optimizationSection);

    showToast('✓ Optimization complete! View report above.', 'success');
    resultsContainer.scrollIntoView({ behavior: 'smooth' });
}

// Export all data for LaTeX
function enrichLatexWithOptimizationData(latex, optimizationData) {
    // This function can be used to enhance the LaTeX with links, projects, and certifications
    let enrichedLatex = latex;
    
    // Add links section if available
    if (optimizationData.github || optimizationData.linkedin || optimizationData.portfolio) {
        const linkSection = '\n\\section*{Links}\n';
        const links = [];
        
        if (optimizationData.github) {
            links.push(`GitHub: \\href{${optimizationData.github}}{${optimizationData.github}}`);
        }
        if (optimizationData.linkedin) {
            links.push(`LinkedIn: \\href{${optimizationData.linkedin}}{${optimizationData.linkedin}}`);
        }
        if (optimizationData.portfolio) {
            links.push(`Portfolio: \\href{${optimizationData.portfolio}}{${optimizationData.portfolio}}`);
        }
        
        enrichedLatex = enrichedLatex.replace('\\end{document}', linkSection + links.join(' \\\\ ') + '\n\n\\end{document}');
    }
    
    return enrichedLatex;
}
