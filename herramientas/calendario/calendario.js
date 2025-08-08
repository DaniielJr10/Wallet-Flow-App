let currentDate = new Date();
let selectedDate = new Date();

const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 
                'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];

function initCalendar() {
    const prevYear = document.getElementById('prevYear');
    const nextYear = document.getElementById('nextYear');
    const prevMonth = document.getElementById('prevMonth');
    const nextMonth = document.getElementById('nextMonth');

    prevYear.addEventListener('click', () => navigateYear(-1));
    nextYear.addEventListener('click', () => navigateYear(1));
    prevMonth.addEventListener('click', () => navigateMonth(-1));
    nextMonth.addEventListener('click', () => navigateMonth(1));

    updateCalendar();
}

function updateCalendar() {
    const monthDisplay = document.getElementById('monthDisplay');
    const calendarDays = document.getElementById('calendar-days');
    
    monthDisplay.textContent = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
    calendarDays.innerHTML = '';

    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
    const prevMonthDays = firstDay.getDay();
    const totalDays = lastDay.getDate();

    // Días del mes anterior
    for (let i = prevMonthDays - 1; i >= 0; i--) {
        const dayElement = createDayElement(new Date(currentDate.getFullYear(), 
                          currentDate.getMonth() - 1, 
                          new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate() - i));
        dayElement.classList.add('other-month');
        calendarDays.appendChild(dayElement);
    }

    // Días del mes actual
    for (let i = 1; i <= totalDays; i++) {
        const dayElement = createDayElement(new Date(currentDate.getFullYear(), 
                          currentDate.getMonth(), i));
        calendarDays.appendChild(dayElement);
    }

    // Días del mes siguiente
    const remainingDays = 42 - (prevMonthDays + totalDays);
    for (let i = 1; i <= remainingDays; i++) {
        const dayElement = createDayElement(new Date(currentDate.getFullYear(), 
                          currentDate.getMonth() + 1, i));
        dayElement.classList.add('other-month');
        calendarDays.appendChild(dayElement);
    }
}

function createDayElement(date) {
    const div = document.createElement('div');
    div.className = 'calendar-day';
    div.textContent = date.getDate();

    if (date.toDateString() === new Date().toDateString()) {
        div.classList.add('today');
    }

    if (date.toDateString() === selectedDate.toDateString()) {
        div.classList.add('selected');
    }

    div.addEventListener('click', () => selectDate(date));
    return div;
}

function selectDate(date) {
    selectedDate = date;
    updateCalendar();
    // Aquí puedes agregar la lógica para manejar la fecha seleccionada
    console.log('Fecha seleccionada:', date.toLocaleDateString());
}

function navigateMonth(delta) {
    currentDate.setMonth(currentDate.getMonth() + delta);
    updateCalendar();
}

function navigateYear(delta) {
    currentDate.setFullYear(currentDate.getFullYear() + delta);
    updateCalendar();
}

document.addEventListener('DOMContentLoaded', initCalendar);
