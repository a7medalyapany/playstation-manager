import { Playstation } from "../../types";

interface PsListItemProps {
  ps: Playstation;
}

const PsListItem: React.FC<PsListItemProps> = ({ ps }) => {
  const indicatorColorClass = ps.IsAvailable
    ? "bg-gradient-to-br from-green-600 to-green-900"
    : "bg-gradient-to-br from-red-700 to-red-900";

  const indicatorOpacityClass = ps.IsAvailable
    ? "bg-gradient-to-br from-green-400 to-green-600"
    : "bg-gradient-to-br from-red-400 to-red-600";

  return (
    <div
      className="
            flex
            items-center
            gap-x-3
            cursor-pointer
            hover:bg-neutral-800/50
            w-full
            p-2
            rounded-md
            "
    >
      <div
        className="
                relative
                rounded-md
                min-h-[48px]
                min-w-[48px]
                overflow-hidden
                "
      >
        <img
          src="src/assets/photo1.jpg"
          alt="PlayStation Image"
          className="object-cover max-h-[150px] max-w-[80px]"
        />
      </div>
      <div
        className="
            flex
            flex-col
            gap-y-1
            overflow-hidden
            "
      >
        <p
          className="
                text-white truncate"
        >
          {ps.PlayStationName}
        </p>
        <p
          className="
                text-neutral-400 text-sm truncate"
        >
          Room {ps.PlayStationID}
        </p>
      </div>
      <div className={`relative w-3 h-3 ml-5`}>
        <div
          className={`absolute w-full h-full ${indicatorColorClass} rounded-full shadow-md`}
        ></div>
        <div
          className={`absolute w-full h-full ${indicatorOpacityClass} rounded-full opacity-75`}
        ></div>
      </div>
    </div>
  );
};

export default PsListItem;
