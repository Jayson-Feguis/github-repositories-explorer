import { ReactNode } from "react";
import { Drawer } from "@material-tailwind/react";
import clsx from "clsx";

type Props = {
  children: ReactNode;
  open: boolean;
  onClose: () => void;
  placement?: "top" | "right" | "bottom" | "left";
  className?: string;
  overlayClassName?: string;
};

const CustomDrawer = ({
  children,
  open,
  onClose,
  placement = "left",
  className,
  overlayClassName,
}: Props) => {
  return (
    <Drawer
      id="custom-drawer"
      placement={placement}
      open={open}
      onClose={onClose}
      className={clsx("p-4", className)}
      overlayProps={{
        className: clsx("fixed top-0 left-0", overlayClassName),
      }}
    >
      {children}
    </Drawer>
  );
};

export default CustomDrawer;
