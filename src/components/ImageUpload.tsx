import React, { useState } from "react";

interface ImageUploadProps {
  setImage: (file: File | null) => void;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ setImage }) => {
  const [preview, setPreview] = useState<string | null>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setPreview(null);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  return (
    <div>
      <label className="block font-firago font-medium text-[14px] text-customGreySecondary">
        ავატარი*
      </label>
      <div
        className={`w-[788px] h-[120px] border-2 border-dashed border-gray-300 rounded-lg mt-2 flex items-center justify-center ${
          preview ? "justify-center p-2" : ""
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt="Uploaded Preview"
              className="w-[100px] h-[100px] rounded-md object-cover"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute -bottom-2 -right-2 bg-white p-1 rounded-full border border-gray-300"
            >
              <svg
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <circle
                  cx="12"
                  cy="12"
                  r="11.5"
                  fill="white"
                  stroke="#021526"
                />
                <path
                  d="M6.75 8.5H7.91667H17.25"
                  stroke="#021526"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M16.0834 8.50033V16.667C16.0834 16.9764 15.9605 17.2732 15.7417 17.492C15.5229 17.7107 15.2262 17.8337 14.9167 17.8337H9.08341C8.774 17.8337 8.47725 17.7107 8.25846 17.492C8.03966 17.2732 7.91675 16.9764 7.91675 16.667V8.50033M9.66675 8.50033V7.33366C9.66675 7.02424 9.78966 6.72749 10.0085 6.5087C10.2272 6.28991 10.524 6.16699 10.8334 6.16699H13.1667C13.4762 6.16699 13.7729 6.28991 13.9917 6.5087C14.2105 6.72749 14.3334 7.02424 14.3334 7.33366V8.50033"
                  stroke="#021526"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M10.8333 11.417V14.917"
                  stroke="#021526"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M13.1667 11.417V14.917"
                  stroke="#021526"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        ) : (
          <label className="cursor-pointer flex flex-col items-center justify-center w-full h-full">
            <svg
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z"
                stroke="#2D3648"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M12 8V16"
                stroke="#2D3648"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path
                d="M8 12H16"
                stroke="#2D3648"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            {/* <span className="text-gray-500">დაურთეთ ან აირჩიეთ</span> */}
            <input
              type="file"
              className="hidden"
              onChange={handleImageUpload}
            />
          </label>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;
