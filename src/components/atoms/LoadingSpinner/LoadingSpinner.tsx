import { cn } from '@src/lib/utils';

const CIRCLE_RADIUS = 20;

export const LoadingSpinner = () => (
  <svg
    width={CIRCLE_RADIUS * 2}
    height={CIRCLE_RADIUS * 2}
    viewBox="0 0 40 40"
    className="animate-spin"
  >
    <defs>
      <linearGradient id="my_gradient" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stopColor="#e01cd5" />
        <stop offset="100%" stopColor="#1CB5E0" />
      </linearGradient>
    </defs>
    <circle
      cx="20"
      cy="20"
      r="18"
      fill="none"
      stroke="url(#my_gradient)"
      strokeWidth="4"
      strokeDasharray="90 30"
      strokeLinecap="round"
    />
  </svg>
);

export const CenteredLoadingSpinner = () => (
  <div
    className={cn(
      'fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform',
    )}
  >
    <LoadingSpinner />
  </div>
);
