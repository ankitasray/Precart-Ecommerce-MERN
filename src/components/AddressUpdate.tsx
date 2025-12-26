"use client";

import {
  Button,
  Checkbox,
  Dialog,
  DialogBody,
  DialogContent,
  DialogHeader,
  Input,
} from "@jamsr-ui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import { AddressData } from "@/components/AddressCard";
import CountrySelect from "./CountrySelectWithFlags";


interface DrawerProps {
  open: boolean;
  onClose: () => void;
  address?: AddressData | null;
  onSuccess?: () => void; // 🔥 refetch addresses after save
}

const AddressUpdate: React.FC<DrawerProps> = ({
  open,
  onClose,
  address,
  onSuccess,
}) => {
  const [loading, setLoading] = useState(false);
  const [isDefault, setIsDefault] = useState(false);

  const [formValues, setFormValues] = useState({
    label: "",
    recipientName: "",
    street: "",
    city: "",
    state: "",
    postalCode: "",
    country: "",
    phone: "",
  });

  /* ================= PREFILL ================= */
  useEffect(() => {
    if (address) {
      setFormValues({
        label: address.label || "",
        recipientName: address.recipientName || "",
        street: address.street || "",
        city: address.city || "",
        state: address.state || "",
        postalCode: address.postalCode || "",
        country: address.country || "",
        phone: address.phone || "",
      });
      setIsDefault(Boolean(address.isDefault));
    } else {
      setFormValues({
        label: "",
        recipientName: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
        phone: "",
      });
      setIsDefault(false);
    }
  }, [address, open]);

  /* ================= INPUT ================= */
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!formValues.country.trim()) {
      alert("Please select a country");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        ...formValues,
        isDefault,
      };

      // 🔥 UPDATE
      if (address?._id) {
        await axios.put(
          `http://localhost:5000/api/address/${address._id}`,
          payload,
          { withCredentials: true }
        );
      }
      // 🔥 ADD
      else {
        await axios.post(
          "http://localhost:5000/api/address",
          payload,
          { withCredentials: true }
        );
      }

      onSuccess?.(); // refresh address list
      onClose();
    } catch (err) {
      console.error(err);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog isOpen={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent>
        <DialogHeader className="border-b border-neutral-500 text-lg">
          {address ? "Edit Address" : "Add Address"}
        </DialogHeader>

        <DialogBody className="flex flex-col gap-4">
          <Input
            size="lg"
            label="Title"
            name="label"
            value={formValues.label}
            onChange={handleChange}
          />

          <Input
            size="lg"
            label="Full Name"
            name="recipientName"
            value={formValues.recipientName}
            onChange={handleChange}
          />

          {/* COUNTRY */}
          <CountrySelect
            value={formValues.country}
            onChange={(val) =>
              setFormValues((prev) => ({ ...prev, country: val }))
            }
          />

          <Input
            size="lg"
            label="Address"
            name="street"
            value={formValues.street}
            onChange={handleChange}
          />

          <Input
            size="lg"
            label="City"
            name="city"
            value={formValues.city}
            onChange={handleChange}
          />

          <div className="flex gap-4">
            <Input
              size="lg"
              label="State"
              name="state"
              value={formValues.state}
              onChange={handleChange}
            />
            <Input
              size="lg"
              label="Zip Code"
              name="postalCode"
              value={formValues.postalCode}
              onChange={handleChange}
            />
          </div>

          <Input
            size="lg"
            label="Phone"
            name="phone"
            value={formValues.phone}
            onChange={handleChange}
          />

          {/* DEFAULT */}
          <Checkbox
  label="Make this my default address"
  isSelected={isDefault}
  onValueChange={(val: boolean) => setIsDefault(val)}
/>


          <Button onClick={handleSave} disabled={loading} color="primary">
            {loading
              ? "Saving..."
              : address
              ? "Update Address"
              : "Add Address"}
          </Button>

          <Button
            variant="outlined"
            color="danger"
            onClick={onClose}
          >
            Cancel
          </Button>
        </DialogBody>
      </DialogContent>
    </Dialog>
  );
};

export default AddressUpdate;
