function BusRouteList({ routes, onEdit, onDelete }) {
  if (routes.length === 0) {
    return <p className="empty-state">No bus routes found.</p>;
  }

  return (
    <div className="stack">
      {routes.map((route) => (
        <div key={route._id} className="list-item">
          <h3>{route.routeName}</h3>
          <p>
            {route.startLocation} to {route.endLocation}
          </p>

          <div className="tag-row">
            {route.mainStops.map((stop) => (
              <span key={stop} className="tag">
                {stop}
              </span>
            ))}
          </div>

          <p>Nearby landmark: {route.nearbyLandmark}</p>

          <div className="button-row">
            {onEdit && (
              <button className="secondary-button" onClick={() => onEdit(route)}>
                Edit
              </button>
            )}
            {onDelete && (
              <button className="danger-button" onClick={() => onDelete(route._id)}>
                Delete
              </button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

export default BusRouteList;
