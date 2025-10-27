import { Link } from "react-router-dom";

export const Logo = () => (
  <Link
    to="/"
    className="flex items-center gap-2 font-bold text-2xl"
  >
    <img 
      src="/images/logos/logo.PNG" 
      alt="FAS KIDS" 
      className="h-10 w-auto"
    />
  </Link>
);
