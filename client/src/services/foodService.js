import api from "./api";

export const getFoodServices = async (filters = {}) => {
  const response = await api.get("/food", { params: filters });
  return response.data;
};

export const createFoodService = async (foodData) => {
  const response = await api.post("/food", foodData);
  return response.data;
};

export const updateFoodService = async (id, foodData) => {
  const response = await api.put(`/food/${id}`, foodData);
  return response.data;
};

export const deleteFoodService = async (id) => {
  const response = await api.delete(`/food/${id}`);
  return response.data;
};
