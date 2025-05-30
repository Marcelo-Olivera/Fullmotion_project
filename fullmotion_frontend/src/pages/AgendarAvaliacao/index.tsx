import styles from './AgendarAvaliacao.module.css'
import { useState } from 'react';
import axios from 'axios'; // Importe o Axios

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
    const [message, setMessage] = useState('');
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(''); // Limpa mensagens anteriores
        setIsSuccess(false);

        // Reúne todos os dados do formulário em um objeto,
        // garantindo que os nomes das propriedades correspondam ao DTO do backend (CreateAppointmentDto)
        const appointmentData = {
            fullName: nome,
            cpf,
            email,
            phone: telefone, // Backend espera 'phone', não 'telefone'
            cep,
            address: endereco, // Backend espera 'address', não 'endereco'
            number: numero,
            complement: complemento,
            neighborhood: bairro, // Backend espera 'neighborhood', não 'bairro'
            appointmentDate: data, // Backend espera 'appointmentDate', não 'data'
            appointmentTime: hora, // Backend espera 'appointmentTime', não 'hora'
        };

        try {
            // Requisição POST para o endpoint de agendamentos do backend
            const response = await axios.post('http://localhost:3000/api/appointments', appointmentData);

            console.log('Agendamento realizado com sucesso:', response.data);
            setMessage('Avaliação agendada com sucesso!');
            setIsSuccess(true);
            // Opcional: limpar o formulário após o sucesso
            setNome('');
            setCpf('');
            setEmail('');
            setTelefone('');
            setData('');
            setCep('');
            setEndereco('');
            setNumero('');
            setComplemento('');
            setBairro('');
            setHora('');

        } catch (err: any) { // Captura erros da requisição (ex: validação 400 Bad Request)
            console.error('Erro ao agendar avaliação:', err.response?.data || err.message);
            // Exibe a mensagem de erro do backend (se houver) ou uma genérica
            setMessage(err.response?.data?.message || 'Erro ao agendar avaliação. Verifique os dados e tente novamente.');
            setIsSuccess(false);
        }
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
                {message && (
                    <p className={isSuccess ? styles.successMessage : styles.errorMessage}>
                        {message}
                    </p>
                )}
            </form>
        </div>
    );
}

export default AgendarAvaliacao;