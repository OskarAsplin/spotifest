import { Link, LinkProps } from '@mui/material';

const StandardLink = (props: LinkProps) => (
  <Link
    {...props}
    target={'_blank'}
    rel="noopener noreferrer"
    underline="hover"
  />
);

export default StandardLink;
