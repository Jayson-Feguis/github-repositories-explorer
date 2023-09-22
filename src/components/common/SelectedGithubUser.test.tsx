import { render, screen } from "@testing-library/react";
// import user from "@testing-library/user-event";

// To Test
import { SelectedGithubUser } from "..";
import { TUser } from "../../types/global";

// Tests
describe("Selected Github User Component", () => {
  it("Should initialize values correctly", async () => {
    const user: TUser = {
      id: 1,
      avatar_url: "https://avatars.githubusercontent.com/u/100183426?v=4",
      login: "Jayson-Feguis",
      repos_url: "https://api.github.com/users/Jayson-Feguis/repos",
    };
    render(<SelectedGithubUser user={user} />);
    const selectedGithubUserComponent = screen.getByTestId(1);
    const avatarComponent = screen.getByTestId<HTMLImageElement>(
      "https://avatars.githubusercontent.com/u/100183426?v=4"
    );
    const usernameComponent = screen.getByTestId("Jayson-Feguis");

    expect(selectedGithubUserComponent).toBeInTheDocument();
    expect(avatarComponent.src).toBe(user.avatar_url);
    expect(avatarComponent.src).not.toBe(user.login);
    expect(usernameComponent.innerHTML).not.toBe(user.avatar_url);
    expect(usernameComponent.innerHTML).toBe(user.login);
  });
});
