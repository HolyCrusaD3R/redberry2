import { Checkbox } from "../ui/checkbox";

export default function FilterItem({
  avatar,
  label,
  id,
  isChecked,
  changeSelected,
}: {
  avatar?: string;
  label: string;
  id: string;
  isChecked: boolean;
  changeSelected: (id: string) => void;
}) {
  function handleCheckboxChange() {
    changeSelected(id);
  }

  return (
    <li className="flex items-center gap-4">
      <Checkbox
        className="size-5 rounded-[6px] border-[#212529] cursor-pointer"
        id={`filter-item-${label}`}
        checked={isChecked}
        onCheckedChange={handleCheckboxChange}
      />
      {avatar && (
        <img className="size-[28px] rounded-full" src={avatar} alt={label} />
      )}
      <label
        htmlFor={`filter-item-${label}`}
        className="text-[#212529] font-firago text-base cursor-pointer"
      >
        {label}
      </label>
    </li>
  );
}
