import { Link, LinkProps } from '@mui/material';
import { createLink, LinkComponent } from '@tanstack/react-router';

export const StandardLink = (props: Omit<LinkProps, 'variant'>) => (
  <Link
    {...props}
    target="_blank"
    rel="noopener noreferrer"
    underline="hover"
    sx={{ ...props.sx, '&:hover': { cursor: 'pointer' } }}
  />
);

const CreatedLinkComponent = createLink(StandardLink);

export const StandardRouterLink: LinkComponent<typeof StandardLink> = (
  props,
) => <CreatedLinkComponent {...props} />;
