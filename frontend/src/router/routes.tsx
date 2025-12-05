import { Route } from "./route";
import HomePage from "@/pages/home";
import LoginPage from "@/pages/login";
import ForbiddenPage from "@/pages/forbidden";
import NotFoundPage from "@/pages/not-found";
import { WithAuth } from "@/components/wrappers";

export const routes = {
  home: new Route({
    path: "/",
    component: (
      <WithAuth>
        <HomePage />
      </WithAuth>
    ),
  }),
  login: new Route({
    path: "/login",
    component: <LoginPage />,
  }),
  forbidden: new Route({
    path: "/forbidden",
    component: <ForbiddenPage />,
  }),
  notFound: new Route({
    path: "/not-found",
    component: <NotFoundPage />,
  }),
};
