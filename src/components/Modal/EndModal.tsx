import { useSession } from "../../hooks/getSession";

interface EndButtonProps {
  onClick?: () => void;
  id: number;
}

const EndModal: React.FC<EndButtonProps> = ({ onClick, id }) => {
  const { totalAmount, formattedDuration } = useSession(id);
  return (
    <>
      <p className="text-white text-center font-semibold text-2xl">
        Price of the session is: {totalAmount}
        {/* Price of the session is: {TotalPrice} */}
      </p>
      <p className="text-grey-500 text-center font-normal text-lg">
        spent time: {formattedDuration}
        {/* spent time: {SpentTime} */}
      </p>
      <button
        onClick={onClick}
        id="end"
        className="btn mt-4 w-full bg-neutral-500 hover:bg-blue-600 text-white font-semibold py-2 rounded"
      >
        End Session
      </button>
    </>
  );
};

export default EndModal;
