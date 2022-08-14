import { Fragment } from 'react';
import { styled } from '@mui/material/styles';

interface MatchHighlighterProps {
  text: string;
  regex?: RegExp;
}

/**
 * Wraps all regex matches in <mark>.
 * Make sure to capture all groups in () and use 'g' search.
 * Regex example: /(test)/g
 */
const MatchHighlighter = ({ text, regex }: MatchHighlighterProps) => {
  if (!regex) return <>{text}</>;
  return (
    <>
      {text
        .split(regex)
        .map((substring, index) =>
          regex.test(substring) ? (
            <StyledMark key={index}>{substring}</StyledMark>
          ) : (
            <Fragment key={index}>{substring}</Fragment>
          )
        )}
    </>
  );
};

/** Escapes all special regexp characters with \ in front */
export const escapeRegExp = (str: string) =>
  str.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');

const StyledMark = styled('mark')(({ theme: { palette } }) => ({
  color: palette.primary.main,
  backgroundColor: 'inherit',
}));

export default MatchHighlighter;
