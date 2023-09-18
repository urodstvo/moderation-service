import Home from "@/pages/Home/Home";
import Services from "./Services/Services";
  
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


