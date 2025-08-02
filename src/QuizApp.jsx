import React, { useState, useEffect } from "react";

const QuizApp = () => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [quizOver, setQuizOver] = useState(false);
  const [username, setUsername] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    fetch("https://opentdb.com/api.php?amount=5&category=9&type=multiple")
      .then((res) => res.json())
      .then((data) => {
        const formatted = data.results.map((q) => {
          const answers = [...q.incorrect_answers];
          const rand = Math.floor(Math.random() * 4);
          answers.splice(rand, 0, q.correct_answer);
          return {
            question: q.question,
            correct: q.correct_answer,
            answers,
          };
        });
        setQuestions(formatted);
      });
  }, []);

  const handleSubmit = () => {
    if (selectedAnswer === questions[currentQuestion].correct) {
      setScore(score + 1);
    }
    setIsSubmitted(true);
    setTimeout(() => {
      if (currentQuestion + 1 < questions.length) {
        setCurrentQuestion(currentQuestion + 1);
        setSelectedAnswer(null);
        setIsSubmitted(false);
      } else {
        setQuizOver(true);
      }
    }, 1200);
  };

  if (!questions.length) return <div className="p-4 text-center text-white">Loading...</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center p-4">
      <div className="w-full max-w-xl bg-white rounded-2xl shadow-xl p-6">
        <h1 className="text-3xl font-extrabold text-center text-purple-700 mb-4">🎓 Trivia Quiz App</h1>
        {!quizOver ? (
          <div className="mb-4">
            <h2 className="text-xl font-semibold mb-2">
              Question {currentQuestion + 1} of {questions.length}
            </h2>
            <p
              className="mb-4 text-gray-800"
              dangerouslySetInnerHTML={{
                __html: questions[currentQuestion].question,
              }}
            />
            <div className="grid gap-3 mb-4">
              {questions[currentQuestion].answers.map((ans, i) => {
                let className = "w-full py-2 px-4 rounded-lg border text-left font-medium transition-all duration-300 ";

                if (isSubmitted) {
                  if (ans === questions[currentQuestion].correct) {
                    className += "bg-green-100 border-green-600 text-green-700";
                  } else if (ans === selectedAnswer) {
                    className += "bg-red-100 border-red-600 text-red-700";
                  } else {
                    className += "border-gray-300";
                  }
                } else {
                  className += selectedAnswer === ans
                    ? "bg-purple-100 border-purple-600 text-purple-700"
                    : "hover:bg-purple-50 border-purple-300";
                }

                return (
                  <button
                    key={i}
                    disabled={isSubmitted}
                    className={className}
                    onClick={() => setSelectedAnswer(ans)}
                    dangerouslySetInnerHTML={{ __html: ans }}
                  />
                );
              })}
            </div>
            <button
              disabled={!selectedAnswer || isSubmitted}
              onClick={handleSubmit}
              className="w-full bg-purple-600 text-white py-2 rounded-md font-semibold hover:bg-purple-700 disabled:opacity-50"
            >
              Submit Answer
            </button>
          </div>
        ) : (
          <div className="text-center">
            <h2 className="text-2xl font-bold text-purple-800 mb-3">🎉 Quiz Completed!</h2>
            <p className="text-lg mb-1">Well done{username && `, ${username}`}!</p>
            <p className="text-md">Your Score: {score} / {questions.length}</p>
          </div>
        )}

        {!quizOver && (
          <div className="mt-6">
            <label className="block text-sm text-gray-700 mb-1">Enter your name:</label>
            <input
              type="text"
              className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
              placeholder="John Doe"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default QuizApp;