import { Check, Cookie, X } from 'lucide-react';
import { Button } from '@src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@src/components/ui/card';
import { cn } from '@src/lib/utils';
import { useCallback, useEffect, useState } from 'react';

interface CookieConsentProps {
  variant?: 'default' | 'small' | 'mini';
  onAcceptCallback?: () => void;
  onDeclineCallback?: () => void;
  className?: string;
  description: string;
  learnMoreHref?: string;
  hideDecline?: boolean;
}

const CookieConsent = ({
  variant = 'default',
  onAcceptCallback,
  onDeclineCallback,
  className,
  description,
  learnMoreHref = '#',
  hideDecline,
}: CookieConsentProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [hide, setHide] = useState(false);

  const handleAccept = useCallback(() => {
    setIsOpen(false);
    document.cookie =
      'cookieConsent=true; expires=Fri, 31 Dec 9999 23:59:59 GMT';
    setTimeout(() => {
      setHide(true);
    }, 700);
    onAcceptCallback?.();
  }, [onAcceptCallback]);

  const handleDecline = useCallback(() => {
    setIsOpen(false);
    setTimeout(() => {
      setHide(true);
    }, 700);
    onDeclineCallback?.();
  }, [onDeclineCallback]);

  useEffect(() => {
    try {
      if (document.cookie.includes('cookieConsent=true')) {
        setIsOpen(false);
        setTimeout(() => {
          setHide(true);
        }, 700);
      } else {
        setIsOpen(true);
      }
    } catch (error) {
      console.warn('Cookie consent error:', error);
    }
  }, []);

  if (hide) return null;

  const containerClasses = cn(
    'fixed z-50 transition-all duration-700',
    !isOpen ? 'translate-y-full opacity-0' : 'translate-y-0 opacity-100',
    className,
  );

  if (variant === 'default') {
    return (
      <div
        className={cn(
          containerClasses,
          'right-0 bottom-0 left-0 w-full sm:bottom-4 sm:left-4 sm:max-w-md',
        )}
      >
        <Card className="m-3 shadow-lg">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-lg">We use cookies</CardTitle>
            <Cookie className="h-5 w-5" />
          </CardHeader>
          <CardContent className="space-y-2">
            <CardDescription className="text-sm">{description}</CardDescription>
            <p className="text-muted-foreground text-xs">
              By clicking{' '}
              <span className="font-medium">&quot;Accept&quot;</span>, you agree
              to our use of cookies.
            </p>
            <a
              href={learnMoreHref}
              className="text-primary text-xs underline underline-offset-4 hover:no-underline"
            >
              Learn more
            </a>
          </CardContent>
          <CardFooter className="flex gap-2 pt-2">
            {!hideDecline && (
              <Button
                onClick={handleDecline}
                variant="secondary"
                className="flex-1"
              >
                Decline
              </Button>
            )}
            <Button onClick={handleAccept} className="flex-1">
              Accept
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (variant === 'small') {
    return (
      <div
        className={cn(
          containerClasses,
          'right-0 bottom-0 left-0 w-full sm:bottom-4 sm:left-4 sm:max-w-md',
        )}
      >
        <Card className="m-3 shadow-lg">
          <CardHeader className="flex h-0 flex-row items-center justify-between space-y-0 px-4 pb-2">
            <CardTitle className="text-base">We use cookies</CardTitle>
            <Cookie className="h-4 w-4" />
          </CardHeader>
          <CardContent className="px-4 pt-0 pb-2">
            <CardDescription className="text-sm">{description}</CardDescription>
          </CardContent>
          <CardFooter className="flex h-0 gap-2 px-4 py-2">
            {!hideDecline && (
              <Button
                onClick={handleDecline}
                variant="secondary"
                size="sm"
                className="flex-1 rounded-full"
              >
                Decline
              </Button>
            )}
            <Button
              onClick={handleAccept}
              size="sm"
              className="flex-1 rounded-full"
            >
              Accept
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  if (variant === 'mini') {
    return (
      <div
        className={cn(
          containerClasses,
          'right-0 bottom-4 left-0 w-full sm:left-4 sm:max-w-3xl',
        )}
      >
        <Card className="mx-3 p-0 py-3 shadow-lg">
          <CardContent className="flex items-center justify-between gap-5 p-0 px-3.5">
            <CardDescription className="flex-1 text-sm">
              {description}
            </CardDescription>
            <div className="flex items-center gap-2 sm:gap-3">
              {!hideDecline && (
                <Button
                  onClick={handleDecline}
                  size="sm"
                  variant="secondary"
                  className="text-xs"
                >
                  <span className="hidden sm:block">Decline</span>
                  <X className="h-3 w-3 sm:hidden" />
                  <span className="sr-only sm:hidden">Decline</span>
                </Button>
              )}
              <Button onClick={handleAccept} size="sm" className="text-xs">
                <span className="hidden sm:block">Accept</span>
                <Check className="h-3 w-3 sm:hidden" />
                <span className="sr-only sm:hidden">Accept</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return null;
};

CookieConsent.displayName = 'CookieConsent';

export { CookieConsent };
