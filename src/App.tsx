import {
  useState,
  FormEvent,
  useRef,
  useCallback,
  MutableRefObject,
  useMemo,
} from "react";
import "./App.css";
import { List, Typography } from "@material-tailwind/react";
import _ from "lodash";
import {
  CustomDrawer,
  GithubRepoCard,
  GithubUserCard,
  GithubUserLoader,
  LazyLoader,
  ResultNotFound,
  SearchUserForm,
  SelectedGithubUser,
} from "./components";
import { TCached, TRepo, TUser } from "./types/global";
import useGithubStore from "./zustand/store";
import {
  CACHE_REVALIDATION_TIME,
  ERROR,
  GITHUB_RESPONSE_MAX_LENGTH,
} from "./lib/constants";
import { dateOffset, queryStringify } from "./lib/utils";
import {
  useIsMobileView,
  useSelected,
  useToggle,
  useUpdateEffect,
} from "./hooks";
import clsx from "clsx";
import { BsGithub } from "react-icons/bs";

type IntersectionObserverRef = MutableRefObject<
  IntersectionObserver | null | undefined
>;

function App() {
  // Zustand Store
  const {
    githubUsers,
    githubRepos,
    githubUsersCached,
    githubReposCached,
    searchGithubRepos,
    searchGithubUser,
  } = useGithubStore();
  // When user clicks username, this state will hold that user
  const { selected, onSelect } = useSelected(
    !_.isNil(githubUsers.info) ? (githubUsers.info[0] as TUser) : ({} as TUser)
  );
  const { open, toggle, onClose } = useToggle(); // This will toggle and/or close the drawer
  const isMobile = useIsMobileView(); // Check if window is in mobile view
  // This holds state for searched github usernames
  const [filteredGithubUsers, setFilteredGithubUsers] = useState<TUser[]>(
    githubUsers.info
  );
  const [lastSearch, setLastSearch] = useState(""); // This holds state for the last search of the end-user
  const [page, setPage] = useState(0); // Pagination of repositories
  const [isDefaultView, setIsDefaultView] = useState(false); // When the app used for the first time, default view will be displayed
  const mobileInputRef = useRef<HTMLInputElement | null>(null);
  const observer: IntersectionObserverRef = useRef();
  // This will return all repositories of the selected user from cached
  const repoList = useMemo(
    () =>
      _.isEqual(selected?.login, githubReposCached.username)
        ? githubReposCached.data
        : [],
    [githubReposCached.data, selected?.login, githubReposCached.username]
  );

  const usersRepo = _.flatMap(repoList?.map((i) => i.result)); // flatten the data of repoList cached

  // Used to know what element is in the last index of repostitories list
  const lastRepoElement = useCallback(
    (node: any) => {
      if (githubRepos.isLoading) return;
      if (observer.current) observer.current?.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          !_.isNil(repoList) &&
          !githubRepos.isLoading &&
          _.size(repoList[_.size(repoList) - 1].result) >=
            GITHUB_RESPONSE_MAX_LENGTH
        ) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current?.observe(node);
    },
    [githubRepos.isLoading, repoList]
  );

  const handleClickUserRef = useRef<(user: TUser) => Promise<void>>(
    async () => {}
  );

  useUpdateEffect(() => {
    setFilteredGithubUsers(githubUsers.info as TUser[]);

    // Check if the user used the app for the first time
    if (
      !githubUsers.isSuccess &&
      !githubUsers.isLoading &&
      _.size(githubUsers.info) <= 0
    )
      setIsDefaultView(true);
    else setIsDefaultView(false);
  }, [githubUsers.updatedAt]);

  useUpdateEffect(() => {
    // Everytime page number is changing, this function will be emitted
    if (selected) handleClickUserRef.current(selected);
  }, [page]);

  useUpdateEffect(() => {
    // Everytime selected user is changing, set the page to 1
    if (!_.isEqual(page, 1)) setPage(1);
    else if (selected) handleClickUserRef.current(selected);
  }, [selected]);

  useUpdateEffect(() => {
    // Everytime open is changing, and if open is equal to true, then input will be set to focus
    if (open) mobileInputRef?.current?.focus();
  }, [open]);

  const handleSubmit = async (
    e: FormEvent<HTMLFormElement>,
    search: string
  ) => {
    e.preventDefault();
    if (isMobile && isDefaultView) toggle();
    try {
      // Check if search is empty
      if (_.isEmpty(search)) throw Error(ERROR.CHECK_INPUT);

      const query = `/search/users?${queryStringify({
        q: search,
        page: 1,
      })}`;
      const cachedUser = githubUsersCached.find((i: TCached<TUser>) =>
        _.isEqual((i as TCached<TUser>).key.toLowerCase(), query.toLowerCase())
      );

      // Check if the query is existing in the cached, if yes, the result will be set from cached, else, it will call api
      if (
        !_.isNil(cachedUser) &&
        Date.now() <
          dateOffset(CACHE_REVALIDATION_TIME, cachedUser.updatedAt as number)
      ) {
        setFilteredGithubUsers(cachedUser.result);
      } else {
        await searchGithubUser(query);
      }

      setLastSearch(search);
    } catch (error) {
      console.error(error);
    }
  };

  handleClickUserRef.current = async (user: TUser) => {
    try {
      if (!_.isNil(user)) await searchGithubRepos(user.login, { q: "", page });
    } catch (error) {
      console.error(error);
    }
  };

  /* -------------------------- LIST OF GITHUB USERS -------------------------- */
  const renderUserList = (
    <List className="min-w-[100px]">
      {!githubUsers.isLoading ? (
        _.size(filteredGithubUsers) > 0 ? (
          filteredGithubUsers?.slice(0, 5).map((user: TUser) => (
            <GithubUserCard
              key={user?.id}
              user={user}
              onClick={(user) => {
                onSelect(user);
                if (isMobile) toggle();
              }}
              active={selected?.login}
            />
          ))
        ) : (
          !_.isEmpty(lastSearch) &&
          githubUsers.isSuccess &&
          !githubUsers.isLoading && <ResultNotFound text="User not found!" />
        )
      ) : (
        <GithubUserLoader />
      )}
    </List>
  );

  const renderSearchText = _.size(lastSearch) > 0 && (
    <Typography
      variant="small"
      className="text-blue-gray-400"
    >{`Showing users for "${lastSearch}"`}</Typography>
  );

  const renderForm = (
    <SearchUserForm
      ref={isMobile ? mobileInputRef : undefined}
      key="search"
      onSubmit={handleSubmit}
      isLoading={githubUsers.isLoading}
    />
  );

  return (
    <>
      {!isDefaultView ? (
        <main className="min-h-screen w-full flex justify-center px-3 relative">
          <div className="w-full md:max-w-5xl flex flex-wrap gap-5">
            <div className="fixed top-0 left-0 div-center w-full z-10 p-2 md:p-5 bg-white">
              <Typography
                variant="h3"
                className="text-lg md:text-2xl text-center"
              >
                Github Repository Explorer
              </Typography>
            </div>
            <div className="flex flex-wrap gap-5 mt-10 w-full">
              <div className="md:w-1/3 flex flex-col bg-blue-gray-50/30 rounded-xl mt-10">
                <div
                  className="fixed bg-white md:bg-transparent top-10 left-0 p-5 w-full flex flex-col gap-3 md:sticky md:top-20"
                  onClick={toggle}
                >
                  <div>
                    {renderForm}
                    <div className="hidden md:flex">{renderSearchText}</div>
                  </div>
                  <div className="hidden md:flex md:flex-col">
                    {renderUserList}
                  </div>
                  <div className="flex md:hidden">
                    {!_.isNil(selected) && (
                      <SelectedGithubUser user={selected} />
                    )}
                  </div>
                </div>
              </div>
              {/* ------------------------------ REPOSITORIES ------------------------------ */}
              <div className="flex-1 flex flex-col items-start pt-[6.5rem] md:pt-0 bg-blue-gray-50/30 rounded-xl mt-10">
                <div className="hidden md:flex md:flex-col sticky top-[4.5rem] w-full py-3 mt-3 px-5 bg-[#F9FAFB]">
                  {!_.isNil(selected) && <SelectedGithubUser user={selected} />}
                </div>
                <List className="!min-w-[100px] w-full">
                  {_.size(usersRepo) > 0
                    ? usersRepo.map((repo: TRepo, index) => (
                        <GithubRepoCard
                          ref={
                            _.isEqual(_.size(usersRepo), index + 1)
                              ? lastRepoElement
                              : null
                          }
                          key={repo?.id}
                          repo={repo}
                        />
                      ))
                    : githubRepos.isSuccess &&
                      !githubRepos.isLoading && (
                        <ResultNotFound text="This user doesn't have any repositories yet!" />
                      )}
                </List>
                <LazyLoader isLoading={githubRepos.isLoading} />
              </div>
            </div>
          </div>
        </main>
      ) : (
        /* -------------------------------DEFAULT VIEW ------------------------------ */
        <div className="min-h-screen w-full div-center flex-col gap-5 px-5">
          <div className="div-center flex-col">
            <div className="text-4xl md:text-7xl">
              <BsGithub />
            </div>
            <Typography
              variant="h6"
              className="text-lg sm:text-xl md:text-5xl text-center flex items-center gap-3"
            >
              Github Repository Explorer
            </Typography>
          </div>
          <div className="w-full sm:w-[300px] md:w-[500px]">{renderForm}</div>
        </div>
      )}
      {/* --------------------------------- DRAWER --------------------------------- */}
      <CustomDrawer
        open={open}
        onClose={onClose}
        placement="top"
        className={clsx(
          "flex flex-col md:hidden",
          open ? "!max-h-[400px]" : ""
        )}
        overlayClassName="flex flex-col md:hidden"
      >
        {renderForm}
        {renderSearchText}
        <div className="flex flex-col md:hidden">{open && renderUserList}</div>
      </CustomDrawer>
    </>
  );
}

export default App;
