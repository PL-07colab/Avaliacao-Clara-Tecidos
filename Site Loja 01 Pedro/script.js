import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { getFirestore, collection, addDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

const form = document.getElementById('evaluationForm');
const thanksMessage = document.getElementById('thanksMessage');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const estrelaSelecionada = document.querySelector('input[name="star"]:checked');

    if (!estrelaSelecionada) {
        alert("Por favor, selecione uma nota de 1 a 5 estrelas.");
        return;
    }

    const vendedora = document.getElementById('vendedora').value;
    const comentario = document.getElementById('comentario').value;
    const nota = estrelaSelecionada.value;

    try {
        await addDoc(collection(db, "avaliacoes"), {
            vendedora: vendedora,
            nota: Number(nota),
            comentario: comentario,
            loja: "Clara Tecidos",
            data_envio: new Date().toLocaleString("pt-BR")
        });

        form.style.display = 'none';
        thanksMessage.style.display = 'block';
        form.reset();

    } catch (error) {
        console.error("Erro ao salvar no Firebase:", error);
        alert("Ops! Ocorreu um erro ao enviar sua avaliação. Tente novamente em instantes.");
    }
});