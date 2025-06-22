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
import ContactPage from './pages/navbar-page/contact/index';
import ProductPage from "./pages/navbar-page/product";
import KnowledgePage from './pages/navbar-page/knowledge/index';
import BlogPage from "./pages/navbar-page/blog";
import SuccessStories from "./pages/navbar-page/success/index";
import SuccessStoryHoChiMinh from "./components/success-story-details/successStoryHoChiMinh";
import SuccessStoryNguyenVanNgu from "./components/success-story-details/successStoryNguyenVanNgu";
import SuccessStoryNguyenHieu from "./components/success-story-details/successStoryNguyenHieu";
import Profile from "./pages/navbar-page/profile";
// import InitialSurvey from "./pages/initial-survey";



function App() {
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
          path: "home",
          element: <div>about</div>,
        },
        {
          path: "about",
          element: <div>about</div>,
        },
        {
          path: "services",
          element: <div>about</div>,
        },
        {
          path: "news",
          element: <div>about</div>,
        },
        {
          path: "contact",
          element: <div>about</div>,
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
      ],
    },
    {
      path: "/forgot-password",
      element: <ForgotPassword />,
    },
    {
      path: "/reset-password",
      element: <ResetPassword />,
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
