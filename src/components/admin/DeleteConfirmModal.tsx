"use client";

import { Button } from "@jamsr-ui/react";

type Props = {
  open: boolean;
  title?: string;
  description?: string;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function DeleteConfirmModal({
  open,
  title = "Delete Product",
  description = "Are you sure you want to delete this product? This action cannot be undone.",
  onCancel,
  onConfirm,
}: Props) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60"
        onClick={onCancel}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-md rounded-lg bg-neutral-900 border border-neutral-800 p-6">
        <h2 className="text-lg font-semibold mb-2">{title}</h2>

        <p className="text-sm text-neutral-400 mb-6">
          {description}
        </p>

        <div className="flex justify-end gap-3">
          <Button variant="outlined" onClick={onCancel} className="
    bg-white
    text-black
    hover:bg-neutral-200
    border
    border-white
  ">
            Cancel
          </Button>

          <Button color="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}
