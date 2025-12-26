"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import AddressCard, { AddressData } from "@/components/AddressCard";
import { Add } from "@/components/svgs";
import AddressUpdate from "@/components/AddressUpdate";

const Page: React.FC = () => {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [defaultAddressId, setDefaultAddressId] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<AddressData | null>(null);
  const [loading, setLoading] = useState(false);

  /* ================= FETCH ADDRESSES ================= */
  const fetchAddresses = async () => {
    try {
      setLoading(true);
      const res = await axios.get(
        "http://localhost:5000/api/address",
        { withCredentials: true }
      );

      const data: AddressData[] = Array.isArray(res.data)
  ? res.data
  : [];

setAddresses(data);


      // set default address
      const defaultAddr = data.find((a) => a.isDefault);
      setDefaultAddressId(defaultAddr?._id || "");
    } catch (err) {
      console.error("Failed to fetch addresses", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  /* ================= HANDLERS ================= */
  const handleOpen = () => {
    setEditingAddress(null);
    setIsOpen(true);
  };

  const handleEdit = (id: string) => {
    const address = addresses.find((addr) => addr._id === id);
    if (address) {
      setEditingAddress(address);
      setIsOpen(true);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await axios.delete(
        `http://localhost:5000/api/address/${id}`,
        { withCredentials: true }
      );
      fetchAddresses();
    } catch (err) {
      console.error("Failed to delete address", err);
    }
  };

  const handleSetAsDefault = async (id: string) => {
  await axios.put(
    `http://localhost:5000/api/address/${id}/default`,
    {},
    { withCredentials: true }
  );
  fetchAddresses();
};


  /* ================= UI ================= */
  return (
    <div className="p-5 w-full min-h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-lg font-semibold">Address</h2>
      </div>

      {loading && <p className="text-sm text-neutral-500">Loading...</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {addresses.map((address) => (
          <AddressCard
            key={address._id}
            address={address}
            isDefault={defaultAddressId === address._id}
            onEdit={handleEdit}
            onRemove={handleRemove}
            onSetAsDefault={handleSetAsDefault}
          />
        ))}

        {!loading && addresses.length === 0 && (
          <p className="text-gray-500 text-sm">No addresses found.</p>
        )}

        {/* ADD CARD */}
        <div
          onClick={handleOpen}
          className="min-w-[300px] group border border-dashed rounded-2xl border-neutral-500 h-[215px] flex items-center justify-center cursor-pointer"
        >
          <div>
            <Add className="w-10 h-10 text-neutral-500 mx-auto" />
            <p className="text-sm group-hover:text-blue-400">
              Add address
            </p>
          </div>
        </div>
      </div>

      {/* MODAL */}
      {isOpen && (
        <AddressUpdate
          open={isOpen}
          onClose={() => setIsOpen(false)}
          address={editingAddress}
          onSuccess={fetchAddresses} // 🔥 refetch after save
        />
      )}
    </div>
  );
};

export default Page;
