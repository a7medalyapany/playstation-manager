import Header from "../components/Header";
import ListItem from "../components/ListItem";
import Content from "../components/PageContent";

import { lables } from "../../common/constants";
import imagePath from "../../src/assets/logo.png";

import { useAvailabilityToggle } from "../hooks/useAvailabilityToggle";

const MainPage = () => {
  const { showAvailable, toggleShowAvailable } = useAvailabilityToggle(true);

  const currentName = showAvailable
    ? lables.AvailablePlayStations
    : lables.BusyPlayStations;
  const oppositeName = showAvailable
    ? lables.BusyPlayStations
    : lables.AvailablePlayStations;

  return (
    <div className="w-4/5 h-screen bg-black flex flex-col py-2 gap-y-2 pr-2">
      <Header className="rounded-lg">
        <div className="mb-2 flex flex-col justify-between items-center">
          <div className="flex  grid-cols-2 sm:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-3 mt-4">
            <ListItem
              image={imagePath}
              name={oppositeName}
              onToggleClick={toggleShowAvailable}
            />
          </div>
        </div>
      </Header>
      <div className="flex justify-between">
        <h1 className="text-white text-2xl font-semibold">{currentName}</h1>
      </div>
      <Content showAvailable={showAvailable} />
    </div>
  );
};

export default MainPage;
