import { Playstation } from "../types";
import REButton, { ButtonAction } from "./REButton";

interface CardProps {
  ps: Playstation;
  className?: string;
  onReserve: () => void;
  onEnd: () => void;
}

const Card: React.FC<CardProps> = ({ ps, onReserve, onEnd }) => {
  return (
    <div
      className="
        relative
        group
        flex
        flex-col
        justify-center
        items-center
        rounded-md
        overflow-hidden
        gap-x-4
        bg-neutral-400/5
        cursor-pointer
        hover:bg-neutral-400/10
        transition
        p-3
    "
    >
      <div
        className="
       relative
       aspect-square
       w-full
       h-full
       rounded-md
       overflow-hidden
      "
      >
        <img
          className="object-cover"
          src="src/assets/photo1.jpg"
          alt="PS Image"
        />
      </div>
      <div
        className="
        flex
        flex-col
        items-start
        w-full
        pt-4
        gap-y-1
      "
      >
        <p className="font-semibold truncate w-full">{ps.PlayStationName}</p>
        <pre className="text-neutral-400 text-sm pb-4 w-full truncate">
          {ps.PlayStationType}, blast it in Room {ps.PlayStationID}
        </pre>
      </div>
      <div className="absolute bottom-24 flex justify-center items-center">
        <REButton
          action={ps.IsAvailable ? ButtonAction.Reserve : ButtonAction.End}
          title={
            ps.IsAvailable
              ? `Reserve ${ps.PlayStationName}`
              : `End ${ps.PlayStationName} Session`
          }
          description={
            ps.IsAvailable ? "Enter the number of players" : "Hope you had fun!"
          }
          onClick={ps.IsAvailable ? onReserve : onEnd}
          psID={ps.PlayStationID}
        />
      </div>
    </div>
  );
};

export default Card;
