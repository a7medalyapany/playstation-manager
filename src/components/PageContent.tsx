import { Key, useEffect } from "react";

import { Playstation } from "../types";

import Card from "./Card";

import toast from "react-hot-toast";
import { useSelector } from "react-redux";
import { RootState } from "../Redux/store";
import { usePlaystations } from "../hooks/usePlaystations";

interface ContentProps {
  showAvailable: boolean;
}

const Content: React.FC<ContentProps> = ({ showAvailable }) => {
  const { playstations, getAllPlaystations, reserveSession, endSession } =
    usePlaystations();

  useEffect(() => {
    getAllPlaystations();
  }, []);

  const selectedValue = useSelector((state: RootState) => state.selectedValue);

  const filteredPlaystations = playstations.filter((ps) => {
    const IsAvailable = ps.IsAvailable;
    return showAvailable ? IsAvailable : !IsAvailable;
  });

  const handleReserve = (PlayStationID: Key | number) => {
    try {
      reserveSession(PlayStationID, selectedValue);
      toast.success("Mission done successfully!");
    } catch (error) {
      toast.error("Error!");
      console.log(error);
    }
  };

  const handleEnd = (PlayStationID: Key | number) => {
    try {
      endSession(PlayStationID);
      toast.success("Mission done successfully!");
    } catch (error) {
      toast.error("Error!");
      console.log(error);
    }
  };

  return (
    <div className="flex-grow bg-gradient-to-b from-black to-neutral-900 rounded-t-none rounded-b-lg overflow-y-auto">
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-8 gap-4 mt-4">
        {filteredPlaystations.map((playstation: Playstation) => (
          <Card
            key={playstation.PlayStationID}
            ps={playstation}
            onReserve={() => handleReserve(playstation.PlayStationID)}
            onEnd={() => handleEnd(playstation.PlayStationID)}
          />
        ))}
      </div>
    </div>
  );
};

export default Content;
