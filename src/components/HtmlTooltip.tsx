import { Tooltip } from '@mui/material';
import { TooltipProps, tooltipClasses } from '@mui/material';
import { styled } from '@mui/material/styles';
import { forwardRef } from 'react';

const HtmlTooltip = forwardRef<HTMLDivElement, TooltipProps>(
  ({ children, ...props }, ref) => (
    <StyledTooltip ref={ref} {...props}>
      <span>{children}</span>
    </StyledTooltip>
  )
);

const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))(({ theme: { typography } }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 320,
    fontSize: typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

export default HtmlTooltip;
