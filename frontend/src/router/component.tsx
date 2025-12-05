import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { routes } from "./routes";

export function Router() {
  return (
    <BrowserRouter>
      <Routes>
        {Object.values(routes).map((route, index) => (
          <Route key={index} path={route.path} element={route.component} />
        ))}
        <Route path="*" element={<Navigate to={routes.notFound.getPath()} replace />} />
      </Routes>
    </BrowserRouter>
  );
}
