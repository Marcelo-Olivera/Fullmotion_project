import styles from './ContatosCards.module.css';
import { FaWhatsapp } from "react-icons/fa6";
import { IoLocationOutline } from "react-icons/io5";
import { GoMail } from "react-icons/go";
import { GrInstagram } from "react-icons/gr";

interface ContatosCardsprops {
    titulo: string;
    nomeRua: string;
    numero?: string;
    bairro: string;
    cidade: string;
    telefone: string;
    email: string;
}

function ContatosCards({ titulo, nomeRua, numero, bairro, cidade, telefone, email }: ContatosCardsprops) {
    return (
        <div className={styles.contatosContainer}>
                <div className={styles.contatosUnidade}>
                    <h1>{titulo}</h1>
                </div>
                <div className={styles.localizacao}>
                    <IoLocationOutline size={30} />
                    <p>{nomeRua}, {numero}, {bairro}, {cidade}</p>
                </div>
                <div className={styles.telefone}>
                    <FaWhatsapp size={30} /> 
                    <p>{telefone}</p>
                </div>
                <div className={styles.email}>
                    <GoMail size={30} /> 
                    <p>{email}</p>
                </div>
                <div className={styles.redesSociais}>
                    <GrInstagram size={30} />
                    <p>Instagram</p>
                </div>
        </div>
    )
}

export default ContatosCards;