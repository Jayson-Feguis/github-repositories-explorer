import { create, StateCreator } from "zustand";
import { devtools, persist } from "zustand/middleware";
import githubUsersSlice, { TGithubUsersSlice } from "../slices/githubUsers";
import githubReposSlice, { TGithubReposSlice } from "../slices/githubRepos";
import { TRepo, TUser } from "../../types/global";

type GithubStore = TGithubReposSlice<TRepo> & TGithubUsersSlice<TUser>;

const middlewares = (f: StateCreator<GithubStore>) =>
  devtools(persist(f, { name: "github-explorer" }));

const useGithubStore = create(
  middlewares((...args) => ({
    ...githubReposSlice(...args),
    ...githubUsersSlice(...args),
  }))
);

export default useGithubStore;
