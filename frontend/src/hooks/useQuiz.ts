'use client';

import { useState, useEffect, useCallback } from 'react';
import { Question } from '@/lib/interface/IQuestao';

export function useQuiz(questions: Question[], totalTimeInSeconds: number) {
  const [timeLeft, setTimeLeft] = useState(totalTimeInSeconds);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isTimeUp, setIsTimeUp] = useState(false);

  // Timer regressivo
  useEffect(() => {
    if (isTimeUp || isSubmitted || !questions.length) return;

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => {
        const newTime = prevTime - 1;
        if (newTime <= 0) {
          setIsTimeUp(true);
          return 0;
        }
        return newTime;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isTimeUp, isSubmitted, questions.length]);

  // Navegar
  const goToNextQuestion = useCallback(() => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  }, [currentQuestionIndex, questions.length]);

  const goToPreviousQuestion = useCallback(() => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  }, [currentQuestionIndex]);

  const goToQuestion = useCallback((index: number) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index);
    }
  }, [questions.length]);

  // Responder
  const selectAnswer = useCallback((optionIndex: number) => {
    const questionId = questions[currentQuestionIndex]._id;
    setAnswers((prev) => ({
      ...prev,
      [questionId]: optionIndex,
    }));
  }, [currentQuestionIndex, questions]);

  const clearAnswer = useCallback(() => {
    const questionId = questions[currentQuestionIndex]._id;
    setAnswers((prev) => {
      const newAnswers = { ...prev };
      delete newAnswers[questionId];
      return newAnswers;
    });
  }, [currentQuestionIndex, questions]);

  // Info
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentQuestionIndex];
  const currentAnswer = answers[currentQuestion?._id];

  return {
    timeLeft,
    currentQuestionIndex,
    answers,
    isSubmitted,
    isTimeUp,
    setIsSubmitted,
    answeredCount,
    totalQuestions: questions.length,
    currentQuestion,
    currentAnswer,

    goToNextQuestion,
    goToPreviousQuestion,
    goToQuestion,
    selectAnswer,
    clearAnswer,
  };
}
