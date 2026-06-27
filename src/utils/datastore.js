const SEED_DATA = {
  auth_user: { email: "demo@uneti.edu.ve", password: "demo1234" },
  active_project: "Sistema de Gestión de Biblioteca Personal",
  projects: {
    "Sistema de Gestión de Biblioteca Personal": {
      tablas: {
        libros: [
          { id_libro: 1, titulo: "Doña Bárbara", autor: "Rómulo Gallegos", ano_publicacion: 1929, genero: "Novela", disponibilidad: false },
          { id_libro: 2, titulo: "Casas Muertas", autor: "Miguel Otero Silva", ano_publicacion: 1955, genero: "Novela", disponibilidad: false },
          { id_libro: 3, titulo: "Las lanzas coloradas", autor: "Arturo Uslar Pietri", ano_publicacion: 1931, genero: "Histórica", disponibilidad: false },
          { id_libro: 4, titulo: "Cien años de soledad", autor: "Gabriel García Márquez", ano_publicacion: 1967, genero: "Realismo Mágico", disponibilidad: false },
          { id_libro: 5, titulo: "Pedro Páramo", autor: "Juan Rulfo", ano_publicacion: 1955, genero: "Novela", disponibilidad: false },
          { id_libro: 6, titulo: "Ficciones", autor: "Jorge Luis Borges", ano_publicacion: 1944, genero: "Cuento / Filosofía", disponibilidad: false },
          { id_libro: 7, titulo: "Rayuela", autor: "Julio Cortázar", ano_publicacion: 1963, genero: "Contra-novela", disponibilidad: true },
          { id_libro: 8, titulo: "La ciudad y los perros", autor: "Mario Vargas Llosa", ano_publicacion: 1963, genero: "Novela", disponibilidad: true },
          { id_libro: 9, titulo: "El túnel", autor: "Ernesto Sabato", ano_publicacion: 1948, genero: "Existencialismo", disponibilidad: true },
          { id_libro: 10, titulo: "Yo el Supremo", autor: "Augusto Roa Bastos", ano_publicacion: 1974, genero: "Histórica", disponibilidad: true }
        ],
        usuarios: [
          { id_usuario: 101, nombre: "Carlos Mendoza", email: "carlos.mendoza@gmail.com", telefono: "0412-5551122", fecha_registro: "2026-01-10", ciudad: "Caracas" },
          { id_usuario: 102, nombre: "María Alejandra Silva", email: "marialex.silva@gmail.com", telefono: "0416-3334455", fecha_registro: "2026-02-15", ciudad: "Maracay" },
          { id_usuario: 103, nombre: "Alejandro Gómez", email: "gomez.ale@gmail.com", telefono: "0414-2228899", fecha_registro: "2026-03-01", ciudad: "Valencia" },
          { id_usuario: 104, nombre: "Elena Rostro", email: "elena.rostro@gmail.com", telefono: "0426-7773311", fecha_registro: "2026-04-12", ciudad: "Barquisimeto" },
          { id_usuario: 105, nombre: "Ricardo Lugo", email: "ricardo.lugo@gmail.com", telefono: "0412-9990044", fecha_registro: "2026-05-02", ciudad: "Maracaibo" }
        ],
        prestamos: [
          { id_prestamo: 501, id_libro: 7, id_usuario: 101, fecha_salida: "2026-05-15", estatus: "Finalizado" },
          { id_prestamo: 502, id_libro: 8, id_usuario: 102, fecha_salida: "2026-05-17", estatus: "Finalizado" },
          { id_prestamo: 503, id_libro: 9, id_usuario: 103, fecha_salida: "2026-05-19", estatus: "Finalizado" },
          { id_prestamo: 504, id_libro: 10, id_usuario: 104, fecha_salida: "2026-05-20", estatus: "Finalizado" },
          { id_prestamo: 505, id_libro: 1, id_usuario: 105, fecha_salida: "2026-05-22", estatus: "Finalizado" },
          { id_prestamo: 506, id_libro: 2, id_usuario: 101, fecha_salida: "2026-05-25", estatus: "Finalizado" },
          { id_prestamo: 507, id_libro: 1, id_usuario: 102, fecha_salida: "2026-05-28", estatus: "Pendiente" },
          { id_prestamo: 508, id_libro: 2, id_usuario: 103, fecha_salida: "2026-06-02", estatus: "Pendiente" },
          { id_prestamo: 509, id_libro: 3, id_usuario: 104, fecha_salida: "2026-06-08", estatus: "Pendiente" },
          { id_prestamo: 510, id_libro: 4, id_usuario: 105, fecha_salida: "2026-06-12", estatus: "Pendiente" },
          { id_prestamo: 511, id_libro: 5, id_usuario: 101, fecha_salida: "2026-06-18", estatus: "Pendiente" },
          { id_prestamo: 512, id_libro: 6, id_usuario: 102, fecha_salida: "2026-06-22", estatus: "Pendiente" }
        ]
      },
      relaciones: [
        "libros (1) ──► prestamos (N) [FK: id_libro]",
        "usuarios (1) ──► prestamos (N) [FK: id_usuario]"
      ]
    }
  }
};

const STORAGE_KEY = "nexus_datastore";

export function initDatastore() {
  const existing = localStorage.getItem(STORAGE_KEY);
  if (!existing) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DATA));
  }
}

