// Variables globales para la calculadora
let currentInput = '0';
let previousInput = null;
let operator = null;
let waitingForNewInput = false;
let historial = [];

// Elementos del DOM
const display = document.getElementById('display');
const operacionActual = document.getElementById('operacionActual');
const historialList = document.getElementById('historial');

// Función para aplicar estilos adaptativos según la longitud del contenido
function applyAdaptiveStyles(element, textLength) {
    // Limpiar clases previas
    element.classList.remove('contenido-largo', 'contenido-muy-largo', 'contenido-extremo');
    
    if (textLength > 35) {
        element.classList.add('contenido-extremo');
    } else if (textLength > 25) {
        element.classList.add('contenido-muy-largo');
    } else if (textLength > 15) {
        element.classList.add('contenido-largo');
    }
}

// Función para aplicar estilos adaptativos a elementos internos
function applyAdaptiveInnerStyles(element, className, textLength) {
    element.classList.remove(`${className}-largo`, `${className}-muy-largo`, `${className}-extremo`);
    
    if (textLength > 35) {
        element.classList.add(`${className}-extremo`);
    } else if (textLength > 25) {
        element.classList.add(`${className}-muy-largo`);
    } else if (textLength > 15) {
        element.classList.add(`${className}-largo`);
    }
}

// Función para actualizar la pantalla
function updateDisplay() {
    // Limpiar estilos especiales antes de actualizar
    display.classList.remove('resultado-resaltado', 'operacion-con-resultado', 'resultado',
                            'contenido-largo', 'contenido-muy-largo', 'contenido-extremo');
    display.innerHTML = '';
    
    let displayText = '';
    
    // Si hay una operación en curso, mostrar la operación completa
    if (operator && previousInput !== null && !waitingForNewInput) {
        const operatorSymbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        displayText = `${formatNumber(previousInput)} ${operatorSymbols[operator]} ${formatNumber(currentInput)}`;
        display.textContent = displayText;
        operacionActual.textContent = '';
    } else if (operator && previousInput !== null && waitingForNewInput) {
        // Mostrar solo el operador cuando se está esperando el segundo número
        const operatorSymbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        displayText = `${formatNumber(previousInput)} ${operatorSymbols[operator]}`;
        display.textContent = displayText;
        operacionActual.textContent = '';
    } else {
        // Si no hay operación, mostrar solo el número actual
        displayText = formatNumber(currentInput);
        display.textContent = displayText;
        operacionActual.textContent = '';
    }
    
    // Aplicar estilos adaptativos según la longitud
    applyAdaptiveStyles(display, displayText.length);
}

// Función para formatear números con separadores de miles
function formatNumber(num) {
    if (num === '0' || num === '') return '0';
    
    // Si es un número decimal, mantener los decimales
    if (num.toString().includes('.')) {
        const parts = num.toString().split('.');
        parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        return parts.join('.');
    }
    
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

// Función para quitar formato de número
function unformatNumber(formattedNum) {
    return formattedNum.toString().replace(/,/g, '');
}

// Función para agregar números
function appendNumber(number) {
    if (waitingForNewInput) {
        currentInput = number;
        waitingForNewInput = false;
    } else {
        if (currentInput === '0') {
            currentInput = number;
        } else {
            currentInput += number;
        }
    }
    
    updateDisplay();
}

// Función para agregar punto decimal
function appendDecimal() {
    if (waitingForNewInput) {
        currentInput = '0.';
        waitingForNewInput = false;
    } else if (!currentInput.includes('.')) {
        currentInput += '.';
    }
    
    updateDisplay();
}

// Función para operaciones básicas
function operate(nextOperator) {
    const inputValue = parseFloat(unformatNumber(currentInput));
    
    if (previousInput === null) {
        previousInput = inputValue;
    } else if (operator) {
        const result = performCalculation();
        
        if (result === null) return; // Error en el cálculo
        
        // Agregar al historial la operación completada
        const operatorSymbols = {
            '+': '+',
            '-': '-',
            '*': '×',
            '/': '÷'
        };
        const operationString = `${formatNumber(previousInput)} ${operatorSymbols[operator]} ${formatNumber(currentInput)} = ${formatNumber(result)}`;
        addToHistory(operationString);
        
        currentInput = result.toString();
        previousInput = result;
    }
    
    waitingForNewInput = true;
    operator = nextOperator;
    
    // Mostrar solo el número y el operador, sin duplicar
    const operatorSymbols = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    };
    display.textContent = `${formatNumber(previousInput)} ${operatorSymbols[operator]}`;
    operacionActual.textContent = '';
}

