import { useState } from "react";
import { BiShow } from "react-icons/bi";

interface ListItemProps {
  image: string;
  name: string;
  onToggleClick: () => void;
}
const ListItem: React.FC<ListItemProps> = ({ image, name, onToggleClick }) => {
  const [isRed, setIsRed] = useState(true);

  const onClick = () => {
    onToggleClick();
    setIsRed((prev) => !prev);
  };

  return (
    <button
      onClick={onClick}
      className="
        relative
        group
        flex
        items-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-100/10
        hover:bg-neutral-100/20
        transition
        min-w-[350px]
        pr-4
        "
    >
      <div
        className="
            relative
            min-h-[64px]
            min-w-[64px]
            "
      >
        <img className="object-cover w-24 h-auto" src={image} alt="Image" />
      </div>
      <p className="font-medium truncate py-5">{name}</p>
      <div
        className={`
                ${isRed ? "bg-red-600" : "bg-green-600"}
                absolute
                transition
                opcacity-0
                rounded-full
                flex
                items-center
                justify-center
                p-4
                drop-shadow-md
                right-5
                group-hover:opacity-100
                hover:scale-110
        `}
      >
        <BiShow className="text-black" />
      </div>
    </button>
  );
};

export default ListItem;
