// ==========================================
// 1. Navigation & Authentication
// ==========================================

// Handle Login Form Submission
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    
    // Only run this if we are currently on the login page (index.html)
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('email').value;
            alert(`Welcome back to DaRa AI, ${email}!`);
            
            // Redirect to the Quiz page after logging in
            window.location.href = 'quiz.html';
        });
    }

    // Register Form Handler (register.html)
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('reg-name').value;
            alert(`Account created successfully for ${name}! Please log in.`);
            
            // Redirect back to login page
            window.location.href = 'index.html';
        });
    }

    // Auto-load Chart if we are currently on the dashboard page
    if (document.getElementById('scoreChart')) {
        loadDashboardChart();
    }
});

// Logout Function (Callable from any page navbar)
function logout() {
    // Redirect back to login page
    window.location.href = 'index.html';
}


// ==========================================
// 2. Quiz Generation Logic (Davinesh)
// ==========================================

function startQuiz() {
    const questionText = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');

    if (!questionText || !optionsContainer) return;

    // Sample question from AI
    questionText.innerText = "What does RAG stand for in modern AI architectures?";
    
    optionsContainer.innerHTML = `
        <button class="option-btn" onclick="checkAnswer(false)">A) Rapid Access Generator</button>
        <button class="option-btn" onclick="checkAnswer(true)">B) Retrieval-Augmented Generation</button>
        <button class="option-btn" onclick="checkAnswer(false)">C) Random Automated Grading</button>
    `;
}

function checkAnswer(isCorrect) {
    if (isCorrect) {
        alert("Correct! 🎉 Retrieval-Augmented Generation combines search with AI models.");
    } else {
        alert("Not quite right! Try reviewing the study material.");
    }
}


// ==========================================
// 3. Render Chart.js Analytics (Davinesh)
// ==========================================

let chartInstance = null;

function loadDashboardChart() {
    const canvas = document.getElementById('scoreChart');
    if (!canvas) return; // Exit if chart canvas doesn't exist on current page

    const ctx = canvas.getContext('2d');

    // Destroy existing chart to prevent re-render overlap glitches
    if (chartInstance) {
        chartInstance.destroy();
    }

    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['Quiz 1', 'Quiz 2', 'Quiz 3', 'Quiz 4', 'Quiz 5'],
            datasets: [{
                label: 'Quiz Scores (%)',
                data: [60, 75, 70, 85, 95],
                borderColor: '#6366F1',
                backgroundColor: 'rgba(99, 102, 241, 0.2)',
                fill: true,
                tension: 0.3
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}


// ==========================================
// 4. Theme Switcher (Light / Dark Mode)
// ==========================================

function toggleTheme() {
    // Toggle the 'dark-mode' class on the <body> tag
    document.body.classList.toggle('dark-mode');

    // Update the button text depending on which mode is active
    const themeBtn = document.getElementById('theme-btn');
    if (themeBtn) {
        if (document.body.classList.contains('dark-mode')) {
            themeBtn.innerText = '☀️ Light Mode';
        } else {
            themeBtn.innerText = '🌙 Dark Mode';
        }
    }
}