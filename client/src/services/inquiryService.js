import api from "./api";

export const getInquiries = async () => {
  const response = await api.get("/inquiries/my");
  return response.data;
};

export const createInquiry = async (inquiryData) => {
  const response = await api.post("/inquiries", inquiryData);
  return response.data;
};

export const updateInquiryStatus = async (id, statusData) => {
  const response = await api.put(`/inquiries/${id}/status`, statusData);
  return response.data;
};
