'use client';

import { Clock, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
}

export function Timer({ timeLeft, totalTime }: TimerProps) {
  const percentageLeft = (timeLeft / totalTime) * 100;
  const isLowTime = timeLeft <= 60;
  const isVeryLowTime = timeLeft <= 10;

  const hours = Math.floor(timeLeft / 3600);
  const minutes = Math.floor((timeLeft % 3600) / 60);
  const seconds = timeLeft % 60;
  const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  return (
    <div className="flex flex-col gap-3 p-4 bg-white rounded-lg border">
      <div className="flex items-center gap-3">
        {isVeryLowTime ? (
          <AlertCircle className="h-6 w-6 text-red-500 animate-pulse" />
        ) : (
          <Clock className="h-6 w-6 text-gray-600" />
        )}
        <div>
          <p className="text-xs text-gray-600 font-semibold">TEMPO RESTANTE</p>
          <p className={cn(
            'text-2xl font-bold',
            isVeryLowTime ? 'text-red-600' : isLowTime ? 'text-yellow-600' : 'text-blue-600'
          )}>
            {formattedTime}
          </p>
        </div>
      </div>

      <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={cn(
            'h-full transition-all duration-300',
            isVeryLowTime ? 'bg-red-500' : isLowTime ? 'bg-yellow-400' : 'bg-blue-500'
          )}
          style={{ width: `${percentageLeft}%` }}
        />
      </div>
    </div>
  );
}
