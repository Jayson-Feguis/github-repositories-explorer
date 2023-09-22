import {
  Typography,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
} from "@material-tailwind/react";
import { TRepo } from "../../types/global";
import { forwardRef, Ref } from "react";
import { TbStarFilled } from "react-icons/tb";
import numeral from "numeral";

type Props = {
  repo: TRepo;
};

const GithubRepoCard = forwardRef(
  ({ repo }: Props, ref: Ref<HTMLDivElement>) => {
    const { id, name = "", description = "", stargazers_count = 0 } = repo;

    return (
      <ListItem ref={ref} data-testid={id}>
        <ListItemPrefix className="flex items-start flex-col line-clamp-1">
          <Typography data-testid={name} variant="h6" className="!line-clamp-1">
            {name}
          </Typography>
          <Typography
            data-testid={description}
            variant="paragraph"
            className="!line-clamp-1"
          >
            {description || "No description"}
          </Typography>
        </ListItemPrefix>
        <ListItemSuffix>
          <div className="flex items-center gap-1 ">
            <Typography
              variant="small"
              className="font-bold"
              data-testid={stargazers_count}
            >
              {Number(stargazers_count) > 999
                ? numeral(stargazers_count).format("0.0a")
                : stargazers_count}
            </Typography>
            <div className="text-xl text-yellow-800">
              <TbStarFilled />
            </div>
          </div>
        </ListItemSuffix>
      </ListItem>
    );
  }
);

export default GithubRepoCard;
