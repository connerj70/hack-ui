import React from 'react'
import ReactDOM from 'react-dom/client'
import Root from "./routes/root"
import Signup from "./routes/signup"
import Login from "./routes/login"
import Dashboard from "./routes/dashboard"
import Devices from "./routes/devices"
import AuthenticatedLayout from './routes/authenticatedLayout'
import ErrorPage from "./error-page"
import "./globals.css"
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import { UserProvider } from "./contexts/userContext";


const router = createBrowserRouter([
  {
    path: "/",
    element: <Root />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/",
    element: <AuthenticatedLayout />,
    children: [
      {
        path: "dashboard",
        element: <Dashboard />,
      },
      {
        path: "devices",
        element: <Devices />,
      }
    ]
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

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </React.StrictMode>,
)
