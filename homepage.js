// Homepage JavaScript functionality

// Generate dynamic prompt based on user input
function generatePrompt() {
    const topic = document.getElementById('topic-input').value.trim();
    const questionCount = document.getElementById('question-count').value;
    
    if (!topic) {
        alert('Please enter a topic for your quiz.');
        document.getElementById('topic-input').focus();
        return;
    }
    
    const promptText = `"Create a comprehensive quiz on ${topic} with ${questionCount} questions using the following EXACT format:

QUESTIONS:
Present questions numbered as "Question 1", "Question 2", etc.
Each question should have 4 options labeled a), b), c), d)

ANSWERS:
Create an "ANSWERS" section with ONLY the question numbers and correct letters:
Use this exact format: "1: b", "2: c", "3: a" (one per line)
DO NOT include the full answer text, just number: letter

DETAILED EXPLANATIONS:
Create a "DETAILED EXPLANATIONS" section with format:
Q1: [brief explanation]
Q2: [brief explanation]

EXAMPLE FORMAT (DO NOT USE THIS CONTENT - CREATE YOUR OWN BASED ON THE REQUESTED TOPIC):

Question 1
[Your question about the requested topic here]
a) [First option]
b) [Second option - correct answer]
c) [Third option]
d) [Fourth option]

Question 2
[Your second question about the requested topic here]
a) [First option]
b) [Second option]
c) [Third option - correct answer]
d) [Fourth option]

ANSWERS
1: b
2: c

DETAILED EXPLANATIONS
Q1: [Brief explanation for question 1]
Q2: [Brief explanation for question 2]

CRITICAL REQUIREMENTS:
• Questions must be numbered as "Question 1", "Question 2", etc. (on separate lines)
• Options must use lowercase letters: a), b), c), d)
• Answers section must use format "1: b" (number colon space letter)
• Keep explanations brief (1-2 sentences maximum)
• Ensure comprehensive coverage of the topic"`;
    
    // Update the prompt display
    const promptDisplay = document.getElementById('generated-prompt');
    promptDisplay.innerHTML = `<strong>"Create a comprehensive quiz on <span style="color: #4caf50; font-weight: bold;">${topic}</span> with <span style="color: #4caf50; font-weight: bold;">${questionCount} questions</span> using the following EXACT format:</strong><br><br>

<strong>QUESTIONS:</strong><br>
Present questions numbered as "Question 1", "Question 2", etc.<br>
Each question should have 4 options labeled a), b), c), d)<br><br>

<strong>ANSWERS:</strong><br>
Create an "ANSWERS" section with ONLY the question numbers and correct letters:<br>
Use this exact format: "1: b", "2: c", "3: a" (one per line)<br>
DO NOT include the full answer text, just number: letter<br><br>

<strong>DETAILED EXPLANATIONS:</strong><br>
Create a "DETAILED EXPLANATIONS" section with format:<br>
Q1: [brief explanation]<br>
Q2: [brief explanation]<br><br>

<strong>EXAMPLE FORMAT (DO NOT USE THIS CONTENT - CREATE YOUR OWN BASED ON THE REQUESTED TOPIC):</strong><br><br>

Question 1<br>
[Your question about the requested topic here]<br>
a) [First option]<br>
b) [Second option - correct answer]<br>
c) [Third option]<br>
d) [Fourth option]<br><br>

Question 2<br>
[Your second question about the requested topic here]<br>
a) [First option]<br>
b) [Second option]<br>
c) [Third option - correct answer]<br>
d) [Fourth option]<br><br>

ANSWERS<br>
1: b<br>
2: c<br><br>

DETAILED EXPLANATIONS<br>
Q1: [Brief explanation for question 1]<br>
Q2: [Brief explanation for question 2]<br><br>

<strong>CRITICAL REQUIREMENTS:</strong><br>
• Questions must be numbered as "Question 1", "Question 2", etc. (on separate lines)<br>
• Options must use lowercase letters: a), b), c), d)<br>
• Answers section must use format "1: b" (number colon space letter)<br>
• Keep explanations brief (1-2 sentences maximum)<br>
• Ensure comprehensive coverage of the topic"`;
    
    // Show success message
    showGenerateSuccess();
}

