import { render, screen } from "@testing-library/react";

// To Test
import { GithubRepoCard } from "..";
import { TRepo } from "../../types/global";

// Setup
const setup = (stargazers_count = 5) => {
  const owner = {
    id: 1,
    avatar_url: "https://avatars.githubusercontent.com/u/100183426?v=4",
    login: "Jayson-Feguis",
    repos_url: "https://api.github.com/users/Jayson-Feguis/repos",
  };
  const repo: TRepo = {
    id: 3,
    name: "sample-repo",
    description: "Sample Description",
    stargazers_count,
    owner,
  };

  const utils = render(<GithubRepoCard repo={repo} />);
  const card = screen.getByTestId(repo.id);
  const name = screen.getByTestId(repo.name);
  const description = screen.getByTestId(repo.description as string);
  const stargazersCount = screen.getByTestId<HTMLParagraphElement>(
    repo.stargazers_count
  );

  return {
    card,
    name,
    description,
    stargazersCount,
    ...utils,
  };
};

// Tests
describe("Github Repo Card Component", () => {
  it("Should initialize values correctly", async () => {
    const { card, name, description, stargazersCount } = setup(5);

    expect(card).toBeInTheDocument();
    expect(name.innerHTML).toEqual("sample-repo");
    expect(description.innerHTML).toEqual("Sample Description");
    expect(stargazersCount.innerHTML).toEqual(String(5));
  });

  it("Should parse 1600 stargazers count into 1.6k", async () => {
    const { stargazersCount } = setup(1600);

    expect(stargazersCount.innerHTML).toEqual("1.6k");
    expect(stargazersCount.innerHTML).not.toEqual("1600");
  });
});
