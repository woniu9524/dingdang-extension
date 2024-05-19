import React from 'react';
import styled from 'styled-components';

// 更新主题或设计系统
const theme = {
  primary: '#ffe58f', // 更新主色调为新的主题色
  borderRadius: '20px',
  boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
  cardBackground: 'rgba(255, 255, 255, 0.5)', // 卡片背景色增加透明度
};

// 更新卡片样式
const InnerCard = styled.div`
  background-color: ${theme.cardBackground}; // 使用主题中的卡片背景色
  border-radius: ${theme.borderRadius};
  padding: 10px;
  display: flex;
  align-items: center;
  box-shadow: ${theme.boxShadow};
  width: 100%;
  margin-bottom: 10px;
`;

// 更新开关样式
const Switch = styled.label`
  position: relative;
  display: inline-block;
  width: 60px;
  height: 34px;
  min-width: 60px;

  & input {
    opacity: 0;
    width: 0;
    height: 0;
  }

  .slider {
    position: absolute;
    cursor: pointer;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #ccc;
    transition: 0.4s;
    border-radius: 34px;
  }

  input:checked + .slider {
    background-color: #f5a623; // 使用新的主题色
  }

  .slider:before {
    position: absolute;
    content: '';
    height: 26px;
    width: 26px;
    left: 4px;
    bottom: 4px;
    background-color: white;
    transition: 0.4s;
    border-radius: 50%;
  }

  input:checked + .slider:before {
    transform: translateX(26px);
  }
`;

// 更新下拉框样式
const Dropdown = styled.select`
  width: 100%;
  height: 34px;
  padding: 2px 8px;
  border: 2px solid #f5a623;
  border-radius: 8px;
  background-color: ${theme.primary}; // 使用新的主题色
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 4 5"><path fill="%23666" d="M2 0L0 2h4zm0 5L0 3h4z"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  color: #666;
  font-size: 1rem;
  cursor: pointer;

  &:hover {
    border-color: #bcbcbc;
  }

  &:focus {
    border-color: #a0a0a0;
    outline: none;
  }
`;

// 描述文字样式，可以根据需要调整外边距
const Description = styled.span`
  margin-left: 5px;
  min-width: 70px;
`;

// 开关卡片组件，添加了props类型注释
const SwitchCard: React.FC<SwitchCardProps> = ({ isOn, description, onToggle }) => (
  <InnerCard>
    <Switch>
      <input type="checkbox" checked={isOn} onChange={onToggle} />
      <span className="slider"></span>
    </Switch>
    <Description className={"processed-dingdang-never"}>{description}</Description>
  </InnerCard>
);

// 带下拉菜单的开关卡片组件，添加了props类型注释和下拉菜单项的循环渲染
const SwitchCardWithDropdown: React.FC<SwitchCardWithDropdownProps> = ({
  isOn,
  description,
  onToggle,
  onDropdownChange, // 新增参数，用于处理下拉菜单的变化
  dropdownItems,
  selectedValue, // 新增参数，用于标识当前选中的值
}) => (
  <InnerCard>
    <Switch>
      <input type="checkbox" checked={isOn} onChange={onToggle} />
      <span className="slider"></span>
    </Switch>
    <Description>{description}</Description>
    <Dropdown value={selectedValue} onChange={onDropdownChange} className={"processed-dingdang-never"}>
      {dropdownItems.map((item, index) => (
        <option key={index} value={item.key} style={{ color: item.color }}>
          {item.content}
        </option>
      ))}
    </Dropdown>
  </InnerCard>
);

const CardWithDropdown: React.FC<CardWithDropdownProps> = ({
  dropdownItems,
  selectedValue, // 同样新增参数
  onDropdownChange, // 新增参数，用于处理下拉菜单的变化
}) => (
  <InnerCard>
    <Dropdown value={selectedValue} onChange={onDropdownChange} className={"processed-dingdang-never"}>
      {dropdownItems.map((item, index) => (
        <option key={index} value={item.key} style={{ color: item.color }} className={"processed-dingdang-never"}>
          {item.content}
        </option>
      ))}
    </Dropdown>
  </InnerCard>
);

export { SwitchCard, SwitchCardWithDropdown, CardWithDropdown, InnerCard };
