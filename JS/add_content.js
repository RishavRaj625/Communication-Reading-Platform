function saveContent() {
    let content = document.getElementById("userContent").value;
    if (content.trim() === "") {
        alert("Please enter some content.");
        return;
    }
    localStorage.setItem("readingContent", content);
    localStorage.removeItem("scrollPosition"); // Reset scroll position
    alert("Content saved! Go to the Reading Page.");
}

function clearContent() {
    document.getElementById("userContent").value = "";
}

function loadSample() {
    const sampleText = "The Benefits of Reading Practice\n\nReading is one of the most effective ways to improve language skills. When you read regularly, you naturally expand your vocabulary, improve your grammar, and develop better comprehension skills. Many language experts recommend reading at least 20-30 minutes every day to see significant improvement.\n\nWhen practicing reading in English, start with materials that match your current level. If you find yourself looking up more than 5-6 words per page, the text might be too difficult. Ideally, you should understand about 95% of the words you're reading.\n\nReading aloud is particularly beneficial for improving pronunciation and speaking fluency. It forces you to articulate words clearly and helps you become more comfortable with English sounds and intonation patterns.\n\nUsing tools like auto-scrolling can help maintain a consistent reading pace. This is important because it pushes you to process information more efficiently—just like native speakers do. It prevents you from lingering too long on difficult words or phrases.\n\nConsistency is key in language learning. Even if you only have 10 minutes a day, regular practice will yield better results than occasional longer sessions. Set a realistic schedule and stick to it.\n\nRemember that improvement takes time. Be patient with yourself and celebrate small victories along the way. Every page you read brings you one step closer to fluency!";
    
    document.getElementById("userContent").value = sampleText;
}

function toggleDarkMode() {
    let isDark = document.body.classList.toggle("dark-mode");
    localStorage.setItem("darkMode", isDark ? "enabled" : "disabled");
    
    // Update button text
    const darkModeBtn = document.querySelector(".toggle-dark");
    darkModeBtn.textContent = isDark ? "Light Mode" : "Dark Mode";
}

function applyDarkMode() {
    if (localStorage.getItem("darkMode") === "enabled") {
        document.body.classList.add("dark-mode");
        document.querySelector(".toggle-dark").textContent = "Light Mode";
    }
}

// Load previous content if available
function loadPreviousContent() {
    const savedContent = localStorage.getItem("readingContent");
    if (savedContent) {
        document.getElementById("userContent").value = savedContent;
    }
}

window.onload = function() {
    applyDarkMode();
    loadPreviousContent();
};