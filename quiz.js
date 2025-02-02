document.addEventListener("DOMContentLoaded", () => {
    const startScreen = document.getElementById("start-screen");
    const quizBox = document.getElementById("quiz-box");
    const resultBox = document.getElementById("result-box");

    const startBtn = document.getElementById("start-btn");
    const nextBtn = document.getElementById("next-btn");
    const restartBtn = document.getElementById("restart-btn");

    const questionText = document.getElementById("question-text");
    const optionsContainer = document.getElementById("options-container");
    const scoreText = document.getElementById("score-text");

    let questions = [];
    let currentQuestionIndex = 0;
    let score = 0;

    // Fetch quiz data from API
    async function fetchQuizData() {
        const apiUrl = "https://api.jsonserve.com/Uw5CrX";
        const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(apiUrl)}`;

        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            const data = await response.json();
            const quizData = JSON.parse(data.contents); // Convert string to JSON

            console.log("Fetched Quiz Data:", quizData); // Debugging

            if (!quizData || !quizData.questions || !Array.isArray(quizData.questions)) {
                throw new Error("Invalid quiz data format");
            }

            questions = quizData.questions;
            showQuestion();  // Start with the first question
        } catch (error) {
            console.error("Error fetching quiz data:", error);
        }
    }

    // Start Quiz
    startBtn.addEventListener("click", async () => {
        startScreen.classList.add("hidden");
        quizBox.classList.remove("hidden");
        await fetchQuizData();
    });

    // Display Question
    function showQuestion() {
        resetState();
    
        if (currentQuestionIndex >= questions.length) {
            showResults();
            return;
        }
    
        let question = questions[currentQuestionIndex];
        console.log("Current Question Object:", question); // Debugging log
    
        questionText.innerText = question.description || "No question text available";
    
        // Fetching options correctly
        let options = question.answers || question.options || question.choices;
        console.log("Options Data:", options); // Debugging log
    
        if (Array.isArray(options)) {
            options.forEach(option => {
                const button = document.createElement("button");
    
                // Extract correct text from `description` key
                button.innerText = option.description; 
    
                button.classList.add("option-btn");
    
                // Extract 'is_correct' from object
                const isCorrect = option.is_correct || false;
                button.addEventListener("click", () => selectAnswer(button, isCorrect));
    
                optionsContainer.appendChild(button);
            });
        } else {
            console.error("Invalid options format:", options, "in question:", question);
        }
    }
    
    

    // Reset UI
    function resetState() {
        nextBtn.classList.add("hidden");
        optionsContainer.innerHTML = "";
    }

    // Handle Answer Selection
    function selectAnswer(button, isCorrect) {
        if (isCorrect) {
            button.classList.add("correct");
            score++;
        } else {
            button.classList.add("wrong");
        }

        document.querySelectorAll(".option-btn").forEach(btn => btn.disabled = true);
        nextBtn.classList.remove("hidden");
    }

    // Move to Next Question or Show Results
    nextBtn.addEventListener("click", () => {
        currentQuestionIndex++;
        showQuestion();
    });

    // Display Final Score
    function showResults() {
        quizBox.classList.add("hidden");
        resultBox.classList.remove("hidden");
        scoreText.innerText = `You scored ${score} out of ${questions.length}`;
    }

    // Restart Quiz
    restartBtn.addEventListener("click", () => {
        currentQuestionIndex = 0;
        score = 0;
        resultBox.classList.add("hidden");
        quizBox.classList.remove("hidden");
        showQuestion();
    });
});
