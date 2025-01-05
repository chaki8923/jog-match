
"use client";

import { Button, Modal } from "flowbite-react";
import { useState } from "react";
import { BsClipboardData } from "react-icons/bs";
import styles from './index.module.scss';

// Props の型定義
type ConfirmModalProps = {
  handleChangeConfirmed: () => void; // コールバック関数の型
};

export function ConfirmModal(props: ConfirmModalProps) {
  const [openModal, setOpenModal] = useState(true);

  const handleChangeConfirmed = () => {    
    setOpenModal(false)
    props.handleChangeConfirmed();//親コンポーネントに渡す関数
  }

  return (
    <div>
      <Modal className={styles.modal} show={openModal} size="md" onClose={() => setOpenModal(false)} popup>
        <Modal.Body className={styles.modalBody}>
          <div className="text-center">
          <BsClipboardData className={styles.saveIcon}/>
            <h3 className="mb-5 mt-5 text-lg font-normal text-gray-500 dark:text-gray-400">
              タイムを保存しますか？
            </h3>
            <div className="flex justify-center gap-4">
              <Button className={styles.yesBtn} color="failure" onClick={() => handleChangeConfirmed()}>
                {"Yes, I'm sure"}
              </Button>
              <Button className={styles.noBtn} color="gray" onClick={() => setOpenModal(false)}>
                No, cancel
              </Button>
            </div>
          </div>
        </Modal.Body>
      </Modal>
    </div>
  );
}
