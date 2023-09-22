import React, { useState } from "react";
import Modal from "./Modal/Modal";
import EndModal from "./Modal/EndModal";
import ReserveModal from "./Modal/ReserveModal";

export enum ButtonAction {
  Reserve = "Reserve",
  End = "End",
}

interface REButtonProps {
  className?: string;
  action: ButtonAction;
  title?: string;
  description?: string;
  psID: number;
  children?: React.ReactNode;
  onClick?: () => void;
}

const REButton: React.FC<REButtonProps> = ({
  action,
  title,
  description,
  psID,
  children,
  onClick,
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModalToggle = () => {
    if (onClick) {
      onClick();
      closeModal();
    }
  };

  return (
    <div>
      <button
        onClick={openModal}
        className="btn bg-blue-500 text-white hover:bg-blue-700 rounded"
      >
        {action}
      </button>

      <Modal
        isOpen={isModalOpen}
        onChange={setIsModalOpen}
        title={title}
        description={description}
      >
        {action === ButtonAction.Reserve && (
          <ReserveModal onClick={handleModalToggle} />
        )}
        {action === ButtonAction.End && (
          <EndModal onClick={handleModalToggle} id={psID} />
        )}
        {children}
      </Modal>
    </div>
  );
};

export default REButton;
