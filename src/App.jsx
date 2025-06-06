import React from "react";
import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";

import LoginPage from "./pages/login";
import RegisterPage from "./pages/register";
import HomePage from "./pages/home";
import Dashboard from "./components/dashboard";
import { Provider } from "react-redux";
import { persistor, store } from "./redux/store";
import { PersistGate } from "redux-persist/integration/react";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          {/* <Navbar /> */}
          <Outlet />
          {/* <Footer /> */}
        </>
      ),
      children: [
        {
          path: "/",
          element: <HomePage />,
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
