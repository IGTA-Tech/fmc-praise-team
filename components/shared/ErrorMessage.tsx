'use client';

// Error Message Component

import { AlertCircle, XCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
  className?: string;
}

export function ErrorMessage({ message, onRetry, className }: ErrorMessageProps) {
  return (
    <div className={cn('bg-red-50 border border-red-200 rounded-lg p-4', className)}>
      <div className="flex items-start gap-3">
        <XCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-red-800 text-sm">{message}</p>
          {onRetry && (
            <button
              onClick={onRetry}
              className="mt-2 text-sm text-red-600 hover:text-red-700 font-medium underline"
            >
              Try again
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
