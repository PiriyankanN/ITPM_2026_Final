function FoodServiceList({ services, onEdit, onDelete }) {
  if (services.length === 0) {
    return <p className="empty-state">No food services found.</p>;
  }

  return (
    <div className="stack">
      {services.map((service) => (
        <div key={service._id} className="list-item">
          <h3>{service.name}</h3>
          <p>{service.location}</p>

          <div className="tag-row">
            <span className="tag">{service.mealType}</span>
            <span className="tag">{service.priceRange}</span>
            <span className="tag">{service.contactNumber}</span>
          </div>

          <div className="button-row">
            {onEdit && (
              <button className="secondary-button" onClick={() => onEdit(service)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="danger-button" onClick={() => onDelete(service._id)}>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default FoodServiceList;
