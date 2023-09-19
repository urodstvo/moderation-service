import Home from "@/pages/Home";
import Services from "@/pages/Services";
import Pricing from "@/pages/Pricing";
import Docs from "@/pages/Docs";
  
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
    path: '*',
    element: <div> 404 </div>,
  }
]


