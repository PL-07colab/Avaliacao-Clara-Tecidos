import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, query, getDocs, orderBy } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
import { getAuth, signInWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBq5-rTViqgp7whpsvUlQ-X2UoZkE631gE",
    authDomain: "avaliacao-vendedoras-clara.firebaseapp.com",
    projectId: "avaliacao-vendedoras-clara",
    storageBucket: "avaliacao-vendedoras-clara.firebasestorage.app",
    messagingSenderId: "1035329147981",
    appId: "1:1035329147981:web:7cc1402b47b74f750eb804",
    measurementId: "G-QBC2RKY1JR"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

const EMAIL_ADM = "admin2864@gmail.com"; 

const modal = document.getElementById('modalSenhaClara');
const painel = document.getElementById('painelConteudo');
const inputSenha = document.getElementById('campoSenhaClara');
const btnEntrar = document.getElementById('btnAcessarClara');
const tabelaCorpo = document.getElementById('tabelaCorpo');
const filtroVendedora = document.getElementById('filtroVendedora');
const filtroDataInicio = document.getElementById('filtroDataInicio');
const filtroDataFim = document.getElementById('filtroDataFim');
const totalSpan = document.getElementById('totalAvaliacoes');

btnEntrar.addEventListener('click', async () => {
    const senhaDigitada = inputSenha.value;
    btnEntrar.innerText = "Verificando...";
    btnEntrar.disabled = true;

    try {
        await signInWithEmailAndPassword(auth, EMAIL_ADM, senhaDigitada);
        modal.style.display = 'none';
        painel.style.display = 'block';
        carregarDados();
    } catch (error) {
        alert("Acesso Negado: Senha incorreta.");
        inputSenha.value = "";
    } finally {
        btnEntrar.innerText = "Entrar no Painel";
        btnEntrar.disabled = false;
    }
});

inputSenha.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') btnEntrar.click();
});

async function carregarDados() {
    const vendedoraSel = filtroVendedora.value;
    const dataInicio = filtroDataInicio.value; 
    const dataFim = filtroDataFim.value;       
    
    tabelaCorpo.innerHTML = "<tr><td colspan='4'>Buscando dados...</td></tr>";
    
    try {
        const q = query(collection(db, "avaliacoes"), orderBy("data_envio", "desc"));
        const querySnapshot = await getDocs(q);
        tabelaCorpo.innerHTML = ""; 
        let totalContado = 0;

        querySnapshot.forEach((doc) => {
            const dados = doc.data();
            
            // Converte "DD/MM/YYYY" do banco para "YYYY-MM-DD" para comparação
            const partesData = dados.data_envio.split(',')[0].trim().split('/');
            const dataBancoISO = `${partesData[2]}-${partesData[1]}-${partesData[0]}`;

            const bateVendedora = (vendedoraSel === "todos" || dados.vendedora === vendedoraSel);
            
            // Lógica de filtragem por período
            let bateData = true;
            if (dataInicio && dataBancoISO < dataInicio) bateData = false;
            if (dataFim && dataBancoISO > dataFim) bateData = false;

            if (bateVendedora && bateData) {
                totalContado++;
                tabelaCorpo.innerHTML += `
                    <tr>
                        <td>${dados.data_envio}</td>
                        <td>${dados.vendedora}</td>
                        <td>${dados.nota} ⭐</td>
                        <td>${dados.comentario || '-'}</td>
                    </tr>
                `;
            }
        });
        totalSpan.innerText = totalContado;
    } catch (error) {
        console.error(error);
        tabelaCorpo.innerHTML = "<tr><td colspan='4'>Erro ao carregar dados.</td></tr>";
    }
}

// Event Listeners
filtroVendedora.addEventListener('change', carregarDados);
filtroDataInicio.addEventListener('change', carregarDados);
filtroDataFim.addEventListener('change', carregarDados);

document.getElementById('btnLimpar').addEventListener('click', () => {
    filtroVendedora.value = "todos";
    filtroDataInicio.value = "";
    filtroDataFim.value = "";
    carregarDados();
});
