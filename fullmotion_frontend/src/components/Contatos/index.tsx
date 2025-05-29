import Titulo from '../Titulo';
import styles from './Contatos.module.css';
import ContatosCards from '../ContatosCards'


function Contatos() {
    return(
        <section id='contatos' className={styles.contatos}>
        <Titulo
            titulo="Contatos"
            h1='Entre em '
            highlight='contato'
        />
        <div className={styles.contatosCards}>
            <ContatosCards
                titulo = 'Valqueire'
                nomeRua=  'Rua das Rosas'
                numero = '97'
                bairro= 'Valqueire'
                cidade= 'Rio de Janeiro'
                telefone= '(21) 99999-9999'
                email= 'meuemail@meuemail.com'
                />
                <ContatosCards
                titulo = 'Barra da Tijuca'
                nomeRua=  'Avenida das Américas'
                numero = '12700'
                bairro= 'Barra da Tijuca'
                cidade= 'Rio de Janeiro'
                telefone= '(21) 99999-9999'
                email= 'meuemail@meuemail.com'
                />
        </div>
        </section>
    )
}

export default Contatos;

// utilizar <link> para navegar entre as páginas