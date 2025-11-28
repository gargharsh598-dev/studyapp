import axios from "axios";

export const uploadToCloudinary = async (file) => {
    try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "STUDYAPP");

        const response = await axios.post(
            "https://api.cloudinary.com/v1_1/dhszvdzft/auto/upload",
            formData
        );

        return { success: true, url: response.data.secure_url };
    } catch (err) {
        console.error("Cloudinary upload error:", err);
        return { success: false, error: err.message };
    }
};
