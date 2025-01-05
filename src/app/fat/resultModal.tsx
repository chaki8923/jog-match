import styles from "./index.module.scss";
import Image from 'next/image'
// モーダルコンポーネント
const Modal: React.FC<{ isOpen: boolean; onClose: () => void; content: string }> = ({ isOpen, onClose, content }) => {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className={`bg-white p-6 rounded shadow-lg transform transition-all scale-95 opacity-0 ${styles.animateModal}`}
        onClick={(e) => e.stopPropagation()} // モーダルのクリックで閉じないようにする
      >
        <h2 className={`text-lg font-bold mb-4 ${styles.modalTitle}`}>計算結果</h2>
        <p>あなたの<span className={styles.result}>{content}</span></p>
        <p className={styles.description}><span className={styles.underLine}>BMIは18.5以上～25未満</span>が標準範囲とされ、その範囲より大きすぎても小さすぎても病気にかかりやすくなるとされています。</p>
        <Image
          src="/tanita.webp"
          className={styles.tanitaImage}
          width={720}
          height={100}
          alt="体脂肪率" />
        <button
          className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={onClose}
        >
          閉じる
        </button>
      </div>
    </div>
  );
};

export default Modal;