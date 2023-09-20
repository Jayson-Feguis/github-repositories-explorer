import { Octokit } from "octokit";

export const ENV = {
  ENVIRONMENT: import.meta.env.VITE_ENV,
  GITHUB_TOKEN: import.meta.env.VITE_GITHUB_TOKEN,
};

export const ERROR = {
  DEFAULT: "Something went wrong!",
  CHECK_INPUT: "Please check your input",
};

export const CACHE_REVALIDATION_TIME = 1000 * 60; // 1min
export const GITHUB_RESPONSE_MAX_LENGTH = 30; // 30 items per response
export const SANITIZE_GITHUB_USER = ["id", "login", "avatar_url", "repos_url"];
export const SANITIZE_GITHUB_REPO = [
  "id",
  "description",
  "name",
  "stargazers_count",
];

export const OCTOKIT = new Octokit({ auth: ENV.GITHUB_TOKEN });
export const OCTOKIT_HEADER = {
  "X-GitHub-Api-Version": "2022-11-28",
};
