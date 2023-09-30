import Button from "../Button";

import { useState } from "react";

import toast from "react-hot-toast";

import PasswordInput from "../PasswordInput";

import { PlaystationType } from "../../types";

import { usePlaystations } from "../../hooks/usePlaystations";
import { confirmPassword } from "../../functions/confirmByPass";

interface AddModalProps {
  closeModal: () => void;
}
const AddModal: React.FC<AddModalProps> = ({ closeModal }) => {
  const [passValue, setPassValue] = useState("");
  const [selectedType, setSelectedType] = useState<PlaystationType>(
    PlaystationType.PS4
  );

  const { createPlaystation } = usePlaystations();

  const handleCreatePlayStation = async (password: string) => {
    if (confirmPassword(password)) {
      try {
        await createPlaystation(selectedType);
        toast.success("PlayStation created successfully!");
        closeModal();
      } catch (error) {
        toast.error("Error creating PlayStation");
      }
    } else {
      toast.error("Invaild Password, pls try again");
    }
  };

  return (
    <div className="">
      <select
        className="select select-info w-full max-w mb-5 bg-neutral-900"
        onChange={(e) => setSelectedType(e.target.value as PlaystationType)}
        value={selectedType}
      >
        <option disabled>Select PlayStation Type</option>
        <option value={PlaystationType.PS3}>Playstation 3</option>
        <option value={PlaystationType.PS4}>Playstation 4</option>
        <option value={PlaystationType.PS5}>Playstation 5</option>
      </select>
      <div className="ml-10">
        <PasswordInput
          label="Confirm by password"
          value={passValue}
          onChange={(e) => setPassValue(e.target.value)}
          className="p-2 bg-neutral-900 rounded-lg text-white w-full items-center"
        />
      </div>
      <Button
        type="button"
        onClick={() => handleCreatePlayStation(passValue)}
        className=" mt-5 bg-gradient-to-r from-[#295E8A] via-[#2F4663] to-[#1A3A58] hover:from-[#7A1A24] hover:via-[#AC1E28] hover:to-[#AD1A29] transition-all duration-300"
      >
        Create
      </Button>
    </div>
  );
};
export default AddModal;
