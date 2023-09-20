import { useState } from "react";

const useSelected = <T>(defaultValue: T) => {
  const [selected, setSelected] = useState<T>(defaultValue);

  const onSelect = (str: T) => setSelected(str);

  return { selected, onSelect };
};

export default useSelected;
