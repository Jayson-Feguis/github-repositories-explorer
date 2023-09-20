import { StateCreator } from "zustand";
import { TInitialState, TUser, TCached } from "../../../types/global";
import {
  ERROR,
  OCTOKIT,
  OCTOKIT_HEADER,
  SANITIZE_GITHUB_USER,
} from "../../../lib/constants";
import _ from "lodash";

export type TGithubUsersSlice<T> = {
  githubUsers: TInitialState<T>;
  githubUsersCached: TCached<T>[];
  searchGithubUser: (query: string) => Promise<void>;
  resetGithubUsers: () => void;
};

const initialState: TInitialState<TUser> = {
  isLoading: false,
  isSuccess: false,
  info: [],
  responseMessage: null,
  updatedAt: null,
};

const initialStateCache: TCached<TUser>[] = [];

const githubUsersSlice: StateCreator<TGithubUsersSlice<TUser>> = (set) => ({
  githubUsers: initialState,
  githubUsersCached: initialStateCache,
  searchGithubUser: async (query: string) => {
    try {
      set((state) => ({
        ...state,
        githubUsers: {
          ...state.githubUsers,
          isLoading: true,
          updatedAt: Date.now(),
        },
      }));
      const githubUsers = await OCTOKIT.request(`GET ${query}`, {
        headers: OCTOKIT_HEADER,
      });

      const sanitizedGithubUsers = githubUsers.data.items.map((i: TUser) =>
        _.pick(i, SANITIZE_GITHUB_USER)
      );

      set((state) => ({
        ...state,
        githubUsers: {
          ...state.githubUsers,
          info: sanitizedGithubUsers,
          isSuccess: true,
        },
        githubUsersCached: _.uniqBy(
          [
            {
              key: query,
              result: sanitizedGithubUsers,
              updatedAt: Date.now(),
            },
            ...state.githubUsersCached,
          ],
          "key"
        ),
      }));
    } catch (error) {
      let errorMessage = ERROR.DEFAULT;
      if (error instanceof Error) errorMessage = (error as Error).message;
      set((state) => ({
        ...state,
        githubUsers: {
          ...state.githubUsers,
          isSuccess: false,
          responseMessage: errorMessage,
        },
      }));
    } finally {
      set((state) => ({
        ...state,
        githubUsers: {
          ...state.githubUsers,
          isLoading: false,
          updatedAt: Date.now(),
        },
      }));
    }
  },
  resetGithubUsers: () => {
    set((state) => ({
      ...state,
      githubUsers: initialState,
      githubUsersCached: [],
    }));
  },
});

export default githubUsersSlice;
