import { forwardRef } from 'react';
import { Link, LinkProps } from '@mui/material';
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  To,
} from 'react-router-dom';

const LinkBehavior = forwardRef<any, RouterLinkProps>((props, ref) => (
  <RouterLink ref={ref} {...props} />
));

interface StandardLinkProps extends LinkProps {
  to?: To;
}

const StandardLink = ({ to, ...restProps }: StandardLinkProps) =>
  to ? (
    <Link {...restProps} underline="hover" to={to} component={LinkBehavior} />
  ) : (
    <Link
      {...restProps}
      target={'_blank'}
      rel="noopener noreferrer"
      underline="hover"
    />
  );

export default StandardLink;
