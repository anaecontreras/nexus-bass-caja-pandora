import { useState, useEffect } from "react";
import { getRelations } from "../utils/datastore";
import styles from "./EthicalCheckpointScreen.module.css";

const AUDIT_ITEMS = [
  { id: "a1", label: "Esta arquitectura de datos no será utilizada para vigilancia masiva ni control social indebido." },
  { id: "a2", label: "Los metadatos y esquemas persistidos pertenecen soberanamente a su operador local y no serán exfiltrados." },
  { id: "a3", label: "El presente nodo respeta los principios de infraestructura inmune, código abierto y autonomía tecnológica." },
];

export default function EthicalCheckpointScreen({ activeProject, onEthicsPassed, onBackToDashboard }) {
  const [relations, setRelations] = useState([]);
  const [checks, setChecks] = useState({});

  useEffect(() => {
    setRelations(getRelations(activeProject));
    setChecks({});
  }, [activeProject]);

  const handleCheck = (id) => {
    setChecks((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const allChecked = AUDIT_ITEMS.every((item) => checks[item.id]);
  const totalChecked = Object.values(checks).filter(Boolean).length;

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <h2 className={styles.leftTitle}>DIAGRAMA DE RELACIONES</h2>
        <h3 className={styles.projectName}>{activeProject}</h3>
        <div className={styles.relationsList}>
          {relations.length === 0 && (
            <p className={styles.noRelations}>No hay relaciones definidas para este proyecto.</p>
          )}
          {relations.map((r, i) => (
            <div key={i} className={styles.relationItem}>
              <span className={styles.relationText}>{r}</span>
            </div>
          ))}
        </div>
        <button className={styles.backBtn} onClick={onBackToDashboard}>
          ← VOLVER AL PANEL
        </button>
      </div>

      <div className={styles.right}>
        <div className={styles.alcabala}>
          <h2 className={styles.alcabalaTitle}>ALCABALA DE CONTROL ÉTICO</h2>
          <p className={styles.alcabalaSub}>
            Marque los 3 checkboxes para liberar la transición
          </p>

          <div className={styles.checkList}>
            {AUDIT_ITEMS.map((item) => (
              <label key={item.id} className={styles.checkItem}>
                <input
                  type="checkbox"
                  checked={!!checks[item.id]}
                  onChange={() => handleCheck(item.id)}
                  className={styles.checkbox}
                />
                <span className={styles.checkLabel}>{item.label}</span>
              </label>
            ))}
          </div>

          <div className={`${styles.statusBox} ${allChecked ? styles.statusGreen : styles.statusOrange}`}>
            {allChecked
              ? "🟢 COMPROBADA Y LIBERADA (WIP OK)"
              : `ALCABALA BLOQUEADA - REVISIÓN ÉTICA REQUERIDA (${totalChecked}/3)`}
          </div>

          <button
            className={styles.transitionBtn}
            disabled={!allChecked}
            onClick={onEthicsPassed}
          >
            TRANSICIÓN ENDPOINTS
          </button>
        </div>
      </div>
    </div>
  );
}
