import { Avatar, Typography } from "@material-tailwind/react";
import { TUser } from "../types/global";
import _ from "lodash";

type Props = {
  user: TUser;
};

const SelectedGithubUser = ({ user }: Props) => {
  return (
    !_.isNil(user) && (
      <div className="flex items-center gap-4">
        <Avatar src={user?.avatar_url} alt="avatar" />
        <div>
          <Typography variant="h6">{user?.login}</Typography>
        </div>
      </div>
    )
  );
};

export default SelectedGithubUser;
