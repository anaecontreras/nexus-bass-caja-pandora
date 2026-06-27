import styles from "./Modal.module.css";

export default function Modal({ visible, title, children, onClose }) {
  if (!visible) return null;
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
          <button className={styles.closeBtn} onClick={onClose}>&times;</button>
        </div>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );
}
