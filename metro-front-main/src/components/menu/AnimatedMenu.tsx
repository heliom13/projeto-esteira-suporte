import {Menu} from "antd";
import styled from "styled-components";

export const AnimatedMenu = styled(Menu)`
  .ant-menu-item,
  .ant-menu-submenu-title {
    border-radius: 8px;
    margin: 4px 8px !important;
    width: calc(100% - 16px) !important;
    transition: background-color 0.2s ease, color 0.2s ease, transform 0.15s ease;
  }

  .ant-menu-item:hover,
  .ant-menu-submenu-title:hover {
    background-color: #f0f5ff;
    transform: translateX(4px);
  }

  .ant-menu-item:active,
  .ant-menu-submenu-title:active {
    transform: scale(0.96);
  }

  .ant-menu-item-selected {
    animation: menuItemPop 0.3s ease;
  }

  @keyframes menuItemPop {
    0% {
      transform: scale(0.94);
    }
    60% {
      transform: scale(1.03);
    }
    100% {
      transform: scale(1);
    }
  }

  .ant-menu-submenu .ant-menu-item {
    margin-left: 16px !important;
    width: calc(100% - 32px) !important;
  }
` as unknown as typeof Menu;

AnimatedMenu.Item = Menu.Item;
AnimatedMenu.SubMenu = Menu.SubMenu;
