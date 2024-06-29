import React from "react";
import ReactDOM from "react-dom/client";
import reportWebVitals from "./reportWebVitals";
import "antd/dist/reset.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { HomePage } from "./page/home.page";
import { UserPage } from "./page/user.page";
import { App } from "./App";
const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement);
const route = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "user",
        element: <UserPage />,
      },
    ],
  },
]);
root.render(
  <React.StrictMode>
    <RouterProvider router={route}></RouterProvider>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
