'use client';

import { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { useQuiz } from '@/hooks/useQuiz';
import { getQuizById, submitQuiz } from '@/services/modules/quiz.service';
import { useToast } from '@/hooks/useToast';
import { Timer } from './_ui/Timer';
import { QuestionDisplay } from './_ui/QuestionDisplay';
import { QuestionNavigator } from './_ui/QuestionNavigator';
import { Button } from '@/components/ui/atoms/button';
import { Card, CardContent } from '@/components/ui/atoms/card';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/atoms/alertDialog';
import { Loader2, AlertCircle, ChevronLeft, Check } from 'lucide-react';

export default function QuizPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams<{ id: string }>();
  const quizId = Array.isArray(params.id) ? params.id[0] : params.id;
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { data: quiz, isLoading, error } = useQuery({
    queryKey: ['quiz', quizId],
    queryFn: () => getQuizById(quizId),
    enabled: !!quizId,
  });

  const quizState = useQuiz(quiz?.questions || [], quiz?.timeLimit || 1800);

  // Auto-submit quando tempo acaba
  useEffect(() => {
    if (quizState.isTimeUp && !quizState.isSubmitted) {
      handleSubmitQuiz();
    }
  }, [quizState.isTimeUp, quizState.isSubmitted]);

  // Mapa de questões respondidas
  const answeredQuestionsMap: Record<string, boolean> = {};
  quiz?.questions?.forEach((q: any, idx: number) => {
    answeredQuestionsMap[idx] = quizState.answers[q._id] !== undefined;
  });

  const handleSubmitQuiz = async () => {
    try {
      setIsSubmitting(true);
      const timeSpentInSeconds = Math.max(0, (quiz?.timeLimit || 1800) - quizState.timeLeft);

      const result = await submitQuiz(quizId, quizState.answers, timeSpentInSeconds);

      toast({
        title: 'Quiz submetido!',
        description: `Você acertou ${result.correctAnswers} de ${result.totalQuestions} questões`,
      });

      quizState.setIsSubmitted(true);
      router.push(`/quiz/${quizId}/resultado/${result._id}`);
    } catch (err) {
      toast({
        title: 'Erro ao submeter',
        description: 'Tente novamente mais tarde',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    if (Object.keys(quizState.answers).length > 0) {
      if (confirm('Tem certeza? Você perderá todas as respostas.')) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">Carregando quiz...</p>
        </div>
      </div>
    );
  }

  if (error || !quiz) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-red-700">Erro ao carregar quiz</h2>
                <p className="text-sm text-gray-600 mt-1">Não conseguimos carregar este quiz.</p>
                <Button onClick={() => router.back()} className="mt-4" variant="outline" size="sm">
                  Voltar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBack}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-lg font-bold">{quiz.title}</h1>
              <p className="text-xs text-gray-600">{quizState.answeredCount} de {quizState.totalQuestions} respondidas</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="w-64">
              <Timer timeLeft={quizState.timeLeft} totalTime={quiz.timeLimit} />
            </div>
            <Button
              onClick={() => setShowSubmitDialog(true)}
              disabled={isSubmitting}
              className="gap-2"
            >
              <Check className="h-4 w-4" />
              Finalizar
            </Button>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-3">
            {quizState.currentQuestion && (
              <QuestionDisplay
                question={quizState.currentQuestion}
                questionNumber={quizState.currentQuestionIndex + 1}
                totalQuestions={quizState.totalQuestions}
                selectedOptionIndex={quizState.currentAnswer}
                onSelectOption={(idx) => quizState.selectAnswer(idx)}
                onClearAnswer={() => quizState.clearAnswer()}
              />
            )}

            {/* navigation buttons removed here to avoid duplication; use QuestionNavigator on the right */}
          </div>

          <div className="lg:col-span-1">
            <QuestionNavigator
              totalQuestions={quizState.totalQuestions}
              currentQuestionIndex={quizState.currentQuestionIndex}
              answeredQuestions={answeredQuestionsMap}
              onSelectQuestion={quizState.goToQuestion}
            />
          </div>
        </div>
      </div>

      {/* Dialog */}
      <AlertDialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Finalizar Quiz?</AlertDialogTitle>
            <AlertDialogDescription>
              Você respondeu <strong>{quizState.answeredCount} de {quizState.totalQuestions}</strong> questões.
              {quizState.answeredCount < quizState.totalQuestions && (
                <span className="block mt-2 text-orange-600">
                  ⚠️ {quizState.totalQuestions - quizState.answeredCount} questões sem resposta.
                </span>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="flex gap-3">
            <AlertDialogCancel>Continuar</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleSubmitQuiz}
              disabled={isSubmitting}
            >
              {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Enviando...</> : 'Finalizar'}
            </AlertDialogAction>
          </div>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
