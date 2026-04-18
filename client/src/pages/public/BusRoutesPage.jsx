import { useEffect, useState } from "react";
import BusRouteList from "../../components/BusRouteList";
import PageHeader from "../../components/PageHeader";
import StatusMessage from "../../components/StatusMessage";
import { getBusRoutes } from "../../services/busRouteService";

function BusRoutesPage() {
  const [routes, setRoutes] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [error, setError] = useState("");

  const loadRoutes = async (search = searchText) => {
    try {
      const data = await getBusRoutes({ search });
      setRoutes(data);
      setError("");
    } catch (loadError) {
      setError("Unable to load bus routes.");
    }
  };

  useEffect(() => {
    loadRoutes();
  }, []);

  const handleSearchChange = (event) => {
    const value = event.target.value;
    setSearchText(value);
    loadRoutes(value);
  };

  return (
    <div>
      <PageHeader
        title="Bus Route & Transport Information"
        description="Search for bus routes and nearby stops."
      />

      <StatusMessage message={error} type="error" />

      <div className="list-card">
        <h3>Bus Routes</h3>

        <div className="form-group">
          <label htmlFor="routeSearch">Search Route or Stop</label>
          <input
            id="routeSearch"
            value={searchText}
            onChange={handleSearchChange}
            placeholder="Search by route name, stop, or landmark"
          />
        </div>

        <BusRouteList routes={routes} />
      </div>
    </div>
  );
}

export default BusRoutesPage;
