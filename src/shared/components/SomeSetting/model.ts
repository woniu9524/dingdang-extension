interface SwitchCardProps {
  isOn: boolean;
  description: string;
  onToggle: () => void;
}

interface DropdownItem {
  key: string;
  content: string;
  color?: string; // 使颜色可选，因为不是每个下拉项都需要单独的颜色
}

interface SwitchCardWithDropdownProps {
  isOn: boolean;
  selectedValue: string;
  description: string;
  onToggle: () => void;
  onDropdownChange: (e: any) => void;
  dropdownItems: DropdownItem[];
}

interface CardWithDropdownProps {
  selectedValue: string;
  dropdownItems: DropdownItem[];
  onDropdownChange: (e: any) => void;
}
