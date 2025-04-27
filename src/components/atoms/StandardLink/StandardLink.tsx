import { Link, LinkProps } from '@mui/material';
import { forwardRef } from 'react';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  ToPathOption,
} from '@tanstack/react-router';

const LinkBehavior = forwardRef<any, RouterLinkProps>((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

export interface StandardLinkProps extends LinkProps {
  to?: ToPathOption;
}

const StandardLink = ({ to, ...restProps }: StandardLinkProps) =>
  to ? (
    <Link {...restProps} underline="hover" to={to} component={LinkBehavior} />
  ) : (
    <Link
      {...restProps}
      target="_blank"
      rel="noopener noreferrer"
      underline="hover"
      sx={{ ...restProps.sx, '&:hover': { cursor: 'pointer' } }}
    />
  );

export default StandardLink;
