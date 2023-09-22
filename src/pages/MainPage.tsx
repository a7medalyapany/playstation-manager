import Header from "../components/Header";
import ListItem from "../components/ListItem";
import Content from "../components/PageContent";

import imagePath from "../assets/background.png";

import { lables } from "../../common/constants";
import { useAvailabilityToggle } from "../hooks/useAvailabilityToggle";

const MainPage = () => {
  const { showAvailable, toggleShowAvailable } = useAvailabilityToggle(true);

  // Define the names based on the availability state
  const currentName = showAvailable
    ? lables.AvailablePlayStations
    : lables.BusyPlayStations;
  const oppositeName = showAvailable
    ? lables.BusyPlayStations
    : lables.AvailablePlayStations;

  return (
    <div className="w-4/5 h-screen bg-black flex flex-col py-2 gap-y-2 pr-2">
      <Header className="rounded-lg">
        <div className="mb-2">
          <h1 className="text-3xl font-semibold text-white">
            {lables.Welcome}
          </h1>
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              image={imagePath}
              name={oppositeName}
              onToggleClick={toggleShowAvailable}
            />
          </div>
        </div>
      </Header>
      <div className="flex justify-between items-center">
        <h1 className="text-white text-2xl font-semibold">{currentName}</h1>
      </div>
      {/* Scrollable Content */}
      <Content showAvailable={showAvailable} />
    </div>
  );
};

export default MainPage;
