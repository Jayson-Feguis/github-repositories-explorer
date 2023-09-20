import { ListItem, ListItemPrefix } from "@material-tailwind/react";

type Props = {
  length?: number;
};

const GithubUserLoader = ({ length = 5 }: Props) => {
  return Array.from({ length }, (_, i) => (
    <ListItem
      key={i}
      className="skeleton"
      style={{
        opacity: 1 - 0.2 * i,
      }}
    >
      <ListItemPrefix>
        <div className="rounded-full w-[27px] h-[27px] bg-white/50" />
      </ListItemPrefix>
      <div className="rounded-full w-full h-4 bg-white/50" />
    </ListItem>
  ));
};

export default GithubUserLoader;
