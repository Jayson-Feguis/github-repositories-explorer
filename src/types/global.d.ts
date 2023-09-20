import { ResponseHeaders } from "@octokit/types";

type TInitialState<T> = {
  isLoading: boolean;
  isSuccess: boolean;
  info: T[];
  responseMessage: string | null;
  updatedAt: sumber | null;
};

type TQuery = {
  q: string;
  sort?: string;
  order?: "desc" | "asc";
  per_page?: number;
  page?: number;
};

type TGithubUserResponse = {
  total_count: number;
  incomplete_results: boolean;
  items?: [] | never;
};

type TGithubResponse = {
  data: IGithubUserResponse;
  headers: ResponseHeaders;
  status: number;
  url: string;
};

type TUser = {
  id: number;
  avatar_url: string;
  login: string;
  repos_url: string;
};

type TRepo = {
  id: number;
  name: string;
  description?: string;
  stargazers_count: number;
  owner: TUser;
};

type TCached<T> = {
  key: string;
  result: T[];
  updatedAt?: number;
};

type TCachedRepo = {
  username: string;
  data: TCached<TRepo>[];
  updatedAt?: number;
};

export {
  TQuery,
  TGithubResponse,
  TGithubUserResponse,
  TUser,
  TRepo,
  TInitialState,
  TCached,
  TCachedRepo,
};