// Función para realizar cálculos
function performCalculation() {
    const prev = previousInput;
    const current = parseFloat(unformatNumber(currentInput));
    
    if (operator === null || isNaN(prev) || isNaN(current)) {
        return null;
    }
    
    let result;
    
    switch (operator) {
        case '+':
            result = prev + current;
            break;
        case '-':
            result = prev - current;
            break;
        case '*':
            result = prev * current;
            break;
        case '/':
            if (current === 0) {
                alert('Error: No se puede dividir por cero');
                return null;
            }
            result = prev / current;
            break;
        default:
            return null;
    }
    
    // Redondear a 10 decimales para evitar problemas de precisión
    return Math.round(result * 10000000000) / 10000000000;
}

// Función para calcular resultado
function calculate() {
    if (operator === null || previousInput === null) {
        return;
    }
    
    const result = performCalculation();
    
    if (result === null) return;
    
    // Agregar al historial
    const operatorSymbols = {
        '+': '+',
        '-': '-',
        '*': '×',
        '/': '÷'
    };
    
    const operationString = `${formatNumber(previousInput)} ${operatorSymbols[operator]} ${formatNumber(currentInput)} = ${formatNumber(result)}`;
    addToHistory(operationString);
    
    // Mostrar inmediatamente la operación con el resultado resaltado más grande
    const operationPart = `${formatNumber(previousInput)} ${operatorSymbols[operator]} ${formatNumber(currentInput)} =`;
    const resultPart = formatNumber(result);
    
    // Crear los elementos span
    const operationSpan = document.createElement('span');
    operationSpan.className = 'operacion-parte';
    operationSpan.textContent = operationPart;
    
    const resultSpan = document.createElement('span');
    resultSpan.className = 'resultado-grande';
    resultSpan.textContent = resultPart;
    
    // Aplicar estilos adaptativos según la longitud
    const totalLength = operationPart.length + resultPart.length;
    applyAdaptiveStyles(display, totalLength);
    applyAdaptiveInnerStyles(operationSpan, 'operacion', operationPart.length);
    applyAdaptiveInnerStyles(resultSpan, 'resultado', resultPart.length);
    
    // Usar innerHTML para crear el efecto de tamaños diferentes - INMEDIATO
    display.innerHTML = '';
    display.appendChild(operationSpan);
    display.appendChild(resultSpan);
    display.classList.add('operacion-con-resultado', 'resultado-resaltado');
    operacionActual.textContent = '';
    
    // Configurar variables para continuar calculando
    currentInput = result.toString();
    operator = null;
    previousInput = null;
    waitingForNewInput = true;
}

// Función para limpiar todo (AC)
function clearAll() {
    currentInput = '0';
    previousInput = null;
    operator = null;
    waitingForNewInput = false;
    
    // Limpiar todos los estilos especiales del display
    display.classList.remove('resultado-resaltado', 'operacion-con-resultado', 'resultado', 
                            'contenido-largo', 'contenido-muy-largo', 'contenido-extremo');
    display.innerHTML = '';
    display.textContent = '0';
    operacionActual.textContent = '';
}

// Función para limpiar entrada actual (CE)
function clearEntry() {
    currentInput = '0';
    
    // Limpiar estilos especiales si están activos
    display.classList.remove('resultado-resaltado', 'operacion-con-resultado', 'resultado',
                            'contenido-largo', 'contenido-muy-largo', 'contenido-extremo');
    display.innerHTML = '';
    updateDisplay();
}

// Función para borrar último dígito
function backspace() {
    if (currentInput.length > 1) {
        currentInput = currentInput.slice(0, -1);
    } else {
        currentInput = '0';
    }
    updateDisplay();
}

