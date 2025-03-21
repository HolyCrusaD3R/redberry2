import CustomButton from "./CustomButton";
import { useState, useEffect, FormEvent, useRef } from "react";
import ImageUpload from "./ImageUpload";
import useDepartment from "../hooks/useDepartment";
import useEmployees from "../hooks/useEmployee";
import Dropdown_active from "../assets/Dropdown_active.svg";
import Dropdown_passive from "../assets/Dropdown_passive.svg";
import CloseX from "../assets/CloseX.svg";
interface FormDataAgent {
  name: string;
  surname: string;
  avatar: File;
  department_id: number;
}

interface ModalAgentProps {
  onClose: () => void;
  onSubmit: () => void;
}

export default function ModalAgent({ onClose, onSubmit }: ModalAgentProps) {
  const { departments } = useDepartment();
  const { createEmployee, loading: loadingEmployeeCreation } = useEmployees();
  const [activeDropdown, setActiveDropdown] = useState("");

  const dropdownRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setActiveDropdown("");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const getInitialFormData = (): FormDataAgent => {
    const savedFormData = window.localStorage.getItem("formDataAgent");
    return savedFormData
      ? JSON.parse(savedFormData)
      : {
          name: "",
          surname: "",
          avatar: null,
          department_id: -1,
        };
  };

  const [formData, setFormData] = useState<FormDataAgent>(getInitialFormData);

  useEffect(() => {
    window.localStorage.setItem("formDataAgent", JSON.stringify(formData));
  }, [formData]);

  const safeTrim = (value: unknown): string =>
    typeof value === "string" ? value.trim() : "";

  const safeLength = (value: unknown): number =>
    typeof value === "string" ? value.length : 0;

  const clearAgentFormData = (): void => {
    window.localStorage.removeItem("formDataAgent");
    onClose();
  };

  const handleFormDataChange = (
    key: keyof FormDataAgent,
    val: string | File | null | number
  ): void => {
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [key]: val,
      };
    });
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();

    try {
      const employeeData = {
        name: formData.name,
        surname: formData.surname,
        avatar: formData.avatar,
        department_id: formData.department_id,
      };

      await createEmployee(employeeData);
      onSubmit();
    } catch (error) {
      console.error("Failed to submit form:", error);
    }
  };

  const isFormValid = () => {
    return (
      safeLength(safeTrim(formData.name)) >= 2 &&
      safeLength(safeTrim(formData.name)) <= 255 &&
      safeLength(safeTrim(formData.surname)) >= 2 &&
      safeLength(safeTrim(formData.surname)) <= 255 &&
      formData.department_id > 0 &&
      formData.avatar !== null
    );
  };

  useEffect(() => {
    const close = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        clearAgentFormData();
      }
    };

    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, []);

  return (
    <>
      <div className="fixed w-[913px] h-[766px] items-center -translate-x-1/2 -translate-y-1/2 bg-white left-1/2 top-1/2 rounded-xl shadow-[5px5px_12px_0px#02152614] py-[40px] px-[50px] flex flex-col gap-8 z-[9999]">
        <div className="w-full flex flex-row justify-end">
          <img
            src={CloseX}
            height="40"
            width="40"
            onClick={clearAgentFormData}
            className="cursor-pointer"
          />
        </div>
        <p className="text-customGreyHeadline font-firago font-medium text-[32px]">
          თანამშრომლის დამატება
        </p>
        <div className="w-full font-firago font-medium text-sm flex flex-row flex-wrap gap-x-[31px] gap-y-[28px]">
          <div className="flex flex-col">
            <div className="text-customGreySecondary">
              <p>სახელი*</p>
            </div>
            <div className="w-[384px] h-[42px] mt-[5px]">
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleFormDataChange("name", e.target.value)}
                className={`font-normal h-full w-full appearance-none rounded-md border ${
                  safeLength(safeTrim(formData.name)) < 2 &&
                  formData.name !== ""
                    ? "border-customRed outline-customRed"
                    : "border-customGrayAlt"
                } py-[12.5px] pl-2 pr-[18px]`}
              />
            </div>
            <div className="flex flex-col">
              <div
                className={`font-normal flex flex-row gap-[7px] ${
                  formData.name === ""
                    ? "text-customGrey"
                    : safeLength(safeTrim(formData.name)) < 2
                    ? "text-customRed"
                    : "text-customGreen"
                } items-center mt-1`}
              >
                <svg
                  className="w-[10px] h-[8.18px] stroke-current"
                  viewBox="0 0 12 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 1.40918L4.125 9.591L1 5.87199"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-firago text-[10px]">
                  {formData.name !== "" &&
                  safeLength(safeTrim(formData.name)) < 2
                    ? "ჩაწერეთ ვალიდური მონაცემები"
                    : "მინიმუმ 2 სიმბოლო"}
                </p>
              </div>
              <div>
                <div
                  className={`font-normal flex flex-row gap-[7px] ${
                    formData.name === ""
                      ? "text-customGrey"
                      : safeLength(safeTrim(formData.name)) > 255
                      ? "text-customRed"
                      : "text-customGreen"
                  } items-center mt-1`}
                >
                  <svg
                    className="w-[10px] h-[8.18px] stroke-current"
                    viewBox="0 0 12 11"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M11 1.40918L4.125 9.591L1 5.87199"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <p className="font-firago text-[10px]">
                    {formData.name !== "" &&
                    safeLength(safeTrim(formData.name)) > 255
                      ? "ჩაწერეთ ვალიდური მონაცემები"
                      : "მაქსიმუმ 255 სიმბოლო"}
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div className="flex flex-col">
            <div className="text-customGreySecondary">
              <p>გვარი*</p>
            </div>
            <div className="w-[384px] h-[42px] mt-[5px]">
              <input
                type="text"
                value={formData.surname}
                onChange={(e) =>
                  handleFormDataChange("surname", e.target.value)
                }
                className={`font-normal h-full w-full appearance-none rounded-md border ${
                  safeLength(safeTrim(formData.surname)) < 2 &&
                  formData.surname !== ""
                    ? "border-customRed outline-customRed"
                    : "border-customGrayAlt"
                } py-[12.5px] pl-2 pr-[18px]`}
              />
            </div>
            <div className="flex flex-col">
              <div
                className={`font-normal flex flex-row gap-[7px] ${
                  formData.surname === ""
                    ? "text-customGrey"
                    : safeLength(safeTrim(formData.surname)) < 2
                    ? "text-customRed"
                    : "text-customGreen"
                } items-center mt-1`}
              >
                <svg
                  className="w-[10px] h-[8.18px] stroke-current"
                  viewBox="0 0 12 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 1.40918L4.125 9.591L1 5.87199"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-firago text-[10px]">
                  {formData.surname !== "" &&
                  safeLength(safeTrim(formData.surname)) < 2
                    ? "ჩაწერეთ ვალიდური მონაცემები"
                    : "მინიმუმ 2 სიმბოლო"}
                </p>
              </div>
              <div
                className={`font-normal flex flex-row gap-[7px] ${
                  formData.surname === ""
                    ? "text-customGrey"
                    : safeLength(safeTrim(formData.surname)) > 255
                    ? "text-customRed"
                    : "text-customGreen"
                } items-center mt-1`}
              >
                <svg
                  className="w-[10px] h-[8.18px] stroke-current"
                  viewBox="0 0 12 11"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11 1.40918L4.125 9.591L1 5.87199"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <p className="font-firago text-[10px]">
                  {formData.surname !== "" &&
                  safeLength(safeTrim(formData.surname)) > 255
                    ? "ჩაწერეთ ვალიდური მონაცემები"
                    : "მაქსიმუმ 255 სიმბოლო"}
                </p>
              </div>
            </div>
          </div>
        </div>
        <ImageUpload
          setImage={(file) => handleFormDataChange("avatar", file)}
        />
        {/* department here */}

        <div className="flex flex-col w-full font-firago font-medium text-[14px]">
          <div>
            <p className="text-customGreySecondary">დეპარტამენტი*</p>
          </div>
          <div
            className="relative w-[384px] mt-[5px] font-normal"
            ref={dropdownRef}
          >
            <div
              id="დეპარტამენტი"
              className={`w-full h-[42px] flex flex-row justify-between items-center ${
                activeDropdown === "დეპარტამენტი"
                  ? "rounded-tl-md rounded-tr-md"
                  : "rounded-md"
              } border ${
                formData.department_id <= 0 && formData.department_id !== -1
                  ? "border-customRed outline-customRed"
                  : "border-customGrayAlt"
              } cursor-pointer px-[10px] py-[12.5px] relative`}
              onClick={() =>
                setActiveDropdown(
                  activeDropdown === "დეპარტამენტი" ? "" : "დეპარტამენტი"
                )
              }
            >
              <div>
                <p>
                  {formData.department_id === -1
                    ? ""
                    : departments.find(
                        (dept) => dept.id === formData.department_id
                      )?.name || ""}
                </p>
              </div>
              <div>
                {activeDropdown === "დეპარტამენტი" ? (
                  <img src={Dropdown_active} height="14px" width="14px" />
                ) : (
                  <img src={Dropdown_passive} height="14px" width="14px" />
                )}
              </div>

              {activeDropdown === "დეპარტამენტი" && (
                <div className="left-[-1px] bottom-0 translate-y-full rounded-bl-md rounded-br-md flex flex-col absolute z-50 w-full border border-customGrayAlt overflow-hidden">
                  <div className="max-h-[200px] overflow-y-auto">
                    {departments &&
                      departments.map((dept) => {
                        return (
                          <div
                            key={dept.id}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleFormDataChange("department_id", dept.id);
                              setActiveDropdown("");
                            }}
                            className="w-full bg-white px-[10px] py-[12.5px] hover:bg-gray-50"
                          >
                            <p>{dept.name}</p>
                          </div>
                        );
                      })}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div
            className={`font-normal flex flex-row gap-[7px] ${
              formData.department_id === -1
                ? "text-customGrey"
                : formData.department_id <= 0
                ? "text-customRed"
                : "text-customGreen"
            } items-center mt-1`}
          >
            <svg
              className="w-[10px] h-[8.18px] stroke-current"
              viewBox="0 0 12 11"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11 1.40918L4.125 9.591L1 5.87199"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <p>
              {formData.department_id !== -1 && formData.department_id <= 0
                ? "აირჩიეთ დეპარტამენტი"
                : "აირჩიეთ დეპარტამენტი"}
            </p>
          </div>
        </div>
        <div className="flex flex-row items-center justify-between flex-nowrap w-full">
          <div>{loadingEmployeeCreation && <p>იტვირთება...</p>}</div>
          <div className="flex flex-row items-center gap-2">
            <CustomButton
              isPrimary={false}
              // width="103px"
              // height="47px"
              onClose={clearAgentFormData}
            >
              გაუქმება
            </CustomButton>
            <CustomButton
              isPrimary={true}
              // width="161px"
              // height="47px"
              disabled={!isFormValid() || loadingEmployeeCreation}
              onSubmit={handleSubmit}
            >
              დაამატე თანამშრომელი
            </CustomButton>
          </div>
        </div>
      </div>
      <div
        onClick={clearAgentFormData}
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[9998]"
      ></div>
    </>
  );
}
