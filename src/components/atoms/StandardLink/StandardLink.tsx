import { Link, LinkProps } from '@mui/material';
import { forwardRef } from 'react';
import {
  Link as RouterLink,
  LinkPropsOptions as RouterLinkProps,
  ToOptions,
} from '@tanstack/react-router';

const LinkBehavior = forwardRef<any, RouterLinkProps>((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

export interface StandardLinkProps extends LinkProps {
  to?: ToOptions;
}

const StandardLink = ({ to, ...restProps }: StandardLinkProps) =>
  to ? (
    <Link
      {...restProps}
      underline="hover"
      to={to}
      component={(props) => <LinkBehavior {...props} />}
    />
  ) : (
    <Link
      {...restProps}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
    />
  );

export default StandardLink;
