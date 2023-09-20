import { useState } from "react";

const useToggle = () => {
  const [open, setOpen] = useState(false);

  const toggle = () => setOpen(!open);
  const onClose = () => setOpen(false);

  return { open, toggle, onClose };
};

export default useToggle;
