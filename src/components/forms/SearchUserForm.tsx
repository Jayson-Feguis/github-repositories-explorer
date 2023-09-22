import { ChangeEvent, FormEvent, forwardRef, Ref, useState } from "react";
import { Input, Button, Spinner } from "@material-tailwind/react";
import { AiOutlineClose } from "react-icons/ai";
import { FiSearch } from "react-icons/fi";
import _ from "lodash";
import { useIsMobileView } from "../../hooks";

type Props = {
  onSubmit: (e: FormEvent<HTMLFormElement>, search: string) => Promise<void>;
  isLoading: boolean;
};

const SearchUserForm = forwardRef(
  ({ onSubmit, isLoading }: Props, ref: Ref<HTMLInputElement>) => {
    const [search, setSearch] = useState("");
    const isMobileView = useIsMobileView();

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
      e.preventDefault();
      setSearch(e.target.value);
    };

    const handleClear = () => {
      setSearch("");
      if (isMobileView && !_.isNil(ref)) (ref as any).current?.focus();
    };

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
      <form
        data-testid="search-user-form"
        onSubmit={(e) => onSubmit(e, search)}
        className="flex gap-3"
      >
        <div className="relative flex-1 w-full">
          <Input
            id="search-user"
            data-testid="search-input"
            inputRef={ref}
            crossOrigin="false"
            onChange={handleChange}
            label="Enter username"
            name="search"
            value={search}
            disabled={isLoading}
            inputMode="search"
            containerProps={{ className: "!min-w-[100px]" }}
            className="!w-full"
          />
          {!_.isEmpty(search) && (
            <div
              data-testid="search-clear-btn"
              className="absolute top-1/2 right-2 -translate-y-1/2 !z-10 hover:cursor-pointer"
              onClick={handleClear}
            >
              <AiOutlineClose />
            </div>
          )}
        </div>
        <Button
          data-testid="search-btn"
          className="flex items-center justify-center gap-2 bg-blue-600 disabled:bg-blue-gray-400 w-[calc(40% - 6px)]"
          disabled={isLoading || _.isEmpty(search)}
          type="submit"
        >
          {spinner}
        </Button>
      </form>
    );
  }
);

export default SearchUserForm;
