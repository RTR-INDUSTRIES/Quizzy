class QuizApp {
    constructor() {
        this.questions = [];
        this.answers = [];
        this.explanations = [];
        this.currentQuestionIndex = 0;
        this.selectedAnswers = [];
        this.correctAnswers = [];
        this.startTime = null;
        this.endTime = null;
        this.init();
    }

    init() {
        this.bindEvents();
    }

    bindEvents() {
        const generateBtn = document.getElementById('generate-quiz');
        const nextBtn = document.getElementById('next-question');
        const previousBtn = document.getElementById('previous-question');
        const backBtn = document.getElementById('back-to-input');
        const retakeBtn = document.getElementById('retake-quiz');
        const newQuizBtn = document.getElementById('new-quiz');

        generateBtn.addEventListener('click', () => this.generateQuiz());
        nextBtn.addEventListener('click', () => this.nextQuestion());
        previousBtn.addEventListener('click', () => this.previousQuestion());
        backBtn.addEventListener('click', () => this.backToInput());
        retakeBtn.addEventListener('click', () => this.retakeQuiz());
        newQuizBtn.addEventListener('click', () => this.backToInput());
    }

    parseQuizInput(input) {
        console.log('Starting quiz parsing...');
        
        // First, split into main sections more carefully
        const text = input.trim();
        
        // Find section boundaries
        const answersMatch = text.match(/\nANSWERS\s*:?\s*\n/i);
        const explanationsMatch = text.match(/\nDETAILED EXPLANATIONS\s*:?\s*\n/i);
        
        let questionsText = text;
        let answersText = '';
        let explanationsText = '';
        
        if (answersMatch) {
            const answersStart = answersMatch.index + answersMatch[0].length;
            questionsText = text.substring(0, answersMatch.index);
            
            if (explanationsMatch && explanationsMatch.index > answersMatch.index) {
                answersText = text.substring(answersStart, explanationsMatch.index);
                explanationsText = text.substring(explanationsMatch.index + explanationsMatch[0].length);
            } else {
                answersText = text.substring(answersStart);
            }
        } else if (explanationsMatch) {
            questionsText = text.substring(0, explanationsMatch.index);
            explanationsText = text.substring(explanationsMatch.index + explanationsMatch[0].length);
        }
        
        console.log('Section splits:', {
            questions: questionsText.length,
            answers: answersText.length,
            explanations: explanationsText.length
        });
        
        // Parse questions
        const questions = this.parseQuestionsSection(questionsText);
        
        // Parse answers
        const answers = this.parseAnswersSection(answersText);
        
        // Parse explanations
        const explanations = this.parseExplanationsSection(explanationsText);
        
        console.log('Final parsing results:', {
            questionsCount: questions.length,
            answersCount: answers.length,
            explanationsCount: explanations.length,
            answers: answers,
            explanations: explanations
        });
        
        return { questions, answers, explanations };
    }
    
    parseQuestionsSection(text) {
        const questions = [];
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        let currentQuestion = null;
        
        for (const line of lines) {
            if (line.match(/^Question\s+\d+/i)) {
                // Save previous question if exists
                if (currentQuestion && currentQuestion.options.length > 0) {
                    questions.push(currentQuestion);
                }
                // Start new question
                currentQuestion = {
                    questionNumber: questions.length + 1,
                    questionText: '',
                    options: []
                };
            } else if (currentQuestion) {
                if (line.match(/^[a-d]\)/i)) {
                    // This is an option
                    const optionLetter = line.charAt(0).toLowerCase();
                    const optionText = line.substring(2).trim();
                    currentQuestion.options.push({
                        letter: optionLetter,
                        text: optionText
                    });
                } else if (!line.toUpperCase().startsWith('QUESTIONS') && !line.toUpperCase().startsWith('ANSWERS') && !line.toUpperCase().startsWith('DETAILED')) {
                    // This is part of the question text
                    if (currentQuestion.questionText) {
                        currentQuestion.questionText += ' ' + line;
                    } else {
                        currentQuestion.questionText = line;
                    }
                }
            }
        }
        
        // Add the last question
        if (currentQuestion && currentQuestion.options.length > 0) {
            questions.push(currentQuestion);
        }
        
        return questions;
    }
    
    parseAnswersSection(text) {
        const answers = [];
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        for (const line of lines) {
            // Format: "1: b", "2: c", etc.
            const match = line.match(/^(\d+)[:.]\s*([a-d])$/i);
            if (match) {
                const questionNum = parseInt(match[1]);
                const answerLetter = match[2].toLowerCase();
                // Store in the correct position (questionNum - 1)
                answers[questionNum - 1] = answerLetter;
            }
        }
        
        return answers;
    }
    
    parseExplanationsSection(text) {
        const explanations = [];
        const lines = text.split('\n').map(line => line.trim()).filter(line => line.length > 0);
        
        for (const line of lines) {
            // Format: "Q1: explanation text", "Q2: explanation text", etc.
            const match = line.match(/^Q(\d+):\s*(.+)$/i);
            if (match) {
                const questionNum = parseInt(match[1]);
                const explanationText = match[2].trim();
                // Store in the correct position (questionNum - 1)
                explanations[questionNum - 1] = explanationText;
            }
        }
        
        return explanations;
    }

    extractCorrectAnswer(answerLine) {
        // Extract the letter from various answer line formats
        // Formats: "b) text", "b: text", "b. text", "1: b", "1. b", "2) b"
        let match = answerLine.match(/^([a-d])[):.]\s*/i);
        if (match) {
            return match[1].toLowerCase();
        }
        
        // Handle numbered format: "1: b", "1. b", "2) b"
        match = answerLine.match(/^\d+[):.]\s*([a-d])/i);
        if (match) {
            return match[1].toLowerCase();
        }
        
        return null;
    }

    generateQuiz() {
        const input = document.getElementById('quiz-input').value;
        
        if (!input.trim()) {
            alert('Please enter quiz content in the specified format.');
            return;
        }

        try {
            const parsed = this.parseQuizInput(input);
            this.questions = parsed.questions;
            this.answers = parsed.answers;
            this.explanations = parsed.explanations || [];
            
            if (this.questions.length === 0) {
                alert('No valid questions found. Please check the format.');
                return;
            }

            this.selectedAnswers = new Array(this.questions.length).fill(null);
            this.correctAnswers = this.answers; // Answers are now stored as letters directly
            this.currentQuestionIndex = 0;
            this.startTime = Date.now();
            
            // Debug logging
            console.log('Parsed questions:', this.questions.length);
            console.log('Parsed answers:', this.answers);
            console.log('Extracted correct answers:', this.correctAnswers);
            console.log('Explanations:', this.explanations.length);
            
            this.showQuizSection();
            this.displayQuestion();
            this.generateNavigationDots();
        } catch (error) {
            console.error('Error parsing quiz:', error);
            alert('Error parsing quiz content. Please check the format.');
        }
    }

    showQuizSection() {
        document.getElementById('input-section').classList.add('hidden');
        document.getElementById('quiz-section').classList.remove('hidden');
    }

    displayQuestion() {
        const question = this.questions[this.currentQuestionIndex];
        
        document.getElementById('question-number').textContent = `${question.questionNumber}.`;
        document.getElementById('question-text').textContent = question.questionText;
        document.getElementById('current-question').textContent = this.currentQuestionIndex + 1;
        document.getElementById('total-questions').textContent = this.questions.length;
        
        const optionsContainer = document.querySelector('.options-container');
        optionsContainer.innerHTML = '';
        
        question.options.forEach((option) => {
            const optionElement = this.createOptionElement(option);
            optionsContainer.appendChild(optionElement);
        });

        this.updateNavigationDots();
        this.hideFeedback();
        
        // Update next button text
        const nextBtn = document.getElementById('next-question');
        if (this.currentQuestionIndex === this.questions.length - 1) {
            nextBtn.textContent = 'Finish';
        } else {
            nextBtn.textContent = 'Next';
        }
        
        // Update previous button visibility
        const previousBtn = document.getElementById('previous-question');
        if (this.currentQuestionIndex === 0) {
            previousBtn.style.visibility = 'hidden';
        } else {
            previousBtn.style.visibility = 'visible';
        }
    }

    createOptionElement(option) {
        const optionDiv = document.createElement('div');
        optionDiv.className = 'option';
        optionDiv.dataset.option = option.letter;
        
        const isSelected = this.selectedAnswers[this.currentQuestionIndex] === option.letter;
        if (isSelected) {
            optionDiv.classList.add('selected');
        }
        
        optionDiv.innerHTML = `
            <span class="option-label">${option.letter.toUpperCase()}.</span>
            <span class="option-text">${option.text}</span>
        `;
        
        optionDiv.addEventListener('click', () => this.selectOption(option.letter, optionDiv));
        
        return optionDiv;
    }

    selectOption(letter, optionElement) {
        // Check if this question was already answered
        const wasAlreadyAnswered = this.selectedAnswers[this.currentQuestionIndex] !== null;
        
        // Remove selection from all options
        document.querySelectorAll('.option').forEach(opt => {
            opt.classList.remove('selected', 'correct', 'incorrect');
        });
        
        // Add selection to clicked option
        optionElement.classList.add('selected');
        
        // Store the selected answer
        this.selectedAnswers[this.currentQuestionIndex] = letter;
        
        // Show instant feedback
        this.showInstantFeedback(letter);
    }

    showInstantFeedback(selectedLetter) {
        const correctLetter = this.correctAnswers[this.currentQuestionIndex];
        const isCorrect = selectedLetter === correctLetter;
        
        // Highlight all options based on correctness
        document.querySelectorAll('.option').forEach(option => {
            const optionLetter = option.dataset.option;
            if (optionLetter === correctLetter) {
                option.classList.add('correct');
            } else if (optionLetter === selectedLetter && !isCorrect) {
                option.classList.add('incorrect');
            }
        });
        
        // Show feedback message
        const feedbackSection = document.getElementById('feedback-section');
        const feedbackContent = feedbackSection.querySelector('.feedback-content');
        const feedbackIcon = document.getElementById('feedback-icon');
        const feedbackText = document.getElementById('feedback-text');
        const correctAnswerText = document.getElementById('correct-answer-text');
        
        feedbackContent.classList.remove('correct', 'incorrect');
        
        if (isCorrect) {
            feedbackContent.classList.add('correct');
            feedbackIcon.textContent = '✓';
            feedbackText.textContent = 'Correct!';
            correctAnswerText.textContent = '';
        } else {
            feedbackContent.classList.add('incorrect');
            feedbackIcon.textContent = '✗';
            feedbackText.textContent = 'Incorrect!';
            
            // Find and display the correct answer option text
            const currentQuestion = this.questions[this.currentQuestionIndex];
            const correctOption = currentQuestion.options.find(option => option.letter === correctLetter);
            if (correctOption) {
                correctAnswerText.textContent = `Correct answer: ${correctLetter.toUpperCase()}) ${correctOption.text}`;
            } else {
                correctAnswerText.textContent = `Correct answer: ${correctLetter.toUpperCase()}`;
            }
        }
        
        feedbackSection.classList.remove('hidden');
        
        // Show detailed explanation if available
        this.showExplanation();
        
        // Update navigation dots
        this.updateNavigationDots();
    }

    showExplanation() {
        const explanationSection = document.getElementById('explanation-section');
        const explanationText = document.getElementById('explanation-text');
        
        // Check if we have an explanation for this question
        if (this.explanations && this.currentQuestionIndex < this.explanations.length) {
            const explanation = this.explanations[this.currentQuestionIndex];
            if (explanation && explanation.trim()) {
                explanationText.textContent = explanation;
                explanationSection.classList.remove('hidden');
            } else {
                explanationSection.classList.add('hidden');
            }
        } else {
            explanationSection.classList.add('hidden');
        }
    }

    hideFeedback() {
        document.getElementById('feedback-section').classList.add('hidden');
        document.getElementById('explanation-section').classList.add('hidden');
        
        // Remove highlight classes
        document.querySelectorAll('.option').forEach(option => {
            option.classList.remove('correct', 'incorrect');
        });
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.questions.length - 1) {
            this.currentQuestionIndex++;
            this.displayQuestion();
        } else {
            this.finishQuiz();
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.currentQuestionIndex--;
            this.displayQuestion();
        }
    }

    finishQuiz() {
        this.endTime = Date.now();
        this.showResultsPage();
    }

    showResultsPage() {
        // Calculate statistics
        let correctCount = 0;
        let incorrectCount = 0;
        let unansweredCount = 0;
        
        for (let i = 0; i < this.questions.length; i++) {
            if (this.selectedAnswers[i] === null) {
                unansweredCount++;
            } else if (this.selectedAnswers[i] === this.correctAnswers[i]) {
                correctCount++;
            } else {
                incorrectCount++;
            }
        }
        
        const totalAnswered = correctCount + incorrectCount;
        const accuracy = totalAnswered > 0 ? Math.round((correctCount / totalAnswered) * 100) : 0;
        const overallScore = Math.round((correctCount / this.questions.length) * 100);
        
        // Calculate time taken
        const timeTaken = this.endTime - this.startTime;
        const minutes = Math.floor(timeTaken / 60000);
        const seconds = Math.floor((timeTaken % 60000) / 1000);
        const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
        
        // Hide quiz section and show results
        document.getElementById('quiz-section').classList.add('hidden');
        document.getElementById('results-section').classList.remove('hidden');
        
        // Check for perfect score and show appropriate title
        const resultsTitle = document.getElementById('results-title');
        const isPerfectScore = correctCount === this.questions.length;
        
        if (isPerfectScore) {
            resultsTitle.textContent = 'Perfect Score! 🎉';
            this.showConfetti();
            // Add perfect score glow effect
            document.querySelector('.score-card').classList.add('perfect-score');
        } else {
            resultsTitle.textContent = 'Quiz Complete!';
        }
        
        // Update results display with new card layout
        document.getElementById('card-score-value').textContent = `${correctCount}/${this.questions.length}`;
        document.getElementById('card-accuracy-value').textContent = `${accuracy}%`;
        document.getElementById('correct-count').textContent = correctCount;
        document.getElementById('incorrect-count').textContent = incorrectCount;
        document.getElementById('unanswered-count').textContent = unansweredCount;
        document.getElementById('time-taken').textContent = timeString;
        
        // Update navigation dots with final results
        this.updateFinalNavigationDots();
    }

    showConfetti() {
        const confettiContainer = document.getElementById('confetti-container');
        confettiContainer.innerHTML = ''; // Clear any existing confetti
        
        // Create multiple bursts of confetti
        for (let burst = 0; burst < 3; burst++) {
            setTimeout(() => {
                this.createConfettiBurst(confettiContainer);
            }, burst * 300);
        }
        
        // Remove confetti after animation completes
        setTimeout(() => {
            confettiContainer.innerHTML = '';
        }, 5000);
    }
    
    createConfettiBurst(container) {
        const colors = ['#667eea', '#4caf50', '#ff6b6b', '#feca57', '#48dbfb', '#ff9ff3'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            
            // Random properties
            const color = colors[Math.floor(Math.random() * colors.length)];
            const size = Math.random() * 8 + 4;
            const left = Math.random() * 100;
            const animationDuration = Math.random() * 2 + 3;
            const delay = Math.random() * 0.5;
            
            confetti.style.background = color;
            confetti.style.width = size + 'px';
            confetti.style.height = size + 'px';
            confetti.style.left = left + '%';
            confetti.style.animationDuration = animationDuration + 's';
            confetti.style.animationDelay = delay + 's';
            
            // Random shapes
            if (Math.random() > 0.5) {
                confetti.style.borderRadius = '50%';
            }
            
            container.appendChild(confetti);
        }
    }

    retakeQuiz() {
        // Reset quiz data
        this.selectedAnswers = new Array(this.questions.length).fill(null);
        this.currentQuestionIndex = 0;
        this.startTime = Date.now();
        
        // Show quiz section
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('quiz-section').classList.remove('hidden');
        
        this.displayQuestion();
        this.generateNavigationDots();
    }

    generateNavigationDots() {
        const dotsContainer = document.getElementById('dots-container');
        dotsContainer.innerHTML = '';
        
        for (let i = 0; i < this.questions.length; i++) {
            const dot = document.createElement('div');
            dot.className = 'dot';
            dot.textContent = (i + 1).toString(); // Add question number
            
            if (i === this.currentQuestionIndex) {
                dot.classList.add('active');
            }
            if (this.selectedAnswers[i] !== null) {
                dot.classList.add('completed');
            }
            
            // Add tooltip for better UX
            dot.title = `Question ${i + 1}`;
            
            dot.addEventListener('click', () => {
                this.currentQuestionIndex = i;
                this.displayQuestion();
            });
            
            dotsContainer.appendChild(dot);
        }
    }

    updateNavigationDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active');
            if (index === this.currentQuestionIndex) {
                dot.classList.add('active');
            }
            if (this.selectedAnswers[index] !== null) {
                dot.classList.add('completed');
            } else {
                dot.classList.remove('completed');
            }
        });
    }

    updateFinalNavigationDots() {
        const dots = document.querySelectorAll('.dot');
        dots.forEach((dot, index) => {
            dot.classList.remove('active', 'completed');
            if (this.selectedAnswers[index] !== null) {
                if (this.selectedAnswers[index] === this.correctAnswers[index]) {
                    dot.classList.add('correct');
                } else {
                    dot.classList.add('incorrect');
                }
            }
        });
    }

    backToInput() {
        // Hide all sections
        document.getElementById('quiz-section').classList.add('hidden');
        document.getElementById('results-section').classList.add('hidden');
        document.getElementById('input-section').classList.remove('hidden');
        
        // Clear data
        this.questions = [];
        this.answers = [];
        this.explanations = [];
        this.selectedAnswers = [];
        this.correctAnswers = [];
        this.currentQuestionIndex = 0;
        this.startTime = null;
        this.endTime = null;
    }
}

// Initialize the quiz application when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new QuizApp();
});
