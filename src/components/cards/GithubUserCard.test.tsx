import { render, screen, fireEvent } from "@testing-library/react";

// To Test
import { GithubUserCard } from "..";
import { TUser } from "../../types/global";

// Setup
const setup = (active: string, onClick: any = jest.fn()) => {
  const user: TUser = {
    id: 1,
    avatar_url: "https://avatars.githubusercontent.com/u/100183426?v=4",
    login: "Jayson-Feguis",
    repos_url: "https://api.github.com/users/Jayson-Feguis/repos",
  };
  const utils = render(
    <GithubUserCard user={user} active={active} onClick={onClick} />
  );
  const card = screen.getByTestId(user.id);
  const avatar = screen.getByTestId<HTMLImageElement>(user.avatar_url);
  const username = screen.getByTestId(user.login);
  return {
    card,
    avatar,
    username,
    user,
    ...utils,
  };
};

// Tests
describe("Github User Card Component", () => {
  it("Should initialize values correctly", async () => {
    const { card, avatar, username, user } = setup("Jayson-Feguis");

    expect(card).toBeInTheDocument();
    expect(avatar.src).toEqual(user.avatar_url);
    expect(avatar.src).not.toEqual(user.login);
    expect(username.innerHTML).not.toEqual(user.avatar_url);
    expect(username.innerHTML).toEqual(user.login);
  });

  it("Should get the user value from the callback onClick if the component is clicked", async () => {
    let onClickResult: any;
    const onClick = (userResult: TUser) => {
      onClickResult = userResult;
    };
    const { card } = setup("Jayson-Feguis", (user: TUser) => onClick(user));

    expect(onClickResult).toBeUndefined();

    fireEvent.click(card);

    expect(onClickResult).not.toBeUndefined();
    expect(onClickResult.id).toEqual(1);
    expect(onClickResult.login).toEqual("Jayson-Feguis");
    expect(onClickResult.avatar_url).toEqual(
      "https://avatars.githubusercontent.com/u/100183426?v=4"
    );
    expect(onClickResult.repos_url).toEqual(
      "https://api.github.com/users/Jayson-Feguis/repos"
    );
  });
});
