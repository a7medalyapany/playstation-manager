import { IconType } from "react-icons";
import { Link } from "react-router-dom";
import { twMerge } from "tailwind-merge";

interface SidebarItemProps {
  icon: IconType;
  label: string;
  active?: boolean;
  href: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon: Icon,
  label,
  active,
  href,
}) => {
  return (
    <Link
      to={href}
      className={twMerge(
        `
            flex
            flex-row
            h-auto
            w-full
            text-lg
            font-medium
            items-center
            gap-x-4
            cursor-pointer
            hover:text-white
            transition
            text-neutral-400
            py-1

        `,
        active && "text-white"
      )}
    >
      <Icon size={26} />
      <p className="truncate w-full">{label}</p>
    </Link>
  );
};
export default SidebarItem;
