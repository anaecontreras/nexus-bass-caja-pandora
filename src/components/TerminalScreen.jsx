import { useState } from "react";
import styles from "./TerminalScreen.module.css";

const SIM_LINES = [
  "[2026-06-23T10:00:00] ⚡ NEXUS-BAAS v2.0 — Iniciando procedimiento de contingencia...",
  "[2026-06-23T10:00:01] 🔌 Detectando estado de conectividad internacional...",
  "[2026-06-23T10:00:02] ⚠️  ADVERTENCIA: Enlaces internacionales NO DISPONIBLES",
  "[2026-06-23T10:00:03] 🛡️  Activando protocolo de resiliencia territorial...",
  "[2026-06-23T10:00:04] 📦 Ejecutando respaldo en caliente hacia el metal propio local...",
  "[2026-06-23T10:00:05] ✅ Datos críticos replicados en localStorage correctamente",
  "[2026-06-23T10:00:06] 🔐 Aplicando cifrado simétrico AES-256 sobre snapshot...",
  "[2026-06-23T10:00:07] 📋 Integridad verificada: hash SHA-256 coincide",
  "[2026-06-23T10:00:08] 🌐 Red LAN soberana: 127.0.0.1:8000 — operativa",
  "[2026-06-23T10:00:09] 🗄️  Nodo de persistencia local asegurado",
  "[2026-06-23T10:00:10] 📊 Métricas: 3 tablas, 27 registros, 0 exfiltraciones",
  "[2026-06-23T10:00:11] ✅ RESGUARDO COMPLETO — SISTEMA INMUNE A DESCONEXIONES",
];

export default function TerminalScreen({ onBackToDashboard }) {
  const [lines, setLines] = useState([]);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);

  const handleSimulate = () => {
    if (running) return;
    setRunning(true);
    setLines([]);
    setDone(false);

    SIM_LINES.forEach((line, i) => {
      setTimeout(() => {
        setLines((prev) => [...prev, line]);
        if (i === SIM_LINES.length - 1) {
          setRunning(false);
          setDone(true);
        }
      }, (i + 1) * 400);
    });
  };

  return (
    <div className={styles.container}>
      <div className={styles.terminal}>
        <div className={styles.terminalHeader}>
          <span className={styles.terminalTitle}>CONSOLA DE RESILIENCIA TERRITORIAL</span>
          <span className={styles.terminalStatus}>
            {running ? "⚡ PROCESANDO..." : done ? "✅ COMPLETADO" : "⏸️  EN ESPERA"}
          </span>
        </div>

        <div className={styles.terminalOutput}>
          {lines.length === 0 && !running && (
            <div className={styles.placeholder}>
              <p>=== NEXUS-BAAS v2.0 — Terminal de Contingencia ===</p>
              <p className={styles.placeholderSub}>
                Presione el botón inferior para simular el protocolo de respaldo
              </p>
            </div>
          )}
          {lines.map((line, i) => (
            <div key={i} className={styles.line}>
              {line}
            </div>
          ))}
        </div>

        <div className={styles.terminalControls}>
          {!done && (
            <button
              className={styles.simulateBtn}
              onClick={handleSimulate}
              disabled={running}
            >
              {running
                ? "SIMULANDO RESPALDO..."
                : "SIMULAR RESPALDO EN CALIENTE HACIA EL METAL PROPIO LOCAL"}
            </button>
          )}
          {done && (
            <button className={styles.doneBtn} onClick={onBackToDashboard}>
              VOLVER AL PANEL CENTRAL (SISTEMA SEGURO)
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
