let scrollInterval;
        let isScrolling = false;
        let scrollSpeed = 50;
        let synth = window.speechSynthesis;
        let utterance;

        const mottoParagraphs = [
            "🌍 English is a universal language that connects people worldwide. Improving English skills helps in professional growth and communication.",
            "📚 One way to improve English is through daily reading practice. Reading aloud and listening to native speakers enhance fluency.",
            "🧠 Practicing with articles, books, and online resources builds vocabulary and comprehension.",
            "💬 Confidence in English communication is achieved by consistent practice and real-world conversations.",
            "🌀 Auto-scrolling tools help in reading fluency by maintaining a steady pace. This allows readers to focus on understanding rather than scrolling manually.",
            "✨ Keep reading, keep learning, and improve your English skills every day!"
        ];

        function loadContent() {
            let savedContent = localStorage.getItem("readingContent");
            let savedScroll = localStorage.getItem("scrollPosition");

            if (savedContent) {
                // Format the content with proper paragraphs
                const formattedContent = formatContent(savedContent);
                document.getElementById("content").innerHTML = formattedContent;
            } else {
                document.getElementById("content").innerHTML = "<p>No content found. Please add content first.</p>";
            }

            if (savedScroll) {
                document.getElementById("content-wrapper").scrollTop = savedScroll;
                updateProgressBar();
            }
        }

        // Function to format content with proper paragraphs
        function formatContent(text) {
            // Split the text by line breaks
            let paragraphs = text.split(/\n+/);
            
            // Create HTML paragraphs
            let formattedText = "";
            paragraphs.forEach(paragraph => {
                // Check if paragraph is a heading (starts with # for markdown or has fewer than 5 words and ends with :)
                if (paragraph.trim().startsWith('#') || 
                   (paragraph.trim().endsWith(':') && paragraph.split(' ').length < 5)) {
                    // Handle as heading - check the number of # characters for level
                    if (paragraph.trim().startsWith('#')) {
                        const level = (paragraph.match(/^#+/) || ['#'])[0].length;
                        const headingText = paragraph.replace(/^#+\s*/, '');
                        formattedText += `<h${Math.min(level, 6)}>${headingText}</h${Math.min(level, 6)}>`;
                    } else {
                        // Just a short line ending with colon, make it a subheading
                        formattedText += `<h4>${paragraph}</h4>`;
                    }
                } else if (paragraph.trim()) {
                    // Regular paragraph
                    formattedText += `<p>${paragraph}</p>`;
                }
            });
            
            return formattedText || "<p>Start reading...</p>";
        }

        function startScroll() {
            if (!isScrolling) {
                scrollInterval = setInterval(() => {
                    const wrapper = document.querySelector(".content-wrapper");
                    wrapper.scrollTop += 1;
                    localStorage.setItem("scrollPosition", wrapper.scrollTop);
                    updateProgressBar();
                }, scrollSpeed);
                isScrolling = true;
            }
        }

        function pauseScroll() {
            clearInterval(scrollInterval);
            isScrolling = false;
        }

        function changeSpeed() {
            let speedButton = document.querySelector(".speed-control");
            if (scrollSpeed === 50) {
                scrollSpeed = 30;
                speedButton.textContent = "Speed: Fast";
            } else if (scrollSpeed === 30) {
                scrollSpeed = 80;
                speedButton.textContent = "Speed: Slow";
            } else {
                scrollSpeed = 50;
                speedButton.textContent = "Speed: Medium";
            }
            if (isScrolling) {
                pauseScroll();
                startScroll();
            }
        }

        function clearContent() {
            if (confirm("Are you sure you want to clear the content?")) {
                localStorage.removeItem("readingContent");
                localStorage.removeItem("scrollPosition");
                document.getElementById("content").innerHTML = "<p>No content found. Please add content first.</p>";
                updateProgressBar();
            }
        }

        function speakText() {
            utterance = new SpeechSynthesisUtterance(document.getElementById("content").textContent);
            synth.speak(utterance);
            document.querySelector(".pause-speak").style.display = "inline-block";
            document.querySelector(".stop-speak").style.display = "inline-block";
        }

        function pauseSpeech() {
            if (synth.speaking && !synth.paused) {
                synth.pause();
                document.querySelector(".pause-speak").textContent = "▶️ Resume";
            } else {
                synth.resume();
                document.querySelector(".pause-speak").textContent = "⏸ Pause";
            }
        }

        function stopSpeech() {
            synth.cancel();
            document.querySelector(".pause-speak").style.display = "none";
            document.querySelector(".stop-speak").style.display = "none";
        }

        function toggleMoreOptions() {
            let moreOptions = document.getElementById("more-options");
            if (moreOptions.style.display === "flex") {
                moreOptions.style.display = "none";
                document.querySelector(".more").textContent = "More ⬇";
            } else {
                moreOptions.style.display = "flex";
                document.querySelector(".more").textContent = "Less ⬆";
            }
        }

        function speakHighlightedText() {
            let selectedText = window.getSelection().toString();
            if (selectedText.trim() === "") {
                alert("Please highlight some text to read.");
                return;
            }
            speak(selectedText);
        }

        function speak(text) {
            stopSpeech(); // Stop any existing speech before starting a new one
            utterance = new SpeechSynthesisUtterance(text);
            synth.speak(utterance);
            document.querySelector(".pause-speak").style.display = "inline-block";
            document.querySelector(".stop-speak").style.display = "inline-block";
            
            // Reset button text
            document.querySelector(".pause-speak").textContent = "⏸ Pause";
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
        
        function toggleMotto() {
            const mottoDiv = document.getElementById("motto-content");
            const btn = document.querySelector(".motto-btn");
            if (mottoDiv.style.display === "none") {
                // Load content
                mottoDiv.innerHTML = ""; // Clear previous content
                mottoParagraphs.forEach(p => {
                    const para = document.createElement("p");
                    para.textContent = p;
                    mottoDiv.appendChild(para);
                });
                mottoDiv.style.display = "block";
                btn.textContent = "📘 Hide Motto";
            } else {
                mottoDiv.style.display = "none";
                btn.textContent = "📘 Show Motto";
            }
        }
        
        function updateProgressBar() {
            const wrapper = document.querySelector(".content-wrapper");
            const maxScroll = wrapper.scrollHeight - wrapper.clientHeight;
            const currentScroll = wrapper.scrollTop;
            
            if (maxScroll > 0) {
                const percentage = (currentScroll / maxScroll) * 100;
                document.getElementById("progress-bar").style.width = percentage + "%";
            } else {
                document.getElementById("progress-bar").style.width = "0%";
            }
        }
        
        // Listen for scroll events to update progress bar
        document.querySelector(".content-wrapper").addEventListener("scroll", function() {
            updateProgressBar();
            localStorage.setItem("scrollPosition", this.scrollTop);
        });
        
        // Initialize the page
        window.onload = () => {
            applyDarkMode();
            loadContent();
            updateProgressBar();
        };