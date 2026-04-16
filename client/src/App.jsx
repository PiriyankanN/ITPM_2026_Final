import { Route, Routes, Navigate, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/common/Navbar";
import ProtectedRoute from "./routes/ProtectedRoute";
import FloatingContact from "./components/common/FloatingContact";
import Footer from "./components/common/Footer";

import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import AppHomePage from "./pages/AppHomePage";
import RoomsPage from "./pages/RoomsPage";
import InquiryPage from "./pages/InquiryPage";
import FoodServicesPage from "./pages/FoodServicesPage";
import FoodServiceDetailsPage from "./pages/FoodServiceDetailsPage";
import BusRoutesPage from "./pages/BusRoutesPage";
import BusRouteDetailsPage from "./pages/BusRouteDetailsPage";
import RoomDetailsPage from "./pages/RoomDetailsPage";
import FoodMenuPage from "./pages/user/FoodMenuPage";

import AdminRoute from "./components/admin/AdminRoute";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

import ManageRoomsPage from "./pages/admin/ManageRoomsPage";
import AddRoomPage from "./pages/admin/AddRoomPage";
import EditRoomPage from "./pages/admin/EditRoomPage";

import ManageFoodPage from "./pages/admin/ManageFoodPage";
import AddFoodPage from "./pages/admin/AddFoodPage";
import EditFoodPage from "./pages/admin/EditFoodPage";

import ManageBusRoutesPage from "./pages/admin/ManageBusRoutesPage";
import AddBusRoutePage from "./pages/admin/AddBusRoutePage";
import EditBusRoutePage from "./pages/admin/EditBusRoutePage";

import ManageInquiriesPage from "./pages/admin/ManageInquiriesPage";
import AdminInquiryDetailsPage from "./pages/admin/AdminInquiryDetailsPage";

import MyInquiriesPage from "./pages/user/MyInquiriesPage";
import SubmitInquiryPage from "./pages/user/SubmitInquiryPage";
import ContactPage from "./pages/ContactPage";
import InquiryDetailsPage from "./pages/user/InquiryDetailsPage";
import UserProfilePage from "./pages/user/UserProfilePage";
import EditProfilePage from "./pages/user/EditProfilePage";

function App() {
  return (
    <AuthProvider>
      <Routes>
        {/* User Standard Layout */}
        <Route element={
          <div className="app-shell">
            <Navbar />
            <main className="content">
              <Outlet />
            </main>
          </div>
        }>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          <Route path="/app" element={<ProtectedRoute><AppHomePage /></ProtectedRoute>} />
          <Route path="/rooms" element={<ProtectedRoute><RoomsPage /></ProtectedRoute>} />
          <Route path="/rooms/:id" element={<ProtectedRoute><RoomDetailsPage /></ProtectedRoute>} />
          
          {/* Inquiry Tracking */}
          <Route path="/inquiries/new" element={<ProtectedRoute><SubmitInquiryPage /></ProtectedRoute>} />
          <Route path="/my-inquiries" element={<ProtectedRoute><MyInquiriesPage /></ProtectedRoute>} />
          <Route path="/my-inquiries/:id" element={<ProtectedRoute><InquiryDetailsPage /></ProtectedRoute>} />
          
          {/* User Profile */}
          <Route path="/profile" element={<ProtectedRoute><UserProfilePage /></ProtectedRoute>} />
          <Route path="/profile/edit" element={<ProtectedRoute><EditProfilePage /></ProtectedRoute>} />

          <Route path="/food" element={<ProtectedRoute><FoodServicesPage /></ProtectedRoute>} />
          <Route path="/food/:id" element={<ProtectedRoute><FoodServiceDetailsPage /></ProtectedRoute>} />
          <Route path="/food/:id/menu" element={<ProtectedRoute><FoodMenuPage /></ProtectedRoute>} />
          <Route path="/routes" element={<ProtectedRoute><BusRoutesPage /></ProtectedRoute>} />
          <Route path="/routes/:id" element={<ProtectedRoute><BusRouteDetailsPage /></ProtectedRoute>} />
        </Route>

        {/* Secure Admin Layout */}
        <Route path="/admin" element={<AdminRoute><AdminLayout /></AdminRoute>}>
          <Route index element={<AdminDashboardPage />} />
          
          <Route path="rooms" element={<ManageRoomsPage />} />
          <Route path="rooms/add" element={<AddRoomPage />} />
          <Route path="rooms/edit/:id" element={<EditRoomPage />} />
          
          <Route path="food" element={<ManageFoodPage />} />
          <Route path="food/add" element={<AddFoodPage />} />
          <Route path="food/edit/:id" element={<EditFoodPage />} />
          
          <Route path="routes" element={<ManageBusRoutesPage />} />
          <Route path="routes/add" element={<AddBusRoutePage />} />
          <Route path="routes/edit/:id" element={<EditBusRoutePage />} />
          
          <Route path="inquiries" element={<ManageInquiriesPage />} />
          <Route path="inquiries/:id" element={<AdminInquiryDetailsPage />} />
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <FloatingContact />
      <Footer />
    </AuthProvider>
  );
}

export default App;
