import { useState, useEffect } from "react";
import {
  getDatastore,
  getProjectData,
  getTables,
  getTableNames,
  addNewProject,
  saveDatastore,
  setActiveProject as setActiveProjectStore,
} from "../utils/datastore";
import Modal from "./Modal";
import styles from "./DashboardScreen.module.css";

const LOG_EVENTS = [
  { ts: "2026-06-23 10:00:01", level: "INFO", msg: "GET /api/v1/libros — 200 OK (10 registros)" },
  { ts: "2026-06-23 10:00:05", level: "INFO", msg: "GET /api/v1/usuarios — 200 OK (5 registros)" },
  { ts: "2026-06-23 10:00:12", level: "WARN", msg: "GET /api/v1/prestamos — cache hit local" },
  { ts: "2026-06-23 09:58:30", level: "INFO", msg: "Auditoría: login exitoso — demo@uneti.edu.ve" },
  { ts: "2026-06-23 09:58:28", level: "INFO", msg: "Handshake LAN — 127.0.0.1:8000 establecido" },
  { ts: "2026-06-23 09:55:00", level: "WARN", msg: "CDN externa: conexión bloqueada (firewall soberano)" },
  { ts: "2026-06-23 09:50:00", level: "INFO", msg: "PUT /api/v1/prestamos/507 — estatus actualizado" },
  { ts: "2026-06-23 09:45:00", level: "ERROR", msg: "Telemetría externa: DETENIDA por política local" },
  { ts: "2026-06-23 09:40:00", level: "INFO", msg: "POST /api/v1/libros — 201 Created" },
  { ts: "2026-06-23 09:30:00", level: "INFO", msg: "Respaldo local: snapshot guardado en localStorage" },
];

const PRESERVED_PROJECT = "Sistema de Gestión de Biblioteca Personal";

