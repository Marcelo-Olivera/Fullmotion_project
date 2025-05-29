import styles from './Titulo.module.css'

interface Tituloprops {
    titulo: string;
    h1?: string;
    highlight: string;
}

function Titulo({ titulo, h1, highlight }: Tituloprops){
    return(
            <>
            <div className={styles.containerTexto}>
                <div className={styles.tituloContainer}>
                    <span className={styles.titulo}>{titulo}</span>
                    <span className={styles.borda}></span>
                </div>
                <h1>
                    {h1}<span className={styles.highlight}>{highlight}</span>
                </h1>
            </div>
            </>
)
}

export default Titulo;
