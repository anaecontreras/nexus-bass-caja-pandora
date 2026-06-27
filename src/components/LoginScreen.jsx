import { useState } from "react";
import styles from "./LoginScreen.module.css";

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState("demo@uneti.edu.ve");
  const [password, setPassword] = useState("demo1234");
  const [isVerifying, setIsVerifying] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsVerifying(true);
    setTimeout(() => {
      setIsVerifying(false);
      onLogin(email);
    }, 1500);
  };

  return (
    <div className={styles.container}>
      <div className={styles.left}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>⬡</span>
          <h1 className={styles.brandName}>NEXUS-BAAS</h1>
          <span className={styles.subtitle}>Orquestador Soberano de Persistencia Local v2.0</span>
        </div>

        <form className={styles.form} onSubmit={handleSubmit}>
          <div className={styles.field}>
            <label className={styles.label}>CORREO</label>
            <input
              className={styles.input}
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>CONTRASEÑA</label>
            <input
              className={styles.input}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <button
            className={styles.submitBtn}
            type="submit"
            disabled={isVerifying}
          >
            {isVerifying ? "VERIFICANDO ENRUTAMIENTO LAN..." : "INICIAR SESIÓN"}
          </button>
        </form>

        <div className={styles.ip}>IP: 127.0.0.1 | PUERTO: 8000</div>
      </div>

      <div className={styles.right}>
        <div className={styles.manifesto}>
          <h2 className={styles.manifestoTitle}>Misión 4.2 - Despliegue NEXUS-BAAS</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet}>&#x1F7E2;</span> Equipo: Caja de Pandora
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet}>&#x1F7E2;</span> Integrantes: Diana Sierra, Ana Contreras, Darwin Colmenares y Yolimar Ramos
            </li>
          </ul>


          <h2 className={styles.manifestoTitle}>MANIFIESTO POLÍTICO-TÉCNICO</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet}>&#x1F7E2;</span> Célula Activa AIS
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet}>&#x1F7E2;</span> Infraestructura Inmune a Sanciones
            </li>
          </ul>

          <h2 className={styles.manifestoTitle}>ENTREGABLE DEL PROYECTO</h2>
          <ul className={styles.list}>
            <li className={styles.listItem}>
              <span className={styles.bullet}>&#x1F7E2;</span> <a target="_blank" href="https://github.com/anaecontreras/nexus-bass-caja-pandora.git">Repositorio GitHub</a>
            </li>
            <li className={styles.listItem}>
              <span className={styles.bullet}>&#x1F7E2;</span> <a target="_blank" className="linkItem" href="https://www.youtube.com/watch?v=0RrQ49Kiuwc&list=PLTcOzxm2NcYBBAZC-Ya_xqZ_eZ8i0o9NC">Video de validación</a>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
