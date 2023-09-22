import { IconButton } from "@material-tailwind/react";
import { BsGithub } from "react-icons/bs";
import { BiLogoLinkedin } from "react-icons/bi";

const socials = [
  {
    id: 1,
    title: "Github",
    link: "https://github.com/Jayson-Feguis",
    icon: <BsGithub />,
  },
  {
    id: 2,
    title: "LinkedIn",
    link: "https://www.linkedin.com/in/feguis-jayson-465a88232/",
    icon: <BiLogoLinkedin />,
  },
];

const Footer = () => {
  return (
    <div className="w-full div-center py-10 flex-col">
      <div>
        &copy; {new Date().getFullYear()} &#x2022; Developed by Jayson Feguis
      </div>
      <div className="flex gap-3 sm:justify-center">
        {socials.map((social) => (
          <a key={social.id} href={social.link} target="_blank">
            <IconButton size="sm" color="white" className="text-[24px]">
              {social.icon}
            </IconButton>
          </a>
        ))}
      </div>
    </div>
  );
};

export default Footer;
