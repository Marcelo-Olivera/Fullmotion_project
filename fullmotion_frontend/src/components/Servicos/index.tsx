// src/components/Servicos/index.tsx
import styles from "./Servicos.module.css";
import ActionAreaCard from "../Cards"; // Seu componente de card
import Titulo from "../Titulo";

function Servicos() {
    return (
        <section id="servicos" className={styles.servicos}>
            <Titulo
                    titulo="Serviços"
                    h1="Nossos "
                    highlight="Serviços" 
                />
            <div className={styles.cards}>
            <ActionAreaCard
                title="lorem ipsum"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos atque ratione voluptatum nisi maiores corporis eos doloribus fuga provident, velit incidunt facere porro aperiam, quam eaque neque. Cum, obcaecati iste."
                image="src/components/Servicos/back1.png"
                className={styles.cardItem} // <--- NOVO: Adicione esta classe aqui
            />
            <ActionAreaCard
                title="lorem ipsum"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos atque ratione voluptatum nisi maiores corporis eos doloribus fuga provident, velit incidunt facere porro aperiam, quam eaque neque. Cum, obcaecati iste."
                image="src/components/Servicos/back2.png"
                className={styles.cardItem} // <--- NOVO: E aqui
            />
            <ActionAreaCard
                title="lorem ipsum"
                description="Lorem ipsum dolor sit amet consectetur adipisicing elit. Dignissimos atque ratione voluptatum nisi maiores corporis eos doloribus fuga provident, velit incidunt facere porro aperiam, quam eaque neque. Cum, obcaecati iste."
                image="src/components/Servicos/back3.png"
                className={styles.cardItem} // <--- NOVO: E aqui
            />
            </div>
        </section>
    );
}

export default Servicos;