import React, { useState } from "react";

import { twMerge } from "tailwind-merge";

import { FiEye } from "react-icons/fi";
import { FiEyeOff } from "react-icons/fi";

interface PasswordInputProps {
  label: string;
  value?: string;
  className?: string;
  onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
}
const PasswordInput: React.FC<PasswordInputProps> = ({
  label,
  onChange,
  className,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="relative w-5/6">
      <input
        required
        placeholder={label}
        type={showPassword ? "text" : "password"}
        onChange={onChange}
        className={twMerge(
          `p-2 bg-neutral-800 rounded-lg text-white w-full`,
          className
        )}
      />
      <button
        className="absolute top-1/2 right-4 transform -translate-y-1/2"
        onClick={togglePasswordVisibility}
      >
        {showPassword ? <FiEyeOff size={20} /> : <FiEye size={20} />}
      </button>
    </div>
  );
};

export default PasswordInput;
