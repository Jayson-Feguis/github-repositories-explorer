import { Spinner } from "@material-tailwind/react";

type Props = {
  isLoading: boolean;
};

const LazyLoader = ({ isLoading }: Props) => {
  return (
    isLoading && (
      <div className="div-center pb-8 pt-5 w-full z-[1]">
        <Spinner className="w-8 h-8" />
      </div>
    )
  );
};

export default LazyLoader;
