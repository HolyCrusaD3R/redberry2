import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "../ui/navigation-menu";
import FilterItem from "./FilterItem";
import Department from "@/interfaces/Department";
import Priority from "@/interfaces/Priority";
import Employee from "@/interfaces/Employee";
import { FilterTypes, useFilterContext } from "@/contexts/FilterContext";

interface BaseItem {
  id: number;
  name: string;
}

interface ItemWithAvatar extends BaseItem {
  avatar: string;
}

interface ItemWithSurname extends BaseItem {
  surname: string;
}

interface FilterCategory {
  id: FilterTypes;
  label: string;
  items: Array<BaseItem | ItemWithAvatar | ItemWithSurname>;
}

export default function Filter({
  departments,
  priorities,
  employees,
}: {
  departments: Department[];
  priorities: Priority[];
  employees: Employee[];
}) {
  const filterCategories: FilterCategory[] = [
    {
      id: "departments",
      label: "დეპარტამენტი",
      items: departments,
    },
    {
      id: "priorities",
      label: "პრიორიტეტი",
      items: priorities,
    },
    {
      id: "employees",
      label: "თანამშრომელი",
      items: employees,
    },
  ];

  const { changeSelected, selected, filterTasks } = useFilterContext();

  return (
    <NavigationMenu className="border border-[#DEE2E6] rounded-[10px] mt-[52px] mb-[80px]">
      <NavigationMenuList className="gap-[45px] text-[#0D0F10] text-base font-firago tracking-normal">
        {filterCategories.map((category) => (
          <NavigationMenuItem key={category.id}>
            <NavigationMenuTrigger className="px-[18px] lg:py-[12px] cursor-pointer">
              {category.label}
            </NavigationMenuTrigger>
            <NavigationMenuContent className="lg:w-[590px] px-[30px] pt-[40px] pb-[80px]">
              <ul className="list-none space-y-[23px]">
                {category.items.map((item) => (
                  <FilterItem
                    key={item.id}
                    label={
                      "surname" in item
                        ? `${item.name} ${item.surname}`
                        : item.name
                    }
                    id={String(item.id)}
                    avatar={"avatar" in item ? item.avatar : undefined}
                    isChecked={selected[category.id].includes(String(item.id))}
                    changeSelected={changeSelected}
                    type={category.id}
                  />
                ))}
              </ul>

              <button
                onClick={filterTasks}
                className="bg-[#8338EC] text-white px-[50px] py-2 rounded-full cursor-pointer transition-colors duration-200 hover:bg-[#6a2c91] absolute right-[30px] bottom-[20px]"
              >
                არჩევა
              </button>
            </NavigationMenuContent>
          </NavigationMenuItem>
        ))}
      </NavigationMenuList>
    </NavigationMenu>
  );
}
