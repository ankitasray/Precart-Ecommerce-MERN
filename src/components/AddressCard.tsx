"use client";

import { useTheme } from "@/context/ThemeContext";
import { Chip } from "@jamsr-ui/react";
import React from "react";

export type AddressData = {
  _id: string;
  label: string;
  recipientName: string;
  street: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
};

export type AddressCardProps = {
  address: AddressData;
  isDefault?: boolean;
  onEdit?: (id: string) => void;
  onRemove?: (id: string) => void;
  onSetAsDefault?: (id: string) => void;
};

const AddressCard: React.FC<AddressCardProps> = ({
  address,
  isDefault = false,
  onEdit,
  onRemove,
  onSetAsDefault,
}) => {
  const { theme } = useTheme();

  return (
    <div
      className={`rounded-2xl p-2 ${
        theme === "light" ? "bg-neutral-100" : "bg-zinc-800"
      }`}
    >
      <div
        className={`rounded-2xl py-4 px-3 ${
          theme === "light" ? "bg-white" : "bg-black"
        }`}
      >
        <div className="flex justify-between items-center mb-2">
          <h1 className="font-medium">{address.label}</h1>
          {isDefault && (
            <Chip variant="outlined" color="primary" size="sm">
              Default
            </Chip>
          )}
        </div>

        <p className="text-sm leading-5">
          {address.recipientName} <br />
          {address.street} <br />
          {address.city}, {address.state} {address.postalCode} <br />
          {address.country} <br />
          {address.phone}
        </p>
      </div>

      <div className="flex justify-center gap-3 p-2 text-sm">
        <button
          onClick={() => onEdit?.(address._id)}
          className="hover:underline hover:text-blue-400"
        >
          Edit
        </button>

        <div className="w-px h-4 bg-neutral-500" />

        <button
          disabled={isDefault}
          onClick={() => onRemove?.(address._id)}
          className={
            isDefault ? "text-neutral-400" : "hover:underline hover:text-blue-400"
          }
        >
          Remove
        </button>

        <div className="w-px h-4 bg-neutral-500" />

        <button
          disabled={isDefault}
          onClick={() => onSetAsDefault?.(address._id)}
          className={
            isDefault ? "text-neutral-400" : "hover:underline hover:text-blue-400"
          }
        >
          Set as default
        </button>
      </div>
    </div>
  );
};

export default AddressCard;
