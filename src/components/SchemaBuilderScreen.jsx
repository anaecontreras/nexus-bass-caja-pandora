import { useState, useEffect } from "react";
import {
  getTableNames,
  getSchemaForTable,
  getTableSchema,
  saveTableSchema,
  getSchemaTypes,
  getTablePKColumns,
  getAvailableFKTables,
} from "../utils/datastore";
import styles from "./SchemaBuilderScreen.module.css";

export default function SchemaBuilderScreen({
  activeProject,
  selectedTable,
  onTableSelect,
  onSchemaSaved,
  onGoToEthics,
  onBackToDashboard,
}) {
  const [tableNames, setTableNames] = useState([]);
  const [columns, setColumns] = useState([]);
  const [newTableName, setNewTableName] = useState("");
  const [editingTable, setEditingTable] = useState(null);
  const [saved, setSaved] = useState(false);
  const types = getSchemaTypes();

  useEffect(() => {
    const names = getTableNames(activeProject);
    setTableNames(names);
    if (selectedTable && names.includes(selectedTable)) {
      loadTable(selectedTable);
    }
  }, [activeProject, selectedTable]);

  const loadTable = (tname) => {
    setEditingTable(tname);
    const savedSchema = getTableSchema(activeProject, tname);
    let cols;
    if (savedSchema) {
      cols = JSON.parse(JSON.stringify(savedSchema));
    } else {
      const schema = getSchemaForTable(activeProject, tname);
      cols = schema.length > 0 ? schema : [{ name: "", type: "VARCHAR", isPK: false, nullable: true }];
    }
    cols = cols.map((col) => ({
      ...col,
      isFK: col.isFK || false,
      fkTable: col.fkTable || "",
      fkColumn: col.fkColumn || "",
    }));
    setColumns(cols);
    setSaved(false);
  };

  const handleSelect = (tname) => {
    setNewTableName("");
    onTableSelect(tname);
    loadTable(tname);
  };

  const handleAddAttribute = () => {
    setColumns([...columns, { name: "", type: "VARCHAR", isPK: false, nullable: true, isFK: false, fkTable: "", fkColumn: "" }]);
  };

  const otherTables = editingTable ? getAvailableFKTables(activeProject, editingTable) : [];
  const pkColumnsForTable = (tname) => getTablePKColumns(activeProject, tname);

  const handleRemoveAttribute = (idx) => {
    if (columns.length <= 1) return;
    setColumns(columns.filter((_, i) => i !== idx));
  };

  const handleColumnChange = (idx, field, value) => {
    const updated = columns.map((col, i) =>
      i === idx ? { ...col, [field]: value } : col
    );
    setColumns(updated);
  };

  const handleSave = () => {
    if (editingTable) {
      saveTableSchema(activeProject, editingTable, columns);
      setSaved(true);
    }
  };

  const handleCreateNewTable = () => {
    const tname = newTableName.trim();
    if (!tname || tableNames.includes(tname)) return;
    saveTableSchema(activeProject, tname, [{ name: "id", type: "INTEGER", isPK: true, nullable: false }]);
    const names = getTableNames(activeProject);
    setTableNames(names);
    setNewTableName("");
    loadTable(tname);
    onTableSelect(tname);
  };

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <h3 className={styles.sidebarTitle}>TABLAS</h3>
        <div className={styles.tableList}>
          {tableNames.map((t) => (
            <div
              key={t}
              className={`${styles.tableItem} ${t === editingTable ? styles.tableActive : ""}`}
              onClick={() => handleSelect(t)}
            >
              {t}
            </div>
          ))}
        </div>
        <div className={styles.newTableSection}>
          <input
            className={styles.newTableInput}
            placeholder="Nombre nueva tabla..."
            value={newTableName}
            onChange={(e) => setNewTableName(e.target.value)}
          />
          <button className={styles.newTableBtn} onClick={handleCreateNewTable}>
            + AGREGAR NUEVA TABLA
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        {editingTable ? (
          <div className={styles.editor}>
            <h2 className={styles.editorTitle}>EDITOR DE ESQUEMA: {editingTable}</h2>
            <div className={styles.columnsGrid}>
              <div className={styles.gridHeader}>
                <span className={styles.colName}>Nombre</span>
                <span className={styles.colType}>Tipo</span>
                <span className={styles.colPk}>PK</span>
                <span className={styles.colNullable}>Nullable</span>
                <span className={styles.colFk}>FK</span>
                <span className={styles.colFkTable}>Tabla Ref.</span>
                <span className={styles.colFkCol}>Campo Ref.</span>
                <span className={styles.colAction}></span>
              </div>
              {columns.map((col, idx) => (
                <div key={idx} className={styles.gridRow}>
                  <input
                    className={styles.fieldInput}
                    value={col.name}
                    onChange={(e) => handleColumnChange(idx, "name", e.target.value)}
                  />
                  <select
                    className={styles.fieldSelect}
                    value={col.type}
                    onChange={(e) => handleColumnChange(idx, "type", e.target.value)}
                  >
                    {types.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={col.isPK}
                      onChange={(e) => handleColumnChange(idx, "isPK", e.target.checked)}
                    />
                  </label>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={col.nullable}
                      onChange={(e) => handleColumnChange(idx, "nullable", e.target.checked)}
                    />
                  </label>
                  <label className={styles.checkLabel}>
                    <input
                      type="checkbox"
                      checked={col.isFK}
                      onChange={(e) => handleColumnChange(idx, "isFK", e.target.checked)}
                    />
                  </label>
                  {col.isFK ? (
                    <>
                      <select
                        className={styles.fieldSelect}
                        value={col.fkTable}
                        onChange={(e) => {
                          const newTable = e.target.value;
                          setColumns((prev) => prev.map((c, i) =>
                            i === idx ? { ...c, fkTable: newTable, fkColumn: "" } : c
                          ));
                        }}
                      >
                        <option value="">—</option>
                        {otherTables.map((t) => (
                          <option key={t} value={t}>{t}</option>
                        ))}
                      </select>
                      <select
                        className={styles.fieldSelect}
                        value={col.fkColumn}
                        onChange={(e) => handleColumnChange(idx, "fkColumn", e.target.value)}
                        disabled={!col.fkTable}
                      >
                        <option value="">—</option>
                        {col.fkTable && pkColumnsForTable(col.fkTable).map((pk) => (
                          <option key={pk} value={pk}>{pk}</option>
                        ))}
                      </select>
                    </>
                  ) : (
                    <>
                      <span className={styles.fkPlaceholder}></span>
                      <span className={styles.fkPlaceholder}></span>
                    </>
                  )}
                  <button className={styles.removeBtn} onClick={() => handleRemoveAttribute(idx)}>
                    &times;
                  </button>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              <button className={styles.addAttrBtn} onClick={handleAddAttribute}>
                + AGREGAR NUEVO ATRIBUTO
              </button>
              <button className={styles.saveBtn} onClick={handleSave}>
                GUARDAR CONFIGURACIÓN DE TABLA
              </button>
              <button className={styles.backBtnInline} onClick={onBackToDashboard}>
                ← VOLVER AL PANEL
              </button>
            </div>

            {saved && (
              <div className={styles.savedBanner}>
                Esquema guardado correctamente
                <button className={styles.proceedBtn} onClick={onGoToEthics}>
                  AVANZAR A ALCABALA ÉTICA →
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className={styles.emptyState}>
            <p>Seleccione una tabla de la izquierda para editar sus metadatos</p>
            <p className={styles.emptyHint}>o cree una nueva tabla escribiendo su nombre</p>
            <button className={styles.backBtn} onClick={onBackToDashboard}>← VOLVER AL PANEL</button>
          </div>
        )}
      </main>
    </div>
  );
}
