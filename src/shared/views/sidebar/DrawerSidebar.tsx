import React, { useState } from 'react';
import BackButton from '@src/shared/components/BackButton/BackButton';
import RightSideDrawer from '@src/shared/components/RightSideDrawer/RightSideDrawer';
import { ExtensionWord } from '@src/shared/storages/WordsStorage';

interface DrawerSidebarProps {
  wordList?: ExtensionWord[];
  openDrawer?: boolean;
}

const DrawerSidebar: React.FC<DrawerSidebarProps> = ({ wordList ,openDrawer=false}) => {
  const [visible, setVisible] = useState(openDrawer);

  const toggleDrawer = () => setVisible(!visible);

  return (
    <>
      <BackButton onOpenDrawer={toggleDrawer} />
      <RightSideDrawer visible={visible} wordList={wordList} onClose={toggleDrawer} menu={openDrawer?"settings":"list"}/>
    </>
  );
};

export default DrawerSidebar;
