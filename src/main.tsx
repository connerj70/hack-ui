import React from "react";
import ReactDOM from "react-dom/client";
import Root from "./routes/root";
import Signup from "./routes/signup";
import Login from "./routes/login";
import Dashboard from "./routes/dashboard/dashboard";
import Scanners, { loader as devicesLoader } from "./routes/scanner/scanners";
import Device, { loader as deviceLoader } from "./routes/dashboard/device";
import Items from "./routes/items/items";
import CreateItem from "./routes/items/createItem";
import Profile from "./routes/profile";
import Events, { loader as eventsLoader } from "./routes/events/events";
import CreateEvent from "./routes/events/createEvent";
import AuthenticatedLayout from "./routes/authenticatedLayout";
import ErrorPage from "./error-page";
import "./globals.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { UserProvider } from "./contexts/userContext";
import AuthWrapper from "@/components/authWrapper";
import CreateScanner from "./routes/scanner/createScanner";
import { itemLoader } from "./routes/items/loader";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: (
      <AuthWrapper>
        <AuthenticatedLayout />
      </AuthWrapper>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "scanners",
        element: <Scanners />,
        loader: devicesLoader,
      },
      {
        path: "scanners/create",
        element: <CreateScanner />,
      },
      {
        path: "scanners/:id",
        element: <Device />,
        loader: deviceLoader,
      },
      {
        path: "items",
        element: <Items />,
        loader: itemLoader,
      },
      {
        path: "items/create",
        element: <CreateItem />,
      },
      {
        path: "events",
        element: <Events />,
        loader: eventsLoader,
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
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>
);
