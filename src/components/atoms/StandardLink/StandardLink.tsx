import { createLink, LinkComponent } from '@tanstack/react-router';
import { cn } from '@src/lib/utils';

interface StandardLinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  href?: string;
}

export const StandardLink = ({
  className,
  href,
  children,
  ...props
}: StandardLinkProps) => (
  <a
    {...props}
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className={cn(
      'cursor-pointer text-blue-400 underline-offset-4 hover:underline',
      className,
    )}
  >
    {children}
  </a>
);

const CreatedLinkComponent = createLink(StandardLink);

export const StandardRouterLink: LinkComponent<typeof StandardLink> = (
  props,
) => <CreatedLinkComponent {...props} />;
