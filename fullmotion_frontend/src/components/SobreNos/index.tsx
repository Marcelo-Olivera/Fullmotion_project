import styles from "./SobreNos.module.css";
import { FaCheckCircle } from "react-icons/fa";
import Titulo from "../Titulo";

function SobreNos() {
    return (
        <section id="sobreNos" className={styles.sobreNos}>
            <div className={styles.titulo}>
                <Titulo
                    titulo="Sobre nós"
                    h1="Quem é a "
                    highlight="Fullmotion?" 
                />
            </div>
            <div className={styles.containerTexto}>
                <p>
                    A Fullmotion é um consultório especializado em fisioterapia e massoterapia,
                    focado no seu bem-estar e qualidade de vida. Nossos profissionais altamente
                    qualificados oferecem tratamentos personalizados para dores musculares,
                    lesões esportivas, reabilitação pós-cirúrgica e muito mais. Se você busca
                    alívio da dor, melhora da mobilidade ou apenas um momento de relaxamento,
                    temos a solução ideal para você!
                </p>
                <p>
                    Oferecemos técnicas avançadas como massagem terapêutica, liberação miofascial,
                    pilates clínico e reabilitação funcional, sempre com atendimento humanizado e
                    focado em suas necessidades. Aqui, você encontra um ambiente acolhedor,
                    equipamentos modernos e um time dedicado ao seu progresso.
                </p>
                <p>
                    Agende sua consulta agora e experimente o que há de melhor em fisioterapia e
                    bem-estar. Seu corpo merece esse cuidado! Fullmotion – movimento, saúde e
                    qualidade de vida para você
                </p>
                <div className={styles.containerDiferenciais}>
                    <ul>
                        <li className={styles.check}>
                            <FaCheckCircle size={48} />Atendimento personalizado e humanizado
                        </li>
                        <li className={styles.check}>
                            <FaCheckCircle size={48} />Profissionais altamente qualificados
                        </li>
                        <li className={styles.check}>
                            <FaCheckCircle size={48} />Técnicas avançadas e equipamentos modernos
                        </li>
                        <li className={styles.check}>
                            <FaCheckCircle size={48} />Ambiente acolhedor e seguro
                        </li>
                    </ul>
                </div>
            </div>
            <div className={styles.containerImagem}>
                <div className={styles.parallax}></div>
            </div>
        </section>
    );
}

export default SobreNos;
