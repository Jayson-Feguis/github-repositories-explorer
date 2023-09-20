import { StateCreator } from "zustand";
import {
  TRepo,
  TInitialState,
  TQuery,
  TCachedRepo,
  TCached,
} from "../../../types/global";
import {
  ERROR,
  GITHUB_RESPONSE_MAX_LENGTH,
  OCTOKIT,
  OCTOKIT_HEADER,
  SANITIZE_GITHUB_REPO,
  SANITIZE_GITHUB_USER,
} from "../../../lib/constants";
import _ from "lodash";
import { queryStringify } from "../../../lib/utils";

export type TGithubReposSlice<T> = {
  githubRepos: TInitialState<T>;
  githubReposCached: TCachedRepo;
  searchGithubRepos: (username: string, query: TQuery) => Promise<void>;
  resetGithubRepos: () => void;
};

const initialState: TInitialState<TRepo> = {
  isLoading: false,
  isSuccess: false,
  info: [],
  responseMessage: null,
  updatedAt: null,
};

const initialStateCache: TCachedRepo = {
  username: "",
  data: [],
  updatedAt: 0,
};

const githubReposSlice: StateCreator<TGithubReposSlice<TRepo>> = (
  set,
  get
) => ({
  githubRepos: initialState,
  githubReposCached: initialStateCache,
  searchGithubRepos: async (username: string, query: TQuery) => {
    try {
      set((state) => ({
        ...state,
        githubRepos: {
          ...state.githubRepos,
          isLoading: true,
          updatedAt: Date.now(),
          responseMessage: "",
        },
      }));
      let cachedRepo = get().githubReposCached;
      if (_.isEqual(cachedRepo.username, username)) {
        cachedRepo = {
          username,
          data: cachedRepo.data,
          updatedAt: Date.now(),
        };
      }
      let githubRepos: any = {};
      const q = `/users/${username}/repos?${queryStringify(query)}`;
      if (
        // Check if the user is existing in cache & length of result in the last item is greate than or equal to 30
        _.isEqual(cachedRepo.username, username) &&
        _.size(cachedRepo.data) > 0 &&
        _.size(cachedRepo.data[_.size(cachedRepo.data) - 1].result) >=
          GITHUB_RESPONSE_MAX_LENGTH
      ) {
        githubRepos = await OCTOKIT.request(`GET ${q}`, {
          headers: OCTOKIT_HEADER,
        });
      } else if (!_.isEqual(cachedRepo.username, username)) {
        // Check if the user is not existing in cache
        githubRepos = await OCTOKIT.request(`GET ${q}`, {
          headers: OCTOKIT_HEADER,
        });
      }

      set((state) => {
        if (
          _.isEqual(cachedRepo.username, username) &&
          _.size(cachedRepo.data) > 0 &&
          _.size(cachedRepo.data[_.size(cachedRepo.data) - 1].result) >=
            GITHUB_RESPONSE_MAX_LENGTH
        ) {
          cachedRepo.data = _.uniqBy(
            [
              {
                key: q,
                result: githubRepos.data,
              },
              ...cachedRepo.data,
            ],
            "key"
          ).sort(
            (a, b) =>
              Number(a.key.split("page=")[1]) - Number(b.key.split("page=")[1])
          );

          cachedRepo.updatedAt = Date.now();
        } else if (!_.isEqual(cachedRepo.username, username)) {
          cachedRepo = {
            username,
            data: [
              {
                key: q,
                result: githubRepos.data,
              },
            ],
            updatedAt: Date.now(),
          };
        }

        cachedRepo.data = cachedRepo.data.map((i) => ({
          ...i,
          result: i.result.map((j) => ({
            owner: _.pick(j.owner, SANITIZE_GITHUB_USER),
            ..._.pick(j, SANITIZE_GITHUB_REPO),
          })),
        })) as TCached<TRepo>[];

        return {
          ...state,
          githubRepos: {
            ...state.githubRepos,
            info: githubRepos.data.map((i: TRepo) =>
              _.pick(i, SANITIZE_GITHUB_REPO)
            ),
            isSuccess: true,
          },
          githubReposCached: cachedRepo,
        };
      });
    } catch (error) {
      let errorMessage = ERROR.DEFAULT;
      if (error instanceof Error) errorMessage = (error as Error).message;
      set((state) => ({
        ...state,
        githubRepos: {
          ...state.githubRepos,
          isSuccess: false,
          responseMessage: errorMessage,
        },
      }));
    } finally {
      set((state) => ({
        ...state,
        githubRepos: {
          ...state.githubRepos,
          isLoading: false,
          updatedAt: Date.now(),
        },
      }));
    }
  },
  resetGithubRepos: () => {
    set((state) => ({
      ...state,
      githubRepos: initialState,
      githubReposCached: initialStateCache,
    }));
  },
});

export default githubReposSlice;
