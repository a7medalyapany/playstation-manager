import Modal from "../Modal/Modal";
import AddModal from "../Modal/AddModal";

import { BsPlaystation } from "react-icons/bs";
import { AiOutlinePlus } from "react-icons/ai";

import PsListItem from "./PsListItem";

import React, { useEffect, useState } from "react";

import { usePlaystations } from "../../hooks/usePlaystations";

const Library: React.FC = () => {
  const { playstations, getAllPlaystations } = usePlaystations();

  useEffect(() => {
    getAllPlaystations();
  }, []);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className=" flex flex-col ">
      <div
        className="
                flex
                items-center
                justify-between
                px-5
                py-4"
      >
        <div
          className="
                inline-flex
                items-center
                gap-x-2
            "
        >
          <BsPlaystation className="text-neutral-400" size={30} />
          <p
            className="
                    text-md
                    font-medium
                    text-neutral-400
                "
          >
            your playstations
          </p>
        </div>
        <AiOutlinePlus
          onClick={openModal}
          size={20}
          className="
                text-neutral-400
                cursor-pointer
                hover:text-white
                transition
                "
        />
        <Modal
          title="Add a PlayStation"
          description="Upload your data"
          isOpen={isModalOpen}
          onChange={setIsModalOpen}
        >
          <AddModal closeModal={closeModal}></AddModal>
        </Modal>
      </div>
      <div
        className="
            flex
            flex-col
            gap-y-2
            px-3
            mt-4
        "
      >
        {playstations.map((ps) => {
          return <PsListItem key={ps.PlayStationID} ps={ps} />;
        })}
      </div>
    </div>
  );
};
export default Library;
