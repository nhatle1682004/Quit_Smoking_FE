import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import Header from "./components/header";
import Footer from "./components/footer";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import Dashboard from "./components/dashboard";
import Notifications from "./pages/dashboard-admin/notifications/index";
import BlogModeration from "./pages/dashboard-admin/blog-moderation";
import UserManagement from "./pages/dashboard-admin/user-management";
import InformationPage from "./pages/navbar-page/about";
import BlogPage from "./pages/navbar-page/blog";
import SuccessStories from "./pages/navbar-page/success/index";
import SuccessStoryHoChiMinh from "./components/success-story-details/successStoryHoChiMinh";
import SuccessStoryNguyenVanNgu from "./components/success-story-details/successStoryNguyenVanNgu";
import SuccessStoryNguyenHieu from "./components/success-story-details/successStoryNguyenHieu";
import Profile from "./pages/navbar-page/profile";
import ProductPage from "./pages/navbar-page/service";
import UserProfile from "./pages/navbar-page/profile";
import LogSmoking from "./pages/navbar-page/journal";
import ForgotPassword from "./pages/auth/forgot-password/index.";
import UserProfileDropdown from "./components/user-profile-dropdown";
import OtpVerify from "./pages/auth/otp-verify";
import CoachManagement from "./pages/dashboard-admin/coach-managerment/index";
import BookingConsultPage from "./pages/navbar-page/booking/index";
import Plan from "./pages/navbar-page/my-plan";
import QuitPlanFree from "./pages/service/quit-plan-free";
import PackagePage from "./pages/package";
import ResetPassword from "./pages/auth/reset-password";
import ManagePackage from "./pages/dashboard-admin/manage-package";
import BookingManagement from "./pages/dashboard-admin/booking-management";
import ProfileInitialCondition from "./components/profile-initial-condition";
import InitialCondition from "./pages/initial-condition";
import UserPackage from "./pages/package/userPackage";
import PlanHistoryPreview from "./components/plan-history-preview";
import PaymentResultPage from "./pages/payment-result";
import CoachDashboard from "./pages/dashboard-coach";
import NotificationsPage from "./pages/notifications";
import ReportDashboard from "./pages/dashboard-admin/report";
import ClientDetailsPage from "./pages/dashboard-coach/ClientDetailsPage";

import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  // react-router-dom: ho tro phan thanh n trang, moi trang khi ma load len no se cap nhat html ben trong cai index.html
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet />
          <Footer />
        </>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
        },
        {
          path: "about",
          element: <InformationPage />,
        },
        {
          path: "booking",
          element: <BookingConsultPage />,
        },
        {
          path: "service",
          element: <ProductPage />,
        },
        {
          path: "service/quit-plan-free",
          element: <QuitPlanFree />,
        },
        {
          path: "service/cost-calculator",
          element: <ProductPage />,
        },
        {
          path: "success",
          element: <SuccessStories />,
        },
        {
          path: "success/success-story-details/1",
          element: <SuccessStoryHoChiMinh />,
        },
        {
          path: "success/success-story-details/2",
          element: <SuccessStoryNguyenVanNgu />,
        },
        {
          path: "success/success-story-details/3",
          element: <SuccessStoryNguyenHieu />,
        },
        {
          path: "blog",
          element: <BlogPage />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
        {
          path: "initial-condition-information",
          element: <ProfileInitialCondition />,
        },
        {
          path: "user-profile",
          element: <UserProfileDropdown />,
        },
        {
          path: "journal",
          element: <LogSmoking />,
        },
        {
          path: "my-plan",
          element: <Plan />,
        },
        {
          path: "package",
          element: <PackagePage />,
        },
        {
          path: "reset-password",
          element: <ResetPassword />,
        },
        {
          path: "user-package",
          element: <UserPackage />,
        },
        {
          path: "plan-history-preview",
          element: <PlanHistoryPreview />,
        },
        {
          path: "notifications",
          element: <NotificationsPage />,
        },
      ],
    },
    {
      path: "/login",
      element: <LoginPage />,
    },
    {
      path: "/register",
      element: <RegisterPage />,
    },
    {
      path: "/dashboard",
      element: <Dashboard />,
      children: [
        { path: "notifications", element: <Notifications /> },
        { path: "blogModeration", element: <BlogModeration /> },
        { path: "bookingManagement", element: <BookingManagement /> },
        { path: "userManagement", element: <UserManagement /> },
        { path: "coachManagement", element: <CoachManagement /> },
        { path: "managePackage", element: <ManagePackage /> },
        { path: "report", element: <ReportDashboard /> },
      ],
    },
    {
      path: "/payment-result",
      element: <PaymentResultPage />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/otp-verify",
      element: <OtpVerify />,
    },
    {
      path: "/initial-condition",
      element: <InitialCondition />,
    },
    // Coach-related routes are now grouped together
    {
      path: "/dashboard-coach",
      element: <CoachDashboard />,
    },
    {
      path: "/dashboard-coach/client-details/:clientId",
      element: <ClientDetailsPage />,
    },
  ]);
  return (
    <>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <RouterProvider router={router} />
        </PersistGate>
      </Provider>
    </>
  );
}

export default App;
