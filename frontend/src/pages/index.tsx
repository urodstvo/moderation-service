import Home from "@/pages/Home";
import Services from "@/pages/Services";
  
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
    path: '*',
    element: <div> 404 </div>,
  }
]


