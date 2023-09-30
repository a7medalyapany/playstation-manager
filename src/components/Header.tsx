import { twMerge } from "tailwind-merge";
import { useNavigate } from "react-router-dom";

import { HiHome } from "react-icons/hi";
import { TbUserEdit } from "react-icons/tb";
import { RxCaretLeft, RxCaretRight } from "react-icons/rx";

interface HeaderProps {
  children?: React.ReactNode;
  className?: string;
}
const Header: React.FC<HeaderProps> = ({ children, className }) => {
  const navigate = useNavigate();
  return (
    <div
      className={twMerge(
        `
      h-fit
      bg-gradient-to-b
      from-red-800
      p-6
      `,
        className
      )}
    >
      <div
        className="w-full  
            mb-4
            flex
            items-center
            justify-between
        "
      >
        <div
          className="
                hidden
                md:flex
                gap-x-2
                items-center
            "
        >
          <button
            onClick={() => navigate(-1)}
            className="
                    rounded-full
                    bg-black
                    flex
                    items-center
                    justify-center
                    hover:opacity-75
                    transition
                "
          >
            <RxCaretLeft className="text-white" size={35} />
          </button>

          <button
            onClick={() => navigate(1)}
            className="
                    rounded-full
                    bg-black
                    flex
                    items-center
                    justify-center
                    hover:opacity-75
                    transition
                "
          >
            <RxCaretRight className="text-white" size={35} />
          </button>
        </div>

        <div
          className="
                flex
                md:hidden
                gap-x-2
                items-center
            "
        >
          <button
            className="
                        rounded-full
                        p-2
                        bg-white
                        flex
                        items-center
                        justify-center
                        hover:opacity-75
                        transition
                    "
          >
            <HiHome className="text-black" size={20} />
          </button>

          <button
            className="
                        rounded-full
                        p-2
                        bg-white
                        flex
                        items-center
                        justify-center
                        hover:opacity-75
                        transition
                    "
          >
            <TbUserEdit className="text-black" size={20} />
          </button>
        </div>
      </div>
      {children}
    </div>
  );
};

export default Header;
