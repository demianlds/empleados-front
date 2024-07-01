document.addEventListener("DOMContentLoaded", function() {
    const apiUrl = "https://demkan808.pythonanywhere.com/empleados";
    const employeeForm = document.getElementById("employeeForm");
    const employeeList = document.getElementById("employeeList");
    const employeeId = document.getElementById("employeeId");

    // Fetch employees on page load
    fetchEmployees();

    employeeForm.addEventListener("submit", function(e) {
        e.preventDefault();
        const id = employeeId.value;
        const nombre = document.getElementById("nombre").value;
        const apellido = document.getElementById("apellido").value;
        const email = document.getElementById("email").value;
        const telefono = document.getElementById("telefono").value;
        const direccion = document.getElementById("direccion").value;

        const employee = { nombre, apellido, email, telefono, direccion };

        if (id) {
            updateEmployee(id, employee);
        } else {
            createEmployee(employee);
        }
    });

    function fetchEmployees() {
        fetch(apiUrl)
            .then(response => response.json())
            .then(data => renderEmployees(data))
            .catch(error => console.error("Error fetching employees:", error));
    }

    function renderEmployees(employees) {
        employeeList.innerHTML = "";
        employees.forEach(employee => {
            const employeeDiv = document.createElement("div");
            employeeDiv.className = "employee";
            employeeDiv.innerHTML = `
                <div>${employee.nombre}</div>
                <div>${employee.apellido}</div>
                <div>${employee.email}</div>
                <div>${employee.telefono}</div>
                <div>${employee.direccion}</div>
                <div>
                    <button onclick="editEmployee('${employee.id}')">Editar</button>
                    <button onclick="deleteEmployee('${employee.id}')">Eliminar</button>
                </div>
            `;
            employeeList.appendChild(employeeDiv);
        });
    }

    function createEmployee(employee) {
        fetch(apiUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        })
        .then(response => response.json())
        .then(data => {
            fetchEmployees();
            employeeForm.reset();
        })
        .catch(error => console.error("Error creating employee:", error));
    }

    function updateEmployee(id, employee) {
        fetch(`${apiUrl}/${id}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(employee)
        })
        .then(response => response.json())
        .then(data => {
            fetchEmployees();
            employeeForm.reset();
            employeeId.value = "";
        })
        .catch(error => console.error("Error updating employee:", error));
    }

    function editEmployee(id) {
        fetch(`${apiUrl}/${id}`)
            .then(response => response.json())
            .then(employee => {
                document.getElementById("employeeId").value = employee.id;
                document.getElementById("nombre").value = employee.nombre;
                document.getElementById("apellido").value = employee.apellido;
                document.getElementById("email").value = employee.email;
                document.getElementById("telefono").value = employee.telefono;
                document.getElementById("direccion").value = employee.direccion;
            })
            .catch(error => console.error("Error fetching employee:", error));
    }

    function deleteEmployee(id) {
        fetch(`${apiUrl}/${id}`, {
            method: "DELETE"
        })
        .then(response => response.json())
        .then(data => fetchEmployees())
        .catch(error => console.error("Error deleting employee:", error));
    }

    // Expose functions to global scope
    window.editEmployee = editEmployee;
    window.deleteEmployee = deleteEmployee;
});
