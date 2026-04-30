'use client';

import { useEffect, useMemo, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams, useRouter } from 'next/navigation';
import { getQuizResult, toggleQuestionFavorite } from '@/services/modules/quiz.service';
import { Button } from '@/components/ui/atoms/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/atoms/card';
import { Loader2, AlertCircle, CheckCircle2, XCircle, ArrowLeft, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/useToast';

const formatDuration = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];

  if (hours > 0) parts.push(`${hours}h`);
  if (minutes > 0 || hours > 0) parts.push(`${minutes}min`);
  parts.push(`${seconds}s`);

  return parts.join(' ');
};

export default function ResultPage() {
  const router = useRouter();
  const { toast } = useToast();
  const params = useParams<{ id: string; resultId: string }>();
  const quizId = Array.isArray(params.id) ? params.id[0] : params.id;
  const resultId = Array.isArray(params.resultId) ? params.resultId[0] : params.resultId;
  const [favoriteQuestionIds, setFavoriteQuestionIds] = useState<string[]>([]);
  const [updatingFavoriteId, setUpdatingFavoriteId] = useState<string | null>(null);

  const { data: result, isLoading, error } = useQuery({
    queryKey: ['quizResult', resultId],
    queryFn: () => getQuizResult(resultId),
    enabled: !!resultId,
  });

  useEffect(() => {
    if (!result?.corrections) return;
    setFavoriteQuestionIds(
      result.corrections
        .filter((correction: any) => correction.isFavorite)
        .map((correction: any) => correction.questionId),
    );
  }, [result]);

  const favoriteSet = useMemo(() => new Set(favoriteQuestionIds), [favoriteQuestionIds]);

  const handleToggleFavorite = async (questionId: string) => {
    try {
      setUpdatingFavoriteId(questionId);
      const response = await toggleQuestionFavorite(questionId);
      setFavoriteQuestionIds((current) => {
        const next = new Set(current);
        if (response.favorited) {
          next.add(questionId);
        } else {
          next.delete(questionId);
        }
        return Array.from(next);
      });

      toast({
        title: response.favorited ? 'Questão favoritada' : 'Questão removida dos favoritos',
        description: 'Ela ficará disponível para revisão futura.',
      });
    } catch {
      toast({
        title: 'Erro ao atualizar favorito',
        description: 'Não foi possível alterar o favorito agora.',
        variant: 'destructive',
      });
    } finally {
      setUpdatingFavoriteId(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin mx-auto text-blue-500 mb-4" />
          <p className="text-gray-600">Carregando resultado...</p>
        </div>
      </div>
    );
  }

  if (error || !result) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <AlertCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              <div>
                <h2 className="font-semibold text-red-700">Erro</h2>
                <p className="text-sm text-gray-600 mt-1">Não conseguimos carregar o resultado.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const percentage = result.percentage;
  const isPassed = percentage >= result.passingScore;

  const getColor = () => {
    if (percentage >= 90) return { bg: 'bg-green-50', border: 'border-green-200', text: 'text-green-700' };
    if (percentage >= 70) return { bg: 'bg-blue-50', border: 'border-blue-200', text: 'text-blue-700' };
    return { bg: 'bg-red-50', border: 'border-red-200', text: 'text-red-700' };
  };

  const color = getColor();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold">Resultado</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Score */}
        <Card className={cn('mb-8 border-2', color.bg, color.border)}>
          <CardContent className="pt-8">
            <div className="text-center">
              <div className={cn('text-6xl font-bold mb-4', color.text)}>
                {Math.round(percentage)}%
              </div>
              <p className={cn('text-lg font-semibold', color.text)}>
                {isPassed ? '✅ Parabéns!' : '❌ Tente novamente'}
              </p>
              <p className="text-sm text-gray-600 mt-2">
                {result.correctAnswers} corretas de {result.totalQuestions} questões
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-green-600">{result.correctAnswers}</div>
              <p className="text-xs text-gray-600 mt-1">Corretas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-3xl font-bold text-red-600">{result.wrongAnswers}</div>
              <p className="text-xs text-gray-600 mt-1">Erradas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6 text-center">
              <div className="text-sm font-semibold">{formatDuration(result.timeSpentInSeconds)}</div>
              <p className="text-xs text-gray-600 mt-1">Tempo</p>
            </CardContent>
          </Card>
        </div>

        {/* Gabarito */}
        <h2 className="text-xl font-bold mb-4">Gabarito Comentado</h2>
        <div className="space-y-4">
          {result.corrections?.map((correction: any, idx: number) => (
            <Card key={idx} className={correction.isCorrect ? 'border-green-200' : 'border-red-200'}>
              <CardHeader className={correction.isCorrect ? 'bg-green-50' : 'bg-red-50'}>
                <div className="flex items-start gap-3">
                  {correction.isCorrect ? (
                    <CheckCircle2 className="h-5 w-5 text-green-600 flex-shrink-0 mt-1" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 flex-shrink-0 mt-1" />
                  )}
                  <div>
                    <CardTitle className="text-base">Questão {idx + 1}</CardTitle>
                    <CardDescription className="mt-1">
                      {correction.isCorrect ? '✓ Resposta correta' : '✗ Resposta incorreta'}
                    </CardDescription>
                    {correction.question?.statement && (
                      <p className="mt-2 max-w-3xl text-sm text-gray-700">
                        {correction.question.statement}
                      </p>
                    )}
                  </div>
                  {correction.questionId && (
                    <Button
                      type="button"
                      variant={favoriteSet.has(correction.questionId) ? 'default' : 'outline'}
                      className="ml-auto gap-2"
                      onClick={() => handleToggleFavorite(correction.questionId)}
                      disabled={updatingFavoriteId === correction.questionId}
                    >
                      <Star className={cn('h-4 w-4', favoriteSet.has(correction.questionId) && 'fill-current')} />
                      {favoriteSet.has(correction.questionId) ? 'Favoritada' : 'Favoritar'}
                    </Button>
                  )}
                </div>
              </CardHeader>

              <CardContent className="pt-6 space-y-3">
                {correction.question?.difficulty && (
                  <div className="flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="rounded-full bg-gray-100 px-2 py-1">Dificuldade: {correction.question.difficulty}</span>
                    {correction.question.disciplineName && (
                      <span className="rounded-full bg-gray-100 px-2 py-1">Disciplina: {correction.question.disciplineName}</span>
                    )}
                  </div>
                )}

                {correction.userAnswer !== null ? (
                  <div>
                    <p className="text-sm font-semibold text-gray-700 mb-1">Sua resposta:</p>
                    <p className="text-sm text-gray-600">
                      {String.fromCharCode(65 + correction.userAnswer)}) (Opção {correction.userAnswer + 1})
                    </p>
                  </div>
                ) : (
                  <p className="text-sm text-gray-500">Não respondido</p>
                )}

                {!correction.isCorrect && (
                  <div>
                    <p className="text-sm font-semibold text-green-700 mb-1">Resposta correta:</p>
                    <p className="text-sm text-gray-600">
                      {String.fromCharCode(65 + correction.correctAnswer)}) (Opção {correction.correctAnswer + 1})
                    </p>
                  </div>
                )}

                {correction.explanation && (
                  <div className="bg-blue-50 p-3 rounded border border-blue-200">
                    <p className="text-sm font-semibold text-blue-900 mb-1">📚 Explicação:</p>
                    <p className="text-sm text-blue-800">{correction.explanation}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex gap-4 justify-center">
          <Button variant="outline" onClick={() => router.push('/aluno/quizzes')}>
            ← Voltar
          </Button>
          <Button onClick={() => router.push(`/quiz/${quizId}`)}>
            Refazer Quiz
          </Button>
        </div>
      </div>
    </div>
  );
}
