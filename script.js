document.addEventListener("DOMContentLoaded", () => {
    const button1 = document.querySelector(".button1");
    const button2 = document.querySelector(".button2");
    const formContainer = document.getElementById("formContainer");
    const citasContainer = document.getElementById("citasContainer");
    const citasTable = document.getElementById("citasTable").getElementsByTagName('tbody')[0];
    const closeFormButton = document.getElementById("closeForm");
    const calendar = document.getElementById("calendar");
    const appointmentForm = document.getElementById("appointmentForm");

    let selectedDate = null;

    // Mostrar el formulario de citas
    button1.addEventListener("click", () => {
        formContainer.classList.remove("hidden");
        citasContainer.classList.add("hidden"); // Ocultar la tabla de citas
    });

    // Mostrar la tabla con las citas
    button2.addEventListener("click", () => {
        citasContainer.classList.remove("hidden");
        formContainer.classList.add("hidden"); // Ocultar el formulario
        displayCitas(); // Mostrar las citas almacenadas
    });

    // Función para mostrar las citas almacenadas
    function displayCitas() {
        const citas = JSON.parse(localStorage.getItem('citas')) || [];

        // Limpiar la tabla antes de agregar las nuevas filas
        citasTable.innerHTML = '';

        // Añadir cada cita a la tabla
        citas.forEach(cita => {
            const row = citasTable.insertRow();
            row.innerHTML = `
                <td>${cita.id}</td>
                <td>${cita.nombre}</td>
                <td>${cita.apellido}</td>
                <td>${cita.dni}</td>
                <td>${cita.telefono}</td>
                <td>${cita.email}</td>
                <td>${cita.fecha}</td>
            `;
        });
    }

    // Botón para cerrar el formulario
    closeFormButton.addEventListener("click", () => {
        formContainer.classList.add("hidden");
        appointmentForm.reset();
        selectedDate = null;
    });

    // Generar calendario
    const occupiedDays = [5, 10, 15, 20]; // Ejemplo: días ocupados

    for (let day = 1; day <= 31; day++) {
        const dayElement = document.createElement("div");
        dayElement.textContent = day;

        if (occupiedDays.includes(day)) {
            dayElement.classList.add("occupied");
        }

        // Permitir la selección de un día disponible
        dayElement.addEventListener("click", () => {
            if (!dayElement.classList.contains("occupied")) {
                selectedDate = day;
                alert(`Fecha seleccionada: Día ${selectedDate}`);
            }
        });

        calendar.appendChild(dayElement);
    }

    // Manejar envío del formulario
    appointmentForm.addEventListener("submit", (e) => {
        e.preventDefault();

        if (!selectedDate) {
            alert("Por favor, selecciona una fecha disponible.");
            return;
        }

        const formData = new FormData(appointmentForm);
        const appointment = {
            id: `CITA-${Date.now()}`,
            nombre: formData.get("nombre"),
            apellido: formData.get("apellido"),
            dni: formData.get("dni"),
            telefono: formData.get("telefono"),
            email: formData.get("email"),
            fecha: selectedDate // Esto es el día seleccionado
        };

        // Guardamos la cita en el LocalStorage
        let citas = JSON.parse(localStorage.getItem('citas')) || [];
        citas.push(appointment);
        localStorage.setItem('citas', JSON.stringify(citas));

        alert(`Cita confirmada con ID: ${appointment.id}`);

        // Cerrar el formulario
        formContainer.classList.add("hidden");
        appointmentForm.reset();

        // Actualizar el calendario para reflejar los días ocupados
        updateCalendar();
    });

    // Mostrar las citas y actualizar el calendario con los días ocupados
    function updateCalendar() {
        const citas = JSON.parse(localStorage.getItem('citas')) || [];
        const ocupados = citas.map(cita => cita.fecha);

        // Limpiar el calendario antes de actualizar
        calendar.innerHTML = '';

        for (let day = 1; day <= 31; day++) {
            const dayElement = document.createElement("div");
            dayElement.textContent = day;

            if (ocupados.includes(day.toString())) {
                dayElement.classList.add("occupied");
            }

            // Permitir la selección de un día disponible
            dayElement.addEventListener("click", () => {
                if (!dayElement.classList.contains("occupied")) {
                    selectedDate = day;
                    alert(`Fecha seleccionada: Día ${selectedDate}`);
                }
            });

            calendar.appendChild(dayElement);
        }
    }

    // Iniciar el calendario con los días ocupados
    updateCalendar();
});
