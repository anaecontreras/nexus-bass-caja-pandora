import { useState, useEffect } from "react";
import {
  getApiEndpoints,
  getTables,
  getProjectData,
  resolveFKRecords,
  getTableFKRelations,
} from "../utils/datastore";
import styles from "./ApiMockScreen.module.css";

export default function ApiMockScreen({ activeProject, onBackToDashboard, onGoToTerminal }) {
  const [endpoints, setEndpoints] = useState([]);
  const [selectedEndpoint, setSelectedEndpoint] = useState(null);
  const [response, setResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fkRelations, setFkRelations] = useState([]);

  useEffect(() => {
    setEndpoints(getApiEndpoints(activeProject));
    setSelectedEndpoint(null);
    setResponse(null);
    setFkRelations([]);
  }, [activeProject]);

  useEffect(() => {
    if (selectedEndpoint) {
      setFkRelations(getTableFKRelations(activeProject, selectedEndpoint.table));
    }
  }, [selectedEndpoint, activeProject]);

  const handleExecute = () => {
    if (!selectedEndpoint) return;
    setLoading(true);
    setResponse(null);
    setTimeout(() => {
      const tables = getTables(activeProject);
      const raw = tables[selectedEndpoint.table] || [];
      const data = selectedEndpoint.method === "GET"
        ? resolveFKRecords(activeProject, selectedEndpoint.table, raw)
        : { message: `${selectedEndpoint.method} ${selectedEndpoint.path} — simulado correctamente` };
      setResponse({
        status: 200,
        method: selectedEndpoint.method,
        path: selectedEndpoint.path,
        data,
        count: raw.length,
      });
      setLoading(false);
    }, 500);
  };

  const handleDownload = () => {
    const tables = getTables(activeProject);
    const projectData = getProjectData(activeProject);
    const payload = {
      project: activeProject,
      schemas: projectData?._schemas || {},
      tables,
      relaciones: projectData?.relaciones || [],
    };
    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `nexus_${activeProject.replace(/\s+/g, "_")}_diccionario.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>ENDPOINTS DISPONIBLES</h3>
        <div className={styles.endpointList}>
          {endpoints.map((ep, i) => (
            <div
              key={i}
              className={`${styles.endpointItem} ${selectedEndpoint === ep ? styles.endpointActive : ""}`}
              onClick={() => setSelectedEndpoint(ep)}
            >
              <span className={`${styles.method} ${styles[`method${ep.method}`]}`}>
                {ep.method}
              </span>
              <span className={styles.path}>{ep.path}</span>
            </div>
          ))}
        </div>
      </aside>

      <main className={styles.main}>
        {selectedEndpoint ? (
          <div className={styles.consoleView}>
            <h2 className={styles.consoleTitle}>SIMULADOR DE API</h2>
            <div className={styles.selectedInfo}>
              <span className={`${styles.method} ${styles[`method${selectedEndpoint.method}`]}`}>
                {selectedEndpoint.method}
              </span>
              <span className={styles.path}>{selectedEndpoint.path}</span>
              <span className={styles.tableRef}>→ {selectedEndpoint.table}</span>
              {fkRelations.length > 0 && (
                <span className={styles.fkBadge}>
                  {fkRelations.length} FK
                </span>
              )}
            </div>

            <button
              className={styles.executeBtn}
              onClick={handleExecute}
              disabled={loading}
            >
              {loading ? "EJECUTANDO..." : "EJECUTAR PETICIÓN LAN"}
            </button>

            <div className={styles.responseBox}>
              {loading && (
                <div className={styles.loadingText}>Procesando petición local...</div>
              )}
              {response && !loading && (
                <>
                  {fkRelations.length > 0 && (
                    <div className={styles.fkMetaBox}>
                      <span className={styles.fkMetaTitle}>RELACIONES DE CLAVES FORÁNEAS</span>
                      {fkRelations.map((fk, i) => (
                        <div key={i} className={styles.fkMetaRow}>
                          <span className={styles.fkMetaCol}>{fk.column}</span>
                          <span className={styles.fkMetaArrow}>──►</span>
                          <span className={styles.fkMetaRef}>{fk.refTable}.{fk.refColumn}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  <pre className={styles.responsePre}>
{JSON.stringify(response, null, 2)}
                  </pre>
                </>
              )}
              {!response && !loading && (
                <span className={styles.placeholder}>Respuesta simulada aparecerá aquí</span>
              )}
            </div>
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Seleccione un endpoint del menú izquierdo</p>
          </div>
        )}

        <div className={styles.bottomActions}>
          <button className={styles.downloadBtn} onClick={handleDownload}>
            DESCARGAR DICCIONARIO DE DATOS EN JSON
          </button>
          <button className={styles.navBtn} onClick={onGoToTerminal}>
            CONSOLA DE RESILIENCIA →
          </button>
          <button className={styles.backBtn} onClick={onBackToDashboard}>
            ← PANEL CENTRAL
          </button>
        </div>
      </main>
    </div>
  );
}
