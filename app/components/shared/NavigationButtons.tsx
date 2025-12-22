import { ChevronLeft, ChevronRight } from 'lucide-react';

interface NavigationButtonsProps {
  currentStep: number;
  totalSteps: number;
  onNext: () => void;
  onPrev: () => void;
  onReset: () => void;
}

export default function NavigationButtons({
  currentStep,
  totalSteps,
  onNext,
  onPrev,
  onReset
}: NavigationButtonsProps) {
  return (
    <div className="flex justify-between items-center">
      <button
        onClick={onPrev}
        disabled={currentStep === 1}
        className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
      >
        <ChevronLeft size={20} />
        Previous
      </button>

      <button
        onClick={onReset}
        className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Reset
      </button>

      <button
        onClick={onNext}
        disabled={currentStep === totalSteps}
        className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center gap-2"
      >
        {currentStep === totalSteps ? 'Finish' : 'Next'}
        <ChevronRight size={20} />
      </button>
    </div>
  );
}