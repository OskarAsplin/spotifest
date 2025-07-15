import { Fragment } from 'react';

interface MatchHighlighterProps {
  text: string;
  regex?: RegExp;
}

/**
 * Wraps all regex matches in <mark>.
 * Make sure to capture all groups in () and use 'g' search.
 * Regex example: /(test)/g
 */
export const MatchHighlighter = ({ text, regex }: MatchHighlighterProps) => {
  if (!regex) return <>{text}</>;
  return (
    <>
      {text.split(regex).map((substring, index) =>
        regex.test(substring) ? (
          <mark key={index} className="bg-inherit text-blue-500">
            {substring}
          </mark>
        ) : (
          <Fragment key={index}>{substring}</Fragment>
        ),
      )}
    </>
  );
};
