import api from "./api";

export const getBusRoutes = async (filters = {}) => {
  const response = await api.get("/routes", { params: filters });
  return response.data;
};

export const createBusRoute = async (routeData) => {
  const response = await api.post("/routes", routeData);
  return response.data;
};

export const updateBusRoute = async (id, routeData) => {
  const response = await api.put(`/routes/${id}`, routeData);
  return response.data;
};

export const deleteBusRoute = async (id) => {
  const response = await api.delete(`/routes/${id}`);
  return response.data;
};
