import { ChevronDown } from "lucide-react";
import { createContext, ReactNode, useContext } from "react";
import useToggle from "@/hooks/useToggle";

type AccContextType = {
  open: boolean;
  toggle: () => void;
};

type AccordianItemProps = {
  children?: ReactNode;
  className?: string;
};

type AccButtonProps = {
  children?: ReactNode;
  className?: string;
  iconClassName?: string;
};

type AccContentProps = {
  children?: ReactNode;
  className?: string;
};

const AccContext = createContext<AccContextType | null>(null);

const useAccContext = () => {
  const context = useContext(AccContext);
  if (!context)
    throw new Error("AccContent components must be used within <Accordian>");
  return context;
};

const AccordianItem = ({ children, className }: AccordianItemProps) => {
  const [open, toggle] = useToggle();

  return (
    <AccContext.Provider value={{ open, toggle }}>
      <div className={className}>{children}</div>
    </AccContext.Provider>
  );
};

const AccButton = ({ children, className, iconClassName }: AccButtonProps) => {
  const { open, toggle } = useAccContext();

  return (
    <button
      onClick={toggle}
      className={`rounded-md flex items-center p-2 text-md hover:cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#262626] ${className}`}
    >
      {children}
      <ChevronDown
        className={` transition-transform duration-300 ${
          open ? "-rotate-180" : "rotate-0"
        } ${iconClassName}`}
      />
    </button>
  );
};

const AccContent = ({ children, className }: AccContentProps) => {
  const { open } = useAccContext();
  return open ? <div className={className}>{children}</div> : null;
};

type ButtonProps = {
  children?: ReactNode;
  className?: string;
};
const Button = ({ children, className }: ButtonProps) => {
  return <button className={`rounded-md flex items-center p-2 text-md hover:cursor-pointer hover:bg-[#f5f5f5] dark:hover:bg-[#262626] ${className}`} >{children}</button>;
};

export { AccordianItem, AccContent, AccButton, Button };
