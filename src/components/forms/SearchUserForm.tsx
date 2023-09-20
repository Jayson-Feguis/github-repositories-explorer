import { ChangeEvent, FormEvent, forwardRef, Ref } from "react";
import { Input, Button, Spinner } from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import _ from "lodash";

type Props = {
  onSubmit: (e: FormEvent<HTMLFormElement>) => Promise<void>;
  onClear: () => void;
  isLoading: boolean;
  value: string;
  onChange: (e: ChangeEvent<HTMLInputElement>) => void;
};

const SearchUserForm = forwardRef(
  (
    { onSubmit, onChange, isLoading, value, onClear }: Props,
    ref: Ref<HTMLInputElement>
  ) => {
    const spinner = isLoading ? (
      <Spinner className="h-4 w-4" />
    ) : (
      <>
        <div className="text-lg">
          <FiSearch />
        </div>
      </>
    );

    return (
      <form onSubmit={onSubmit} className="flex gap-3">
        <div className="relative flex-1 w-full">
          <Input
            id="search-user"
            inputRef={ref}
            crossOrigin="false"
            onChange={onChange}
            label="Enter username"
            name="search"
            value={value}
            disabled={isLoading}
            inputMode="search"
            containerProps={{ className: "!min-w-[100px]" }}
            className="!w-full"
          />
          {!_.isEmpty(value) && (
            <div
              className="absolute top-1/2 right-2 -translate-y-1/2 !z-10 hover:cursor-pointer"
              onClick={onClear}
            >
              <AiOutlineClose />
            </div>
          )}
        </div>
        <Button
          className="flex items-center justify-center gap-2 bg-blue-600 disabled:bg-blue-gray-400 w-[calc(40% - 6px)]"
          disabled={isLoading || _.isEmpty(value)}
          type="submit"
        >
          {spinner}
        </Button>
      </form>
    );
  }
);

export default SearchUserForm;
