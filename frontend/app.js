// 1. Function to switch visible sections (Navigation)
function showSection(sectionId) {
    // Hide all sections first
    document.getElementById('login-section').style.display = 'none';
    document.getElementById('quiz-section').style.display = 'none';
    document.getElementById('dashboard-section').style.display = 'none';

    // Display the requested section
    document.getElementById(sectionId).style.display = 'block';

    // If switching to dashboard, load the performance chart
    if (sectionId === 'dashboard-section') {
        loadDashboardChart();
    }
}

// 2. Handle Login Form Submission
document.getElementById('login-form').addEventListener('submit', function(e) {
    e.preventDefault();
    const email = document.getElementById('email').value;
    alert(`Welcome back to DaRa AI, ${email}!`);
    
    // Automatically switch to the quiz section after logging in
    showSection('quiz-section');
});

// 3. Quiz Generation Logic (Daavinesh's Feature)
function startQuiz() {
    const questionText = document.getElementById('quiz-question');
    const optionsContainer = document.getElementById('quiz-options');

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

// 4. Render Chart.js Analytics (Daavinesh's Feature)
let chartInstance = null;

function loadDashboardChart() {
    const ctx = document.getElementById('scoreChart').getContext('2d');

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

// 5. Function to toggle between Light Mode and Dark Mode
function toggleTheme() {
    // Toggle the 'dark-mode' class on the <body> tag
    document.body.classList.toggle('dark-mode');

    // Update the button text depending on which mode is active
    const themeBtn = document.getElementById('theme-btn');
    if (document.body.classList.contains('dark-mode')) {
        themeBtn.innerText = '☀️ Light Mode';
    } else {
        themeBtn.innerText = '🌙 Dark Mode';
    }
}