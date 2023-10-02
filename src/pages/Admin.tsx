import { useState } from "react";

import toast from "react-hot-toast";

import Ops from "../components/Ops";
import Header from "../components/Header";
import Button from "../components/Button";
import PasswordInput from "../components/PasswordInput";

import { confirmPassword } from "../functions/confirmByPass";

import { PlaystationType } from "../types";
import { IPC } from "../../common/constants";

function Admin() {
  const [cPass, setCPass] = useState("");
  const [newPass, setNewPass] = useState("");
  const [passValue, setPassValue] = useState("");
  const [deleteValue, setDeleteValue] = useState("");
  const [NewPrice, setNewPrice] = useState<number>(0);
  const [selectedType, setSelectedType] = useState<PlaystationType>(
    PlaystationType.PS4
  );

  const commonInputStyles = "p-2 bg-neutral-800 rounded-lg text-white w-5/6";
  const commonButtonStyles = "w-96 rounded-md";
  const commonOpsStyles = "flex flex-col p-2 m-1 gap-2 items-center";

  const deleteOp = async (psName: string, password: string) => {
    if (await confirmPassword(password)) {
      window.ipcRenderer
        .invoke(IPC.Delete, { PlayStationName: psName })
        .then((res) => {
          if (res.code === 1) {
            toast.success("Playstation deleted successfully");
          } else {
            toast.error("Error");
          }
        });
    } else {
      toast.error("Invaild Password, pls try again");
    }
  };

  const resetOp = async (password: string) => {
    if (await confirmPassword(password)) {
      window.ipcRenderer.invoke(IPC.Reset).then((res) => {
        if (res.code === 1) {
          toast.success("The entire data has been deleted");
        } else {
          toast.error("Error");
        }
      });
    } else {
      toast.error("Invaild Password, pls try again");
    }
  };

  const updatePriceOp = async (
    psType: PlaystationType,
    newPrice: number,
    password: string
  ) => {
    if (await confirmPassword(password)) {
      window.ipcRenderer
        .invoke(IPC.UpdatePrice, {
          PlayStationType: psType,
          NewPrice: newPrice,
        })
        .then((res) => {
          if (res.code === 1) {
            toast.success("Price updated successfully");
          } else {
            toast.error("Error");
          }
        });
    } else {
      toast.error("Invaild Password, pls try again");
    }
  };

  const updatePasswordOp = async (
    oldPassword: string,
    password: string,
    cPassword: string
  ) => {
    if (await confirmPassword(oldPassword)) {
      if (password === cPassword) {
        window.ipcRenderer
          .invoke(IPC.UpdataPassword, { newPassword: password })
          .then((res) => {
            if (res.code === 1) {
              toast.success("password updated successfully");
            } else {
              toast.error("Error");
            }
          });
      } else {
        toast.error("Passwords don't match, try again.");
        return false;
      }
    } else {
      toast.error("Invaild old Password, pls try again");
    }
  };

  return (
    <div className="w-4/5 h-screen bg-black flex flex-col py-2 gap-y-2 pr-2">
      <Header className="rounded-lg">
        <div className="mb-2 text-center">
          <h1 className="text-3xl font-semibold text-white">Change Settings</h1>
          <p className="text-neutral-600 text-lg m-2">
            change your settings while no PlayStation is in busy mode to avoid
            any problems!
          </p>
        </div>
      </Header>
      <div className="flex-grow overflow-y-auto bg-gradient-to-t to-black from-neutral-900 rounded-t-none rounded-b-lg">
        <Ops title="Delete">
          <div className={commonOpsStyles}>
            <input
              type="text"
              name="delete"
              placeholder="Example: PS4-R1"
              className={commonInputStyles}
              value={deleteValue}
              onChange={(e) => setDeleteValue(e.target.value)}
            />
            <PasswordInput
              label="Confirm by password"
              value={passValue}
              onChange={(e) => setPassValue(e.target.value)}
            />
            <Button
              className={`bg-red-700 ${commonButtonStyles}`}
              onClick={() => deleteOp(deleteValue, passValue)}
            >
              Delete
            </Button>
          </div>
        </Ops>
        <Ops title="Update Prices">
          <div className={commonOpsStyles}>
            <select
              onChange={(e) =>
                setSelectedType(e.target.value as PlaystationType)
              }
              value={selectedType}
              className={`select select-info ${commonInputStyles}`}
            >
              <option disabled>Select PlayStation Type</option>
              <option value={PlaystationType.PS3}>Playstation 3</option>
              <option value={PlaystationType.PS4}>Playstation 4</option>
              <option value={PlaystationType.PS5}>Playstation 5</option>
            </select>
            <input
              type="number"
              min={0}
              step={5}
              placeholder="Enter new price"
              className={commonInputStyles}
              onChange={(e) => setNewPrice(parseInt(e.target.value))}
            />
            <PasswordInput
              label="Confirm by password"
              value={passValue}
              onChange={(e) => setPassValue(e.target.value)}
            />
            <Button
              className={`bg-green-700 ${commonButtonStyles}`}
              onClick={() => updatePriceOp(selectedType, NewPrice, passValue)}
            >
              Update
            </Button>
          </div>
        </Ops>
        <Ops title="Update Password">
          <div className={commonOpsStyles}>
            <PasswordInput
              label="Enter old password"
              onChange={(e) => setPassValue(e.target.value)}
              value={passValue}
            />
            <PasswordInput
              label="Enter new password"
              onChange={(e) => setNewPass(e.target.value)}
              value={newPass}
            />
            <PasswordInput
              label="Confirm new password"
              onChange={(e) => setCPass(e.target.value)}
              value={cPass}
            />
            <Button
              className={`bg-green-700 ${commonButtonStyles}`}
              onClick={() => updatePasswordOp(passValue, newPass, cPass)}
            >
              Update
            </Button>
          </div>
        </Ops>
        <Ops title="Reset All">
          <div className={commonOpsStyles}>
            <PasswordInput
              label="Confirm by password"
              value={passValue}
              onChange={(e) => setPassValue(e.target.value)}
            />
            <Button
              className={`bg-red-700 ${commonButtonStyles}`}
              onClick={() => resetOp(passValue)}
            >
              Reset All
            </Button>
          </div>
        </Ops>
      </div>
    </div>
  );
}

export default Admin;
