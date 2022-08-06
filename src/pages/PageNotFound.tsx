const imgStyle = {
  height: '100%',
  width: '100%',
  maxWidth: '1000px',
  maxHeight: '100vh',
} as React.CSSProperties;

const divStyle = {
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
} as React.CSSProperties;

const PageNotFound = () => {
  return (
    <div style={divStyle}>
      <img src={'page_not_found.svg'} alt={''} style={imgStyle} />
    </div>
  );
};

export default PageNotFound;
