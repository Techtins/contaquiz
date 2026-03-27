'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/atoms/card';
import { Button } from '@/components/ui/atoms/button';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionNavigatorProps {
  totalQuestions: number;
  currentQuestionIndex: number;
  answeredQuestions: Record<string, boolean>;
  onSelectQuestion: (index: number) => void;
}

export function QuestionNavigator({
  totalQuestions,
  currentQuestionIndex,
  answeredQuestions,
  onSelectQuestion,
}: QuestionNavigatorProps) {
  const answeredCount = Object.values(answeredQuestions).filter(Boolean).length;
  const notAnsweredCount = totalQuestions - answeredCount;

  return (
    <Card className="h-fit sticky top-4">
      <CardHeader className="border-b bg-gray-50">
        <CardTitle className="text-base">Painel de Navegação</CardTitle>
        <p className="text-sm text-gray-600 font-normal mt-2">
          <span className="text-green-600 font-semibold">{answeredCount}</span> respondidas •{' '}
          <span className="text-orange-600 font-semibold">{notAnsweredCount}</span> faltando
        </p>
      </CardHeader>

      <CardContent className="pt-4">
        <div className="grid grid-cols-5 gap-2 mb-6">
          {Array.from({ length: totalQuestions }).map((_, index) => {
            const isAnswered = answeredQuestions[index];
            const isCurrent = index === currentQuestionIndex;

            return (
              <button
                key={index}
                onClick={() => onSelectQuestion(index)}
                className={cn(
                  'w-full aspect-square flex items-center justify-center rounded font-semibold text-sm transition-all',
                  isCurrent
                    ? 'bg-blue-500 text-white ring-2 ring-blue-300'
                    : isAnswered
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                )}
              >
                {index + 1}
              </button>
            );
          })}
        </div>

        <div className="border-t pt-4 space-y-2 mb-6">
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-blue-500" />
            <span className="text-gray-700">Atual</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-green-100 border border-green-300" />
            <span className="text-gray-700">Respondida</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <div className="w-3 h-3 rounded bg-gray-100 border border-gray-300" />
            <span className="text-gray-700">Não respondida</span>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectQuestion(Math.max(0, currentQuestionIndex - 1))}
            disabled={currentQuestionIndex === 0}
            className="flex-1 gap-1"
          >
            <ChevronUp className="h-4 w-4" />
            Ant.
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onSelectQuestion(Math.min(totalQuestions - 1, currentQuestionIndex + 1))}
            disabled={currentQuestionIndex === totalQuestions - 1}
            className="flex-1 gap-1"
          >
            Prox.
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
