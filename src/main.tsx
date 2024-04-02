import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root";
import Signup from "./routes/signup";
import Login from "./routes/login";
import Scanners from "./routes/scanner/scanners";
import Items from "./routes/items/items";
import CreateItem from "./routes/items/createItem";
import Profile from "./routes/profile";
import Events from "./routes/events/events";
import CreateEvent from "./routes/events/createEvent";
import AuthenticatedLayout from "./routes/authenticatedLayout";
import ErrorPage from "./error-page";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import CreateScanner from "./routes/scanner/createScanner";
import { eventLoader } from "./routes/events/eventLoader";
// import Dashboard from "./routes/dashboard/dashboard";
import { AuthProvider } from "./contexts/AuthProvider";
import RequireAuth from "./routes/RequireAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <RequireAuth>
        <AuthenticatedLayout />
      </RequireAuth>
    ),
    errorElement: <ErrorPage />,
    children: [
      // {
      //   path: "dashboard",
      //   element: <Dashboard />,
      // },
      {
        path: "scanners",
        element: <Scanners />,
      },
      {
        path: "scanners/create",
        element: <CreateScanner />,
      },
      {
        path: "items",
        element: <Items />
      },
      {
        path: "items/create",
        element: <CreateItem />,
      },
      {
        path: "events",
        element: <Events />,
        loader: eventLoader,
      },
      {
        path: "events/create",
        element: <CreateEvent />,
      },
      {
        path: "profile",
        element: <Profile />,
      },
    ],
  },
  {
    path: "signup",
    element: <Signup />,
  },
  {
    path: "login",
    element: <Login />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      {/* <UserProvider> */}
      <RouterProvider router={router} />
      {/* </UserProvider> */}
    </AuthProvider>
  </React.StrictMode>
);
