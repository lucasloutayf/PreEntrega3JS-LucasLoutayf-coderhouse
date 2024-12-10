// Clase para definir las tasas de impuestos
class TaxRate {
    constructor(incomeLimit, rate) {
        this.incomeLimit = incomeLimit;
        this.rate = rate;
    }
}

// Array de objetos que define las tasas de impuestos
const taxRates = [
    new TaxRate(10000, 0.10), // 10% hasta $10,000
    new TaxRate(30000, 0.20), // 20% hasta $30,000
    new TaxRate(Infinity, 0.30), // 30% para ingresos mayores
];

// Array para almacenar el historial de cálculos
const simulationHistory = JSON.parse(localStorage.getItem('simulationHistory')) || [];

// Función para encontrar la tasa correspondiente al ingreso
const getTaxRate = (income) => taxRates.find(rate => income <= rate.incomeLimit);

// Función para calcular el impuesto
const calculateTax = (income) => {
    const { rate } = getTaxRate(income) || { rate: 0 };
    return {
        rate,
        tax: income * rate,
    };
};

// Función para agregar una entrada al historial y al localStorage
const addSimulationToHistory = (income, tax, rate) => {
    const entry = { income, tax, rate };
    simulationHistory.push(entry);
    localStorage.setItem('simulationHistory', JSON.stringify(simulationHistory));
};

// Función para mostrar el historial en el DOM
const displayHistory = () => {
    const summaryDiv = document.getElementById("summary");
    summaryDiv.innerHTML = ""; // Limpiar historial anterior

    if (simulationHistory.length === 0) {
        summaryDiv.innerHTML = "<p>No hay simulaciones realizadas.</p>";
        return;
    }

    const list = simulationHistory.map(({ income, rate, tax }) => {
        return `
            <p>
                Ingreso: $${income} | Tasa: ${rate * 100}% | Impuesto: $${tax.toFixed(2)}
            </p>
        `;
    }).join("");

    summaryDiv.innerHTML = `
        <h3>Historial de Simulaciones:</h3>
        ${list}
    `;
};

// Inicializar historial al cargar la página
document.addEventListener("DOMContentLoaded", () => {
    displayHistory();

    // Crear elementos dinámicamente
    const summaryContainer = document.createElement("div");
    summaryContainer.id = "summary";
    document.body.appendChild(summaryContainer);
});

// Captura eventos del formulario
const form = document.createElement('form');
form.innerHTML = `
    <label for="incomeInput">Ingrese su ingreso anual en dólares:</label>
    <input type="number" id="incomeInput" placeholder="Ejemplo: 45000" required>
    <button type="submit">Calcular Impuesto</button>
`;

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const income = parseFloat(document.getElementById("incomeInput").value) || 0;

    if (income <= 0) {
        showNotification("Por favor, ingrese un valor numérico válido.", "error");
        return;
    }

    // Obtener resultados del cálculo
    const { rate, tax } = calculateTax(income);

    // Mostrar resultado y agregar al historial
    showNotification(`Para un ingreso de $${income}, el impuesto a pagar es $${tax.toFixed(2)} (Tasa: ${rate * 100}%).`, "success");
    addSimulationToHistory(income, tax, rate);

    // Actualizar historial
    displayHistory();
});

document.body.insertBefore(form, document.querySelector('#summary'));

// Función para mostrar notificaciones
const showNotification = (message, type) => {
    const notification = document.createElement("div");
    notification.className = `notification ${type}`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// Estilos para notificaciones
const style = document.createElement('style');
style.textContent = `
    .notification {
        position: fixed;
        top: 10px;
        left: 50%;
        transform: translateX(-50%);
        padding: 10px 20px;
        color: white;
        border-radius: 5px;
        font-size: 1.2rem;
        z-index: 1000;
    }

    .notification.success {
        background-color: #B8E0F5;
    }

    .notification.error {
        background-color: red;
    }
`;
document.head.appendChild(style);