export function getDatastore() {
  const raw = localStorage.getItem(STORAGE_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveDatastore(data) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

export function getActiveProject() {
  const data = getDatastore();
  return data ? data.active_project : null;
}

export function getProjectData(projectName) {
  const data = getDatastore();
  return data && data.projects[projectName] ? data.projects[projectName] : null;
}

export function getTables(projectName) {
  const proj = getProjectData(projectName);
  return proj ? proj.tablas : {};
}

export function getRelations(projectName) {
  const proj = getProjectData(projectName);
  return proj ? proj.relaciones : [];
}

export function setActiveProject(projectName) {
  const data = getDatastore();
  if (data) {
    data.active_project = projectName;
    saveDatastore(data);
  }
}

export function addNewProject(projectName) {
  const data = getDatastore();
  if (data && !data.projects[projectName]) {
    data.projects[projectName] = { tablas: {}, relaciones: [] };
    saveDatastore(data);
  }
}

export function getSchemaForTable(projectName, tableName) {
  const tables = getTables(projectName);
  const records = tables[tableName];
  if (!records || records.length === 0) return [];
  const sample = records[0];
  return Object.keys(sample).map((key) => {
    const val = sample[key];
    let type = "TEXT";
    if (typeof val === "number") type = "INTEGER";
    else if (typeof val === "boolean") type = "BOOLEAN";
    return {
      name: key,
      type,
      isPK: key.toLowerCase().startsWith("id"),
      nullable: key.toLowerCase() !== "id_libro" && key.toLowerCase() !== "id_usuario" && key.toLowerCase() !== "id_prestamo"
    };
  });
}

export function getTableNames(projectName) {
  const tables = getTables(projectName);
  return Object.keys(tables);
}

export function getSchemaTypes() {
  return ["VARCHAR", "INTEGER", "BOOLEAN", "TEXT", "FLOAT", "DATE"];
}

/* Schema metadata persistence for user-defined tables */
export function saveTableSchema(projectName, tableName, columns) {
  const data = getDatastore();
  if (!data || !data.projects[projectName]) return;
  if (!data.projects[projectName].tablas) data.projects[projectName].tablas = {};
  if (!data.projects[projectName].tablas[tableName]) {
    data.projects[projectName].tablas[tableName] = [];
  }
  data.projects[projectName]._schemas = data.projects[projectName]._schemas || {};
  data.projects[projectName]._schemas[tableName] = columns;
  saveDatastore(data);
}

export function getTableSchema(projectName, tableName) {
  const data = getDatastore();
  if (!data || !data.projects[projectName]) return null;
  const schemas = data.projects[projectName]._schemas;
  return schemas && schemas[tableName] ? schemas[tableName] : null;
}

/* Get PK columns for a given table */
export function getTablePKColumns(projectName, tableName) {
  const schema = getTableSchema(projectName, tableName);
  if (schema) return schema.filter((col) => col.isPK).map((col) => col.name);
  const inferred = getSchemaForTable(projectName, tableName);
  return inferred.filter((col) => col.isPK).map((col) => col.name);
}

/* Get all tables except the current one, for FK reference */
export function getAvailableFKTables(projectName, currentTable) {
  return getTableNames(projectName).filter((t) => t !== currentTable);
}

/* Infer FK relations by matching column names against PK columns of other tables */
function inferFKRelations(projectName, tableName) {
  const schema = getTableSchema(projectName, tableName) || getSchemaForTable(projectName, tableName);
  if (!schema || schema.length === 0) return [];
  const allTableNames = getTableNames(projectName);
  const relations = [];
  schema.forEach((col) => {
    allTableNames.forEach((other) => {
      if (other === tableName) return;
      const pkCols = getTablePKColumns(projectName, other);
      pkCols.forEach((pk) => {
        if (col.name === pk) {
          relations.push({ column: col.name, refTable: other, refColumn: pk });
        }
      });
    });
  });
  return relations;
}

/* Get FK relation definitions for a given table from its schema or inferred */
export function getTableFKRelations(projectName, tableName) {
  const schema = getTableSchema(projectName, tableName);
  const explicit = schema
    ? schema.filter((col) => col.isFK && col.fkTable).map((col) => ({
        column: col.name,
        refTable: col.fkTable,
        refColumn: col.fkColumn,
      }))
    : [];
  return explicit.length > 0 ? explicit : inferFKRelations(projectName, tableName);
}

/* Resolve FK references in a set of records for a given table */
export function resolveFKRecords(projectName, tableName, records) {
  const fkRelations = getTableFKRelations(projectName, tableName);
  if (fkRelations.length === 0) return records;
  const tables = getTables(projectName);
  return records.map((record) => {
    const fkInfo = {};
    fkRelations.forEach((fk) => {
      const fkValue = record[fk.column];
      if (fkValue !== undefined) {
        const refRecords = tables[fk.refTable] || [];
        const refRecord = refRecords.find((r) => r[fk.refColumn] === fkValue);
        let displayValue = fkValue;
        if (refRecord) {
          const displayField = Object.keys(refRecord).find(
            (k) => k !== fk.refColumn && typeof refRecord[k] === "string"
          );
          if (displayField) displayValue = refRecord[displayField];
        }
        fkInfo[fk.column] = {
          ref_table: fk.refTable,
          ref_column: fk.refColumn,
          ref_value: displayValue,
        };
      }
    });
    return Object.keys(fkInfo).length > 0 ? { ...record, _fk: fkInfo } : record;
  });
}

/* Generate mock API endpoints based on project tables */
export function getApiEndpoints(projectName) {
  const tables = getTables(projectName);
  const endpoints = [];
  Object.keys(tables).forEach((t) => {
    endpoints.push({ method: "GET", path: `/api/v1/${t}`, table: t });
    endpoints.push({ method: "POST", path: `/api/v1/${t}`, table: t });
    endpoints.push({ method: "PUT", path: `/api/v1/${t}/:id`, table: t });
    endpoints.push({ method: "DELETE", path: `/api/v1/${t}/:id`, table: t });
  });
  return endpoints;
}
