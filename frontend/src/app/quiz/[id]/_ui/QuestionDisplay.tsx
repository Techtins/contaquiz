'use client';

import { Question } from '@/lib/interface/IQuestao';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/atoms/card';
import { Badge } from '@/components/ui/atoms/badge';
import { Button } from '@/components/ui/atoms/button';
import { CheckCircle, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface QuestionDisplayProps {
  question: Question;
  questionNumber: number;
  totalQuestions: number;
  selectedOptionIndex?: number;
  onSelectOption: (index: number) => void;
  onClearAnswer?: () => void;
}

export function QuestionDisplay({
  question,
  questionNumber,
  totalQuestions,
  selectedOptionIndex,
  onSelectOption,
  onClearAnswer,
}: QuestionDisplayProps) {
  const isAnswered = selectedOptionIndex !== undefined;

  const getDifficultyColor = () => {
    switch (question.difficulty) {
      case 'FACIL':
        return 'bg-green-100 text-green-800';
      case 'MEDIO':
        return 'bg-yellow-100 text-yellow-800';
      case 'DIFICIL':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyLabel = () => {
    switch (question.difficulty) {
      case 'FACIL':
        return 'Fácil';
      case 'MEDIO':
        return 'Médio';
      case 'DIFICIL':
        return 'Difícil';
      default:
        return question.difficulty;
    }
  };

  return (
    <div className="w-full space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-600">
            Questão {questionNumber} de {totalQuestions}
          </p>
          <div className="h-1 w-32 bg-gray-200 rounded-full mt-1">
            <div
              className="h-full bg-blue-500 rounded-full transition-all"
              style={{ width: `${(questionNumber / totalQuestions) * 100}%` }}
            />
          </div>
        </div>
        <Badge variant="outline" className={getDifficultyColor()}>
          {getDifficultyLabel()}
        </Badge>
      </div>

      <Card>
        <CardHeader className="bg-gray-50 border-b">
          <CardTitle className="text-lg">{question.statement}</CardTitle>
        </CardHeader>

        <CardContent className="pt-6 space-y-3">
          {question.options.map((option, index) => {
            const isSelected = selectedOptionIndex === index;

            return (
              <button
                key={index}
                onClick={() => onSelectOption(index)}
                className={cn(
                  'w-full flex items-start gap-4 p-4 rounded-lg border-2 transition-all text-left',
                  isSelected
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                )}
              >
                <div className="mt-1 flex-shrink-0">
                  {isSelected ? (
                    <CheckCircle className="h-5 w-5 text-blue-500" />
                  ) : (
                    <Circle className="h-5 w-5 text-gray-300" />
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-baseline gap-2">
                    <span className="font-semibold text-gray-700">
                      {String.fromCharCode(65 + index)})
                    </span>
                    <span className={cn('text-gray-700 break-words', isSelected && 'font-medium')}>
                      {option.text}
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </CardContent>
      </Card>

      {isAnswered && onClearAnswer && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClearAnswer}
          className="text-gray-600"
        >
          Limpar resposta
        </Button>
      )}

      <div className="flex items-center justify-center gap-2 text-sm">
        {isAnswered ? (
          <>
            <CheckCircle className="h-4 w-4 text-green-600" />
            <span className="text-green-700 font-medium">Respondida</span>
          </>
        ) : (
          <>
            <Circle className="h-4 w-4 text-gray-400" />
            <span className="text-gray-600">Clique para responder</span>
          </>
        )}
      </div>
    </div>
  );
}
