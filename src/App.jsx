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
import Notifications from './pages/dashboard-admin/notifications/index';
import BlogModeration from "./pages/dashboard-admin/blog-moderation";
import UpgradeSuggestions from "./pages/dashboard-admin/upgrade-suggestions/index";
import UserManagement from "./pages/dashboard-admin/user-management";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header />
          <Outlet />
          {/* <Footer/> */}
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
      children:[
        {path:"notifications",
          element:<Notifications/> 
        },
        {path:"blogModeration",
          element:<BlogModeration/> 
        },
        {path:"upgradeSuggestions",
          element:<UpgradeSuggestions/> 
        },
        {path:"userManagement",
          element:<UserManagement/> 
        },
      ]
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
