import { Tooltip, tooltipClasses, TooltipProps } from '@mui/material';
import { styled } from '@mui/material/styles';

export const HtmlTooltip = ({ children, ...props }: TooltipProps) => (
  <StyledTooltip {...props}>
    <span>{children}</span>
  </StyledTooltip>
);

export const StyledTooltip = styled(({ className, ...props }: TooltipProps) => (
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
