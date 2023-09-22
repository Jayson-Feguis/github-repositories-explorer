import {
  Avatar,
  Typography,
  ListItem,
  ListItemPrefix,
} from "@material-tailwind/react";
import { TUser } from "../../types/global";
import _ from "lodash";

type Props = {
  user: TUser;
  onClick: (user: TUser) => void;
  active?: string;
};

const GithubUserCard = ({ user, onClick, active }: Props) => {
  return (
    <ListItem
      data-testid={user.id}
      onClick={() => onClick(user as TUser)}
      className={_.isEqual(active, user.login) ? "bg-blue-gray-400/10" : ""}
    >
      <ListItemPrefix>
        <Avatar
          data-testid={user.avatar_url}
          src={user.avatar_url}
          alt={user?.login}
          size="xs"
        />
      </ListItemPrefix>
      <Typography data-testid={user.login}>{user?.login}</Typography>
    </ListItem>
  );
};

export default GithubUserCard;
