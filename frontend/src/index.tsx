import "@/index.css";
import "react-toastify/dist/ReactToastify.min.css";

import React, { Suspense } from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "@/store";
import Index from "@/pages";

import "@/locales/i18next";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <Suspense fallback="...is loading">
          <Index />
        </Suspense>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