// Copy the generated prompt
function copyGeneratedPrompt() {
    const topic = document.getElementById('topic-input').value.trim();
    const questionCount = document.getElementById('question-count').value;
    
    if (!topic) {
        alert('Please generate a prompt first by entering a topic and clicking "Generate Prompt".');
        return;
    }
    
    const promptText = `"Create a comprehensive quiz on ${topic} with ${questionCount} questions using the following EXACT format:

QUESTIONS:
Present questions numbered as "Question 1", "Question 2", etc.
Each question should have 4 options labeled a), b), c), d)

ANSWERS:
Create an "ANSWERS" section with ONLY the question numbers and correct letters:
Use this exact format: "1: b", "2: c", "3: a" (one per line)
DO NOT include the full answer text, just number: letter

DETAILED EXPLANATIONS:
Create a "DETAILED EXPLANATIONS" section with format:
Q1: [brief explanation]
Q2: [brief explanation]

EXAMPLE FORMAT (DO NOT USE THIS CONTENT - CREATE YOUR OWN BASED ON THE REQUESTED TOPIC):

Question 1
[Your question about the requested topic here]
a) [First option]
b) [Second option - correct answer]
c) [Third option]
d) [Fourth option]

Question 2
[Your second question about the requested topic here]
a) [First option]
b) [Second option]
c) [Third option - correct answer]
d) [Fourth option]

ANSWERS
1: b
2: c

DETAILED EXPLANATIONS
Q1: [Brief explanation for question 1]
Q2: [Brief explanation for question 2]

CRITICAL REQUIREMENTS:
• Questions must be numbered as "Question 1", "Question 2", etc. (on separate lines)
• Options must use lowercase letters: a), b), c), d)
• Answers section must use format "1: b" (number colon space letter)
• Keep explanations brief (1-2 sentences maximum)
• Ensure comprehensive coverage of the topic"`;

    // Copy to clipboard
    if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(promptText).then(() => {
            showCopySuccess();
        }).catch(() => {
            fallbackCopyTextToClipboard(promptText);
        });
    } else {
        fallbackCopyTextToClipboard(promptText);
    }
}

// Legacy copy function (keeping for backward compatibility)
function copyPrompt() {
    copyGeneratedPrompt();
}

// Fallback copy method for older browsers
function fallbackCopyTextToClipboard(text) {
    const textArea = document.createElement("textarea");
    textArea.value = text;
    textArea.style.top = "0";
    textArea.style.left = "0";
    textArea.style.position = "fixed";
    textArea.style.opacity = "0";

    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();

    try {
        document.execCommand('copy');
        showCopySuccess();
    } catch (err) {
        showCopyError();
    }

    document.body.removeChild(textArea);
}

// Show copy success feedback
function showCopySuccess() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    
    copyBtn.innerHTML = '<span>✅ Copied!</span>';
    copyBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
}

// Show copy error feedback
function showCopyError() {
    const copyBtn = document.querySelector('.copy-btn');
    const originalText = copyBtn.innerHTML;
    
    copyBtn.innerHTML = '<span>❌ Copy Failed</span>';
    copyBtn.style.background = 'linear-gradient(135deg, #f44336 0%, #d32f2f 100%)';
    
    setTimeout(() => {
        copyBtn.innerHTML = originalText;
        copyBtn.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
    }, 2000);
}

// Show generate success feedback
function showGenerateSuccess() {
    const generateBtn = document.querySelector('.generate-btn');
    const originalText = generateBtn.innerHTML;
    
    generateBtn.innerHTML = '<span>✨ Generated!</span>';
    generateBtn.style.background = 'linear-gradient(135deg, #4caf50 0%, #45a049 100%)';
    
    setTimeout(() => {
        generateBtn.innerHTML = originalText;
        generateBtn.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
    }, 2000);
}

