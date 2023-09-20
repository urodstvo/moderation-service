import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Pricing from "@/pages/Pricing";
import Docs from "@/pages/Docs";
import TextModeration from "@/pages/TextModeration";
  
export const routes = [
  {
    path: '/',
    element: <Home />,
  },
  
  {
    path: '/services',
    element: <Services />,
  },

  {
    path: '/pricing',
    element: <Pricing />,
  },

  {
    path: '/docs',
    element: <Docs />,
  },

  {
    path: '/services/text-moderation',
    element: <TextModeration />,
  },

  {
    path: '*',
    element: <div> 404 </div>,
  }
]


