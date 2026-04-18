function PageHeader({ title, description }) {
  return (
    <div className="page-header">
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

export default PageHeader;
