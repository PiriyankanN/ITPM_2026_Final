import { motion } from "framer-motion";

const PageWrapper = ({ children }) => {
  return (
    <div className="fade-in">
      {children}
    </div>
  );
};

export default PageWrapper;
