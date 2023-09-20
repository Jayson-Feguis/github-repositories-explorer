import { Typography } from "@material-tailwind/react";
import { MdOutlineSearchOff } from "react-icons/md";

const ResultNotFound = ({ text }: { text: string }) => {
  return (
    <div className="div-center flex-col">
      <div className="text-7xl">
        <MdOutlineSearchOff />
      </div>
      <Typography variant="lead" className="text-blue-gray-400 text-center">
        {text}
      </Typography>
    </div>
  );
};

export default ResultNotFound;