export default function DashboardScreen({
  loggedUser,
  activeProject,
  sidebarView,
  setSidebarView,
  onSelectProject,
  onProjectCreated,
  onGoToSchema,
  onGoToEthics,
  onGoToApiMock,
  onGoToTerminal,
  onLogout,
}) {
  const [projects, setProjects] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [showCleanModal, setShowCleanModal] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [cryptoKey, setCryptoKey] = useState("");

  useEffect(() => {
    const data = getDatastore();
    if (data) setProjects(Object.keys(data.projects));
    const stored = localStorage.getItem("nexus_crypto_aes_256_lan_secret_key");
    if (stored) setCryptoKey(stored);
    else {
      const key = Array.from({ length: 32 }, () =>
        Math.floor(Math.random() * 16).toString(16)
      ).join("");
      localStorage.setItem("nexus_crypto_aes_256_lan_secret_key", key);
      setCryptoKey(key);
    }
  }, []);

  const handleCreateProject = () => {
    const trimmed = newProjectName.trim();
    if (!trimmed) return;
    addNewProject(trimmed);
    setActiveProjectStore(trimmed);
    setShowModal(false);
    setNewProjectName("");
    onProjectCreated(trimmed);
  };

  const handleCleanDatabases = () => {
    const data = getDatastore();
    if (!data) return;
    const userProjects = Object.keys(data.projects).filter((p) => p !== PRESERVED_PROJECT);
    userProjects.forEach((p) => delete data.projects[p]);
    data.active_project = PRESERVED_PROJECT;
    saveDatastore(data);
    setProjects(Object.keys(data.projects));
    onSelectProject(PRESERVED_PROJECT);
    setShowCleanModal(false);
  };

  const handleRegenerateKey = () => {
    const key = Array.from({ length: 32 }, () =>
      Math.floor(Math.random() * 16).toString(16)
    ).join("");
    localStorage.setItem("nexus_crypto_aes_256_lan_secret_key", key);
    setCryptoKey(key);
  };

  const projectData = getProjectData(activeProject);
  const tables = getTables(activeProject);
  const tableNames = getTableNames(activeProject);
  let totalRecords = 0;
  Object.values(tables).forEach((arr) => { totalRecords += arr.length; });

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>NODOS ACTIVOS</h3>
          {projects.map((p) => (
            <div
              key={p}
              className={`${styles.nodeItem} ${p === activeProject ? styles.nodeActive : ""}`}
              onClick={() => { onSelectProject(p); }}
            >
              <span className={styles.nodeBullet}>{p === activeProject ? "►" : "○"}</span>
              <span className={styles.nodeName}>{p}</span>
            </div>
          ))}
        </div>

        <div className={styles.sidebarSection}>
          <h3 className={styles.sidebarTitle}>HERRAMIENTAS E INMUNIDAD</h3>
          <button
            className={`${styles.toolBtn} ${sidebarView === "logs" ? styles.toolActive : ""}`}
            onClick={() => setSidebarView("logs")}
          >
            Registro de Eventos (Logs LAN)
          </button>
          <button
            className={`${styles.toolBtn} ${sidebarView === "metrics" ? styles.toolActive : ""}`}
            onClick={() => setSidebarView("metrics")}
          >
            Métricas de Almacenamiento
          </button>
          <button
            className={`${styles.toolBtn} ${sidebarView === "crypto" ? styles.toolActive : ""}`}
            onClick={() => setSidebarView("crypto")}
          >
            Llaves Simétricas de Encriptación
          </button>
        </div>

        <div className={styles.cleanSection}>
          <button className={styles.cleanBtn} onClick={() => setShowCleanModal(true)}>
            ⊘ Limpiar bases de datos en Local
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {sidebarView === "general" && (
          <div className={styles.generalView}>
            <div className={styles.headerBar}>
              <span className={styles.accountBadge}>Cuenta Activa: {loggedUser}</span>
              <span className={styles.projectBadge}>Proyecto: {activeProject}</span>
              <button className={styles.logoutBtn} onClick={onLogout}>CERRAR SESIÓN</button>
            </div>

            <div className={styles.diagBox}>
              <h3 className={styles.diagTitle}>DIAGNÓSTICO LAN</h3>
              <div className={styles.diagGrid}>
                <span>IP: 127.0.0.1</span>
                <span>Puerto: 8000</span>
                <span className={styles.diagBlocked}>Conexión CDNs: BLOQUEADA</span>
                <span className={styles.diagBlocked}>Telemetría: DETENIDA</span>
              </div>
            </div>

            <button className={styles.createBtn} onClick={() => setShowModal(true)}>
              + INICIALIZAR NUEVO NODO DE PERSISTENCIA LOCAL
            </button>

            <div className={styles.navRow}>
              {tableNames.length > 0 && (
                <button className={styles.navBtn} onClick={onGoToSchema}>
                  Constructor de Esquemas
                </button>
              )}
              <button className={styles.navBtn} onClick={onGoToEthics}>
                Alcabala Ética
              </button>
              <button className={styles.navBtn} onClick={onGoToApiMock}>
                Simulador API
              </button>
              <button className={styles.navBtn} onClick={onGoToTerminal}>
                Consola Resiliencia
              </button>
            </div>
          </div>
        )}

        {sidebarView === "logs" && (
          <div className={styles.logsView}>
            <h3 className={styles.viewTitle}>REGISTRO DE EVENTOS (Logs LAN)</h3>
            <div className={styles.logList}>
              {LOG_EVENTS.map((ev, i) => (
                <div key={i} className={styles.logItem}>
                  <span className={styles.logTs}>{ev.ts}</span>
                  <span className={`${styles.logLevel} ${styles[`level${ev.level}`]}`}>
                    [{ev.level}]
                  </span>
                  <span className={styles.logMsg}>{ev.msg}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sidebarView === "metrics" && (
          <div className={styles.metricsView}>
            <h3 className={styles.viewTitle}>MÉTRICAS DE ALMACENAMIENTO</h3>
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>{tableNames.length}</span>
                <span className={styles.metricLabel}>Tablas</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>{totalRecords}</span>
                <span className={styles.metricLabel}>Registros Totales</span>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricValue}>~{totalRecords * 0.4} KB</span>
                <span className={styles.metricLabel}>Espacio Estimado</span>
              </div>
            </div>
            <div className={styles.metricDetail}>
              {tableNames.map((t) => (
                <div key={t} className={styles.metricRow}>
                  <span className={styles.metricRowName}>{t}</span>
                  <span className={styles.metricRowCount}>{tables[t].length} registros</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {sidebarView === "crypto" && (
          <div className={styles.cryptoView}>
            <h3 className={styles.viewTitle}>LLAVES SIMÉTRICAS DE ENCRIPTACIÓN</h3>
            <div className={styles.cryptoKeyBox}>
              <span className={styles.cryptoLabel}>nexus_crypto_aes_256_lan_secret_key</span>
              <code className={styles.cryptoKey}>{cryptoKey}</code>
            </div>
            <button className={styles.regenerateBtn} onClick={handleRegenerateKey}>
              REGENERAR LLAVE LOCAL
            </button>
          </div>
        )}

        {sidebarView === "conf" && (
          <div className={styles.generalView}>
            <h3 className={styles.viewTitle}>CONSTRUCTOR DE ESQUEMAS</h3>
            <p className={styles.confText}>
              Seleccione una tabla del menú izquierdo para editar sus metadatos
              o cree un proyecto nuevo desde el Panel Central.
            </p>
          </div>
        )}
      </main>

      <Modal visible={showModal} title="Nuevo Nodo de Persistencia Local" onClose={() => setShowModal(false)}>
        <div className={styles.modalForm}>
          <label className={styles.modalLabel}>Nombre de la Nueva Base de Datos:</label>
          <input
            className={styles.modalInput}
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            placeholder="Ej: Sistema_Estudiantes"
          />
          <button className={styles.modalBtn} onClick={handleCreateProject}>
            CONFIRMAR
          </button>
        </div>
      </Modal>

      <Modal visible={showCleanModal} title="Limpiar bases de datos" onClose={() => setShowCleanModal(false)}>
        <div className={styles.cleanModalContent}>
          <p className={styles.cleanModalText}>
            ¿Está seguro de eliminar todas las bases de datos creadas por el usuario?
          </p>
          <p className={styles.cleanModalNote}>
            La base de datos "{PRESERVED_PROJECT}" no será afectada.
          </p>
          <div className={styles.cleanModalActions}>
            <button className={styles.cleanCancelBtn} onClick={() => setShowCleanModal(false)}>
              CANCELAR
            </button>
            <button className={styles.cleanConfirmBtn} onClick={handleCleanDatabases}>
              CONFIRMAR LIMPIEZA
            </button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
