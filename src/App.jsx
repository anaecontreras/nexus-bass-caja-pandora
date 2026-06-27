import { useState, useEffect } from "react";
import { initDatastore, getDatastore, setActiveProject } from "./utils/datastore";
import LoginScreen from "./components/LoginScreen";
import DashboardScreen from "./components/DashboardScreen";
import SchemaBuilderScreen from "./components/SchemaBuilderScreen";
import EthicalCheckpointScreen from "./components/EthicalCheckpointScreen";
import ApiMockScreen from "./components/ApiMockScreen";
import TerminalScreen from "./components/TerminalScreen";
import styles from "./App.module.css";

export default function App() {
  const [screen, setScreen] = useState(1);
  const [loggedUser, setLoggedUser] = useState(null);
  const [activeProject, setActiveProjectState] = useState("");
  const [sidebarView, setSidebarView] = useState("general");
  const [selectedTable, setSelectedTable] = useState(null);

  useEffect(() => {
    initDatastore();
    const data = getDatastore();
    if (data) {
      setActiveProjectState(data.active_project);
    }
  }, []);

  const handleLogin = (email) => {
    setLoggedUser(email);
    setScreen(2);
  };

  const handleSelectProject = (projectName) => {
    setActiveProject(projectName);
    setActiveProjectState(projectName);
    setSidebarView("general");
  };

  const handleProjectCreated = (projectName) => {
    setActiveProject(projectName);
    setActiveProjectState(projectName);
    setSelectedTable(null);
    setScreen(3);
  };

  const handleTableSelect = (tableName) => {
    setSelectedTable(tableName);
  };

  const handleSchemaSaved = () => {
    setSelectedTable(null);
  };

  const handleGoToSchema = () => {
    setSelectedTable(null);
    setScreen(3);
  };

  const handleGoToEthics = () => {
    setScreen(4);
  };

  const handleGoToApiMock = () => {
    setScreen(5);
  };

  const handleEthicsPassed = () => {
    setScreen(5);
  };

  const handleGoToTerminal = () => {
    setScreen(6);
  };

  const handleBackToDashboard = () => {
    setSidebarView("general");
    setSelectedTable(null);
    setScreen(2);
  };

  const handleLogout = () => {
    setLoggedUser(null);
    setSidebarView("general");
    setSelectedTable(null);
    setScreen(1);
  };

  const commonProps = {
    loggedUser,
    activeProject,
    sidebarView,
    setSidebarView,
    selectedTable,
    setSelectedTable,
    onSelectProject: handleSelectProject,
    onProjectCreated: handleProjectCreated,
    onTableSelect: handleTableSelect,
    onSchemaSaved: handleSchemaSaved,
    onGoToSchema: handleGoToSchema,
    onGoToEthics: handleGoToEthics,
    onGoToApiMock: handleGoToApiMock,
    onEthicsPassed: handleEthicsPassed,
    onGoToTerminal: handleGoToTerminal,
    onBackToDashboard: handleBackToDashboard,
    onLogout: handleLogout,
  };

  return (
    <div className={styles.app}>
      <div className={styles.container}>
        {screen === 1 && <LoginScreen onLogin={handleLogin} />}
        {screen === 2 && <DashboardScreen {...commonProps} />}
        {screen === 3 && <SchemaBuilderScreen {...commonProps} />}
        {screen === 4 && <EthicalCheckpointScreen {...commonProps} />}
        {screen === 5 && <ApiMockScreen {...commonProps} />}
        {screen === 6 && <TerminalScreen {...commonProps} />}
      </div>
    </div>
  );
}
