import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import Header from "./components/header";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import Dashboard from "./components/dashboard";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";
import Notifications from "./pages/dashboard-admin/notifications/index";
import BlogModeration from "./pages/dashboard-admin/blog-moderation";
import UpgradeSuggestions from "./pages/dashboard-admin/upgrade-suggestions/index";
import UserManagement from "./pages/dashboard-admin/user-management";
import Footer from "./components/footer";
import InformationPage from "./pages/navbar-page/about";
import ContactPage from "./pages/navbar-page/contact/index";

import BlogPage from "./pages/navbar-page/blog";
import SuccessStories from "./pages/navbar-page/success/index";
import SuccessStoryHoChiMinh from "./components/success-story-details/successStoryHoChiMinh";
import SuccessStoryNguyenVanNgu from "./components/success-story-details/successStoryNguyenVanNgu";
import SuccessStoryNguyenHieu from "./components/success-story-details/successStoryNguyenHieu";
import Profile from "./pages/navbar-page/profile";
import InitialStatus from "./pages/init-status";
import ProductPage from "./pages/navbar-page/service";
import UserProfileDropdown from "./components/user-profile-dropdown";
import UserProfile from "./pages/navbar-page/profile";
import LogSmoking from "./pages/navbar-page/journal";
import AchievementsPage from "./pages/navbar-page/achievements";
import PlanFree from "./pages/navbar-page/planFree";
import Payment from "./pages/payment";
import ForgotPassword from "./pages/auth/forgotPassword";

// import InitialSurvey from "./pages/initial-survey";
import CoachManagement from "./pages/dashboard-admin/coach-managerment/index";
import BookingConsultPage from "./pages/navbar-page/booking/index";

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
          path: "success",
          element: <SuccessStories />,
        },
        {
          path: "blog",
          element: <BlogPage />,
        },
        {
          path: "contact",
          element: <ContactPage />,
        },
        {
          path: "success-story-details/1",
          element: <SuccessStoryHoChiMinh />,
        },
        {
          path: "success-story-details/2",
          element: <SuccessStoryNguyenVanNgu />,
        },
        {
          path: "success-story-details/3",
          element: <SuccessStoryNguyenHieu />,
        },
        {
          path: "profile",
          element: <UserProfile />,
        },
        {
          path: "init-status",
          element: <InitialStatus />,
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
          path: "achievements",
          element: <AchievementsPage />,
        },
        {
          path: "plan",
          element: <PlanFree />,
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
        { path: "upgradeSuggestions", element: <UpgradeSuggestions /> },
        { path: "userManagement", element: <UserManagement /> },
        { path: "coachManagement", element: <CoachManagement /> },
      ],
    },
    {
      path: "/payment/:planId",
      element: <Payment />,
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
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
