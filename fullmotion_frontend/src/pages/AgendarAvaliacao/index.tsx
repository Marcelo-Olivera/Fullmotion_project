import styles from './AgendarAvaliacao.module.css'
import { useState } from 'react';

function AgendarAvaliacao() {
    const [nome, setNome] = useState('');
    const [cpf, setCpf] = useState('');
    const [email, setEmail] = useState('');
    const [telefone, setTelefone] = useState('');
    const [data, setData] = useState('');
    const [cep, setCep] = useState('');
    const [endereco, setEndereco] = useState('');
    const [numero, setNumero] = useState('');
    const [complemento, setComplemento] = useState('');
    const [bairro, setBairro] = useState('');
    const [hora, setHora] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        alert('Avaliação agendada com sucesso!');
    };

    return (
        <div className={styles.bg}>
            <form className={styles.box} onSubmit={handleSubmit}>
                <h2>Agendar Primeira Avaliação</h2>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="nome"
                        value={nome}
                        onChange={e => setNome(e.target.value)}
                        required
                        className={styles.floatingInput}
                        placeholder=" "
                    />
                    <label
                        htmlFor="nome"
                        className={`${styles.floatingLabel} ${nome ? styles.filled : ''}`}
                    >
                        Nome completo
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="cpf"
                        value={cpf}
                        onChange={e => setCpf(e.target.value)}
                        required
                        className={styles.floatingInput}
                        placeholder=" "
                        maxLength={14}
                        pattern="\d{3}\.?\d{3}\.?\d{3}-?\d{2}"
                        title="Digite um CPF válido"
                    />
                    <label
                        htmlFor="cpf"
                        className={`${styles.floatingLabel} ${cpf ? styles.filled : ''}`}
                    >
                        CPF
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="email"
                        id="email"
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className={styles.floatingInput}
                        placeholder=" "
                    />
                    <label
                        htmlFor="email"
                        className={`${styles.floatingLabel} ${email ? styles.filled : ''}`}
                    >
                        E-mail
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="tel"
                        id="telefone"
                        value={telefone}
                        onChange={e => setTelefone(e.target.value)}
                        required
                        className={styles.floatingInput}
                        placeholder=" "
                    />
                    <label
                        htmlFor="telefone"
                        className={`${styles.floatingLabel} ${telefone ? styles.filled : ''}`}
                    >
                        Telefone
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="cep"
                        value={cep}
                        onChange={e => setCep(e.target.value)}
                        required
                        className={styles.floatingInput}
                        placeholder=" "
                        maxLength={9}
                        pattern="\d{5}-?\d{3}"
                        title="Digite um CEP válido"
                    />
                    <label
                        htmlFor="cep"
                        className={`${styles.floatingLabel} ${cep ? styles.filled : ''}`}
                    >
                        CEP
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="endereco"
                        value={endereco}
                        onChange={e => setEndereco(e.target.value)}
                        required
                        className={styles.floatingInput}
                        placeholder=" "
                    />
                    <label
                        htmlFor="endereco"
                        className={`${styles.floatingLabel} ${endereco ? styles.filled : ''}`}
                    >
                        Endereço
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="numero"
                        value={numero}
                        onChange={e => setNumero(e.target.value)}
                        required
                        className={styles.floatingInput}
                        placeholder=" "
                    />
                    <label
                        htmlFor="numero"
                        className={`${styles.floatingLabel} ${numero ? styles.filled : ''}`}
                    >
                        Número
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="complemento"
                        value={complemento}
                        onChange={e => setComplemento(e.target.value)}
                        className={styles.floatingInput}
                        placeholder=" "
                    />
                    <label
                        htmlFor="complemento"
                        className={`${styles.floatingLabel} ${complemento ? styles.filled : ''}`}
                    >
                        Complemento (opcional)
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="text"
                        id="bairro"
                        value={bairro}
                        onChange={e => setBairro(e.target.value)}
                        required
                        className={styles.floatingInput}
                        placeholder=" "
                    />
                    <label
                        htmlFor="bairro"
                        className={`${styles.floatingLabel} ${bairro ? styles.filled : ''}`}
                    >
                        Bairro
                    </label>
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="date"
                        id="data"
                        value={data}
                        onChange={e => setData(e.target.value)}
                        required
                        className={styles.floatingInput}
                    />
                </div>
                <div className={styles.inputGroup}>
                    <input
                        type="time"
                        id="hora"
                        value={hora}
                        onChange={e => setHora(e.target.value)}
                        required
                        className={styles.floatingInput}
                    />
                </div>
                <button type="submit" className={styles.btn}>Agendar</button>
            </form>
        </div>
    );
}

export default AgendarAvaliacao;