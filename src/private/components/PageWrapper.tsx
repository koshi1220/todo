// components/PageWrapper.tsx
import React from "react";
// import { useAuth } from "../../public/controller/useAuth.js";
// import{ AppLayout} from "../views/AppLayout.js";

type Props = {
    children: React.ReactNode;
  };
  
  const PageWrapper = ({ children }: Props) => {
    return <div>{children}</div>;
  };
  
  export default PageWrapper;
  
