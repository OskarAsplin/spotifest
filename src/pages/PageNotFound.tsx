const imgStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  maxWidth: '1000px',
  maxHeight: '100vh',
};

const divStyle: React.CSSProperties = {
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
};

const PageNotFound = () => (
  <div style={divStyle}>
    <img src="page_not_found.svg" alt="" style={imgStyle} />
  </div>
);

export default PageNotFound;
