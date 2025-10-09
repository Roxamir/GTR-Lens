import { cn } from "../../utils/classNames";
import { Link } from "react-router-dom";

const Button = ({
  children,
  variant = "primary",
  className = "",
  as = "button",
  ...props
}) => {
  const baseStyles =
    "cursor-pointer rounded py-2 px-4 font-semibold transition duration-200 ease-in-out active:scale-95 focus:outline-none focus:ring-2 focus:ring-offset-2";
  const variantStyles = {
    primary: "bg-red-700 text-white! hover:bg-red-900 focus:ring-red-500",
    secondary: "bg-gray-600 text-white! hover:bg-gray-700 focus:ring-gray-500",
    icon: "bg-transparent hover:bg-red-700 focus:ring-slate-500 p-2",
  };
  const Component = as === "link" ? Link : "button";

  return (
    <Component
      className={cn(baseStyles, variantStyles[variant], className)}
      {...props}
    >
      {children}
    </Component>
  );
};

export default Button;
