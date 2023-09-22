import { Avatar, Typography } from "@material-tailwind/react";
import { TUser } from "../../types/global";

type Props = {
  user: TUser;
};

const SelectedGithubUser = ({ user }: Props) => {
  return (
    <div data-testid={user?.id} className="flex items-center gap-4">
      <Avatar
        data-testid={user?.avatar_url}
        src={user?.avatar_url}
        alt="avatar"
      />
      <div>
        <Typography data-testid={user?.login} variant="h6">
          {user?.login}
        </Typography>
      </div>
    </div>
  );
};

export default SelectedGithubUser;