// Función para calcular porcentaje
function calculatePercentage() {
    const current = parseFloat(unformatNumber(currentInput));
    let result;
    let operationString;
    
    if (previousInput !== null && operator) {
        // Porcentaje en contexto de operación
        result = previousInput * current / 100;
        operationString = `${formatNumber(previousInput)} × ${formatNumber(current)}% = ${formatNumber(result)}`;
    } else {
        // Porcentaje simple
        result = current / 100;
        operationString = `${formatNumber(current)}% = ${formatNumber(result)}`;
    }
    
    addToHistory(operationString);
    
    // Mostrar la operación completa en la pantalla
    display.value = operationString;
    operacionActual.textContent = '';
    
    // Después de 2 segundos, mostrar solo el resultado
    setTimeout(() => {
        currentInput = result.toString();
        waitingForNewInput = true;
        updateDisplay();
    }, 2000);
    
    // Animación de resultado
    display.classList.add('resultado');
    setTimeout(() => {
        display.classList.remove('resultado');
    }, 1000);
}

// Función para raíz cuadrada
function squareRoot() {
    const current = parseFloat(unformatNumber(currentInput));
    if (current < 0) {
        alert('Error: No se puede calcular la raíz cuadrada de un número negativo');
        return;
    }
    
    const result = Math.sqrt(current);
    const operationString = `√${formatNumber(current)} = ${formatNumber(result)}`;
    addToHistory(operationString);
    
    // Mostrar la operación completa en la pantalla
    display.value = operationString;
    operacionActual.textContent = '';
    
    // Después de 2 segundos, mostrar solo el resultado
    setTimeout(() => {
        currentInput = result.toString();
        waitingForNewInput = true;
        updateDisplay();
    }, 2000);
    
    // Animación de resultado
    display.classList.add('resultado');
    setTimeout(() => {
        display.classList.remove('resultado');
    }, 1000);
}

// Función para agregar al historial
function addToHistory(operation) {
    historial.unshift(operation);
    
    // Mantener solo las últimas 10 operaciones
    if (historial.length > 10) {
        historial.pop();
    }
    
    updateHistoryDisplay();
}

// Función para actualizar el display del historial
function updateHistoryDisplay() {
    historialList.innerHTML = '';
    
    if (historial.length === 0) {
        historialList.innerHTML = '<li class="text-muted">No hay operaciones recientes</li>';
        return;
    }
    
    historial.forEach((operation, index) => {
        const li = document.createElement('li');
        li.textContent = operation;
        li.style.animationDelay = `${index * 0.1}s`;
        li.classList.add('fade-in');
        historialList.appendChild(li);
    });
}

// Función para limpiar el historial
function clearHistory() {
    if (historial.length === 0) {
        return; // No hay nada que limpiar
    }
    
    // Confirmar antes de limpiar
    if (confirm('¿Estás seguro de que quieres limpiar todo el historial?')) {
        historial = [];
        updateHistoryDisplay();
        
        // Mostrar mensaje de confirmación temporal
        const tempMessage = document.createElement('li');
        tempMessage.className = 'text-success';
        tempMessage.textContent = '✓ Historial limpiado';
        historialList.innerHTML = '';
        historialList.appendChild(tempMessage);
        
        // Volver al mensaje normal después de 2 segundos
        setTimeout(() => {
            updateHistoryDisplay();
        }, 2000);
    }
}

// Función para manejar entrada de teclado
function handleKeyboard(event) {
    const key = event.key;
    
    // Números
    if (key >= '0' && key <= '9') {
        appendNumber(key);
        event.preventDefault();
    }
    
    // Operadores
    else if (key === '+' || key === '-' || key === '*' || key === '/') {
        operate(key);
        event.preventDefault();
    }
    
    // Punto decimal
    else if (key === '.' || key === ',') {
        appendDecimal();
        event.preventDefault();
    }
    
    // Enter o igual
    else if (key === 'Enter' || key === '=') {
        calculate();
        event.preventDefault();
    }
    
    // Escape para limpiar
    else if (key === 'Escape') {
        clearAll();
        event.preventDefault();
    }
    
    // Backspace
    else if (key === 'Backspace') {
        backspace();
        event.preventDefault();
    }
    
    // Delete para CE
    else if (key === 'Delete') {
        clearEntry();
        event.preventDefault();
    }
}

// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function() {
    updateDisplay();
    updateHistoryDisplay();
    
    // Agregar listener para el teclado
    document.addEventListener('keydown', handleKeyboard);
});

// Función especial para animaciones suaves
function addFadeInAnimation() {
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .fade-in {
            animation: fadeIn 0.3s ease-out forwards;
        }
    `;
    document.head.appendChild(style);
}

// Inicializar animaciones
addFadeInAnimation();