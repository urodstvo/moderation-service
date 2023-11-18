import { useRoutes } from "react-router-dom";
import { Moderation } from "@/pages/Moderation";
import { Services } from "@/pages/Services";
import { Docs } from "@/pages/Docs";
import { Pricing } from "@/pages/Pricing";
import { Home } from "@/pages/Home";
import App from "@/App";
import InfoTab from "./Moderation/components/InfoTab";
import IntegrationTab from "./Moderation/components/IntegrationTab";
import PlaygroundTab from "./Moderation/components/PlaygroundTab";
import { NotFound } from "./404";

const Index = () => {
  const router = useRoutes([
    {
      path: "/",
      element: <App />,
      children: [
        {
          index: true,
          element: <Home />,
        },

        {
          path: "pricing",
          element: <Pricing />,
        },

        {
          path: "docs",
          element: <Docs />,
        },

        {
          path: "services",
          element: <Services />,
        },

        {
          path: "services/moderation",
          element: <Moderation />,
          children: [
            {
              path: "info",
              index: true,
              element: <InfoTab />,
            },

            {
              path: "integration",
              element: <IntegrationTab />,
            },

            {
              path: "playground/:type",
              element: <PlaygroundTab />,
            },
          ],
        },

        {
          path: "*",
          element: <NotFound />,
        },
      ],
    },
  ]);

  return router;
};

export default Index;
