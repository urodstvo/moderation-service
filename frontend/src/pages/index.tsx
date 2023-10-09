import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Pricing from "@/pages/Pricing";
import Docs from "@/pages/Docs";
import TextModeration from "@/pages/TextModeration";
import Admin from "@/pages/Admin";
  
export const public_routes = [
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

export const admin_routes = [  
  {
    path: '/admin/dashboard',
    element: <Admin />,
  },
]