// Smooth scrolling for navigation links
document.addEventListener('DOMContentLoaded', function() {
    // Handle smooth scrolling
    const navLinks = document.querySelectorAll('a[href^="#"]');
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);
            
            if (targetElement) {
                const navHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetElement.offsetTop - navHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    let lastScrollTop = 0;

    window.addEventListener('scroll', function() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
        
        if (scrollTop > 100) {
            navbar.style.background = 'rgba(15, 15, 35, 0.98)';
            navbar.style.backdropFilter = 'blur(30px)';
        } else {
            navbar.style.background = 'rgba(15, 15, 35, 0.95)';
            navbar.style.backdropFilter = 'blur(20px)';
        }
        
        lastScrollTop = scrollTop;
    });

    // Add intersection observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe feature cards and other elements
    const elementsToAnimate = document.querySelectorAll('.feature-card, .step, .instruction-prompt, .format-example');
    elementsToAnimate.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
        el.style.transition = 'all 0.6s ease-out';
        observer.observe(el);
    });

    // Add hover effects to feature cards
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });

    // Add floating animation to quiz preview
    const quizPreview = document.querySelector('.quiz-preview');
    if (quizPreview) {
        setInterval(() => {
            quizPreview.style.transform = 'translateY(-5px)';
            setTimeout(() => {
                quizPreview.style.transform = 'translateY(0)';
            }, 2000);
        }, 4000);
    }

    // Add typing effect to hero title (optional enhancement)
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle && window.innerWidth > 768) {
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.opacity = '1';
        
        let i = 0;
        const typeWriter = () => {
            if (i < text.length) {
                heroTitle.textContent += text.charAt(i);
                i++;
                setTimeout(typeWriter, 50);
            }
        };
        
        setTimeout(typeWriter, 1000);
    }

    // Add random floating elements (decorative)
    function createFloatingElement() {
        const element = document.createElement('div');
        element.style.position = 'fixed';
        element.style.width = '4px';
        element.style.height = '4px';
        element.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        element.style.borderRadius = '50%';
        element.style.left = Math.random() * window.innerWidth + 'px';
        element.style.top = window.innerHeight + 'px';
        element.style.opacity = '0.5';
        element.style.pointerEvents = 'none';
        element.style.zIndex = '1';
        element.style.transition = 'all 15s linear';
        
        document.body.appendChild(element);
        
        setTimeout(() => {
            element.style.top = '-10px';
            element.style.opacity = '0';
        }, 100);
        
        setTimeout(() => {
            if (element.parentNode) {
                element.parentNode.removeChild(element);
            }
        }, 15000);
    }

    // Create floating elements periodically
    setInterval(createFloatingElement, 3000);
    
    // Add Enter key functionality for topic input
    const topicInput = document.getElementById('topic-input');
    if (topicInput) {
        topicInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                e.preventDefault();
                generatePrompt();
            }
        });
    }
    
    // Video tutorial functionality
    initializeVideoTutorials();
});

// Video tutorial functions
function initializeVideoTutorials() {
    const selectorButtons = document.querySelectorAll('.ai-selector-btn');
    const video = document.getElementById('tutorial-video');
    const videoOverlay = document.getElementById('video-overlay');
    const playButton = document.getElementById('play-button');
    const videoTitle = document.getElementById('video-title');
    
    if (!selectorButtons.length || !video) {
        return; // Exit if elements don't exist (not on instructions page)
    }
    
    // AI selector button click handlers
    selectorButtons.forEach(button => {
        button.addEventListener('click', function() {
            const aiType = this.dataset.ai;
            switchVideo(aiType);
            
            // Update active button
            selectorButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Play button click handler
    if (playButton) {
        playButton.addEventListener('click', function() {
            playVideo();
        });
    }
    
    // Video overlay click handler
    if (videoOverlay) {
        videoOverlay.addEventListener('click', function() {
            playVideo();
        });
    }
    
    // Video ended handler - show overlay again
    if (video) {
        video.addEventListener('ended', function() {
            showVideoOverlay();
        });
        
        video.addEventListener('pause', function() {
            showVideoOverlay();
        });
    }
}

function switchVideo(aiType) {
    const video = document.getElementById('tutorial-video');
    const videoTitle = document.getElementById('video-title');
    
    if (!video || !videoTitle) return;
    
    // Pause current video
    video.pause();
    
    // Switch video source and title based on AI type
    if (aiType === 'chatgpt') {
        video.src = 'videos/CHATGPT.mp4';
        videoTitle.textContent = 'ChatGPT Tutorial - How to Generate Quiz Content';
    } else if (aiType === 'claude') {
        video.src = 'videos/CLAUDE.mp4';
        videoTitle.textContent = 'Claude Tutorial - How to Generate Quiz Content';
    }
    
    // Show overlay and reset video
    showVideoOverlay();
    video.load(); // Reload the video with new source
}

function playVideo() {
    const video = document.getElementById('tutorial-video');
    const videoOverlay = document.getElementById('video-overlay');
    
    if (!video || !videoOverlay) return;
    
    // Hide overlay
    videoOverlay.classList.add('hidden');
    
    // Play video
    video.play().catch(error => {
        console.error('Error playing video:', error);
        showVideoOverlay(); // Show overlay again if play fails
    });
}

function showVideoOverlay() {
    const videoOverlay = document.getElementById('video-overlay');
    if (videoOverlay) {
        videoOverlay.classList.remove('hidden');
    }
}
