import axios from "axios";

export const uploadImage = async (file: File) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "YOUR_PRESET"); // cloudinary preset

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
    formData
  );

  return res.data.secure_url as string;
};
