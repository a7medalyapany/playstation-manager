import { RootState } from "../../Redux/store";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedValue } from "../../Redux/slices/selectedValueSlice";

interface ReserveButtonProps {
  onClick?: () => void;
}

const ReserveModal: React.FC<ReserveButtonProps> = ({ onClick }) => {
  const dispatch = useDispatch();
  const selectedValue = useSelector((state: RootState) => state.selectedValue);

  const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = Number(event.target.value);
    dispatch(setSelectedValue(newValue));
  };

  return (
    <>
      <input
        type="range"
        min="1"
        max="4"
        value={selectedValue}
        onChange={handleValueChange}
        className="range"
        step="1"
      />
      <div className="w-full flex justify-between text-xs px-2">
        <span>|</span>
        <span>|</span>
        <span>|</span>
        <span>|</span>
      </div>
      <p
        className="
            text-white
            text-center
            font-semibold
            text-2xl
            mt-2
            "
      >
        Selected: {selectedValue}
      </p>
      <button
        onClick={onClick}
        id="save"
        className="btn mt-4 w-full bg-neutral-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
      >
        Save
      </button>
    </>
  );
};

export default ReserveModal;
