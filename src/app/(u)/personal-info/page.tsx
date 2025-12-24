"use client";

import { FileUpload } from "@/components/svgs";
import {
  Avatar,
  Button,
  Card,
  CardHeader,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTrigger,
  Input,
  Text,
} from "@jamsr-ui/react";
import AuthenticationCard from "@/components/AuthenticationCard";
import axios from "axios";
import { useEffect, useState,useRef } from "react";

type User = {
  name: string;
  email: string;
  avatar?: string;
};

type CollapsibleState = Record<number, boolean>;

const Page = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [editMode, setEditMode] = useState<CollapsibleState>({});
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [deleting, setDeleting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);


  const avatarUrl = user?.avatar
  ? `http://localhost:5000${user.avatar}?t=${Date.now()}`
  : "https://i.pravatar.cc/300";


  /* ================= FETCH USER ================= */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/auth/me",
          { withCredentials: true }
        );

        const userData = res.data.user;
        setUser(userData);
        setInputValues({
          1: userData.name,
          2: userData.email,
        });
      } catch (err) {
        console.error("User not logged in", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, []);

  /* ================= HELPERS ================= */
  const handleEditToggle = (id: number) => {
    setEditMode((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const handleInputChange = (id: number, value: string) => {
    setInputValues((prev) => ({ ...prev, [id]: value }));
  };

  const handleSave = async () => {
    try {
      const payload = {
        name: inputValues[1],
        email: inputValues[2],
      };

      const res = await axios.patch(
        "http://localhost:5000/api/auth/profile",
        payload,
        { withCredentials: true }
      );

      setUser(res.data.user);
      setEditMode({});
      alert("Profile updated successfully");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  /* ================= AVATAR UPLOAD ================= */
  const handlePhotoUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      setUploading(true);

      const res = await axios.patch(
        "http://localhost:5000/api/auth/avatar",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      setUser(res.data.user);
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  /* ================= DELETE ACCOUNT ================= */
  const handleDeleteAccount = async () => {
    try {
      setDeleting(true);

      await axios.delete(
        "http://localhost:5000/api/auth/delete-account",
        { withCredentials: true }
      );

      window.location.replace("/login");
    } catch (err: any) {
      alert(err.response?.data?.message || "Failed to delete account");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) return <p className="p-5">Loading profile...</p>;
  if (!user) return <p className="p-5 text-red-500">Not logged in</p>;

  return (
    <div className="p-5 w-full">
      {/* ================= AVATAR ================= */}
   <div className="p-2 pb-3 flex items-center gap-3 border-b border-neutral-500">
  <Avatar
    alt="profile"
    className="h-[70px] w-[70px]"
    src={avatarUrl}
  />

  <input
    ref={fileInputRef}
    type="file"
    accept="image/*"
    hidden
    onChange={handlePhotoUpload}
  />

  <Button
    variant="outlined"
    startContent={<FileUpload />}
    disabled={uploading}
    onClick={() => fileInputRef.current?.click()}
  >
    {uploading ? "Uploading..." : "Upload Photo"}
  </Button>
</div>



      {/* ================= PROFILE FIELDS ================= */}
      {[{ id: 1, label: "Name" }, { id: 2, label: "Email" }].map((item) => {
        const isEditing = editMode[item.id] || false;
        return (
          <div
            key={item.id}
            className="border-b border-neutral-500 p-4 flex justify-between"
          >
            <div className="w-1/2">
              <h1 className="mb-2">{item.label}</h1>
              <Input
                value={inputValues[item.id] || ""}
                disabled={!isEditing}
                onChange={(e) =>
                  handleInputChange(item.id, e.target.value)
                }
              />
            </div>
            <div className="flex gap-2">
              {isEditing && (
                <Button onClick={handleSave}>Save</Button>
              )}
              <Button
                variant="text"
                onClick={() => handleEditToggle(item.id)}
              >
                {isEditing ? "Cancel" : "Edit"}
              </Button>
            </div>
          </div>
        );
      })}

      {/* ================= 2FA ================= */}
      <div className="border-b border-neutral-500 p-4">
        <Card className="bg-transparent border-none">
          <CardHeader
            heading="Two-factor authentication"
            subHeading="Add an extra layer of security"
            endContent={
              <Dialog>
                <DialogTrigger>
                  <Button variant="text">Turn On</Button>
                </DialogTrigger>
                <DialogContent>
                  <AuthenticationCard />
                </DialogContent>
              </Dialog>
            }
          />
        </Card>
      </div>

      {/* ================= DELETE ACCOUNT ================= */}
      <div className="p-4">
        <Card className="bg-transparent border-none">
          <CardHeader
            heading="Delete your account"
            subHeading="This action is permanent and cannot be undone"
            endContent={
              <Dialog>
                <DialogTrigger>
                  <Button color="danger" variant="text">
                    Delete Account
                  </Button>
                </DialogTrigger>

                <DialogContent>
                  <DialogHeader />
                  <div className="px-4 py-3">
                    <Text as="h3" variant="h4">
                      Are you absolutely sure?
                    </Text>
                    <Text as="p">
                      This will permanently delete your account and all
                      associated data. This action cannot be undone.
                    </Text>
                  </div>

                  <DialogFooter>
                    <DialogTrigger action="close">
                      <Button variant="text">Cancel</Button>
                    </DialogTrigger>
                    <Button
                      color="danger"
                      disabled={deleting}
                      onClick={handleDeleteAccount}
                    >
                      {deleting ? "Deleting..." : "Confirm Delete"}
                    </Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            }
          />
        </Card>
      </div>
    </div>
  );
};

export default Page;
