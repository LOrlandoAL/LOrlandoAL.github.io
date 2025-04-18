const tareaInput = document.getElementById("TareaInput");
const listaTareas = document.getElementById("ListaTareas");

// Cargar tareas al inicio
window.onload = () => {
    const tareasGuardadas = JSON.parse(localStorage.getItem("tareas")) || [];
    tareasGuardadas.forEach(tarea => agregarTarea(tarea));
};

function agregarTarea(tareaObj = null) {
    const text = tareaObj ? tareaObj.texto : tareaInput.value.trim();
    const completado = tareaObj ? tareaObj.completado : false;

    if (text === "") return;

    const li = document.createElement("li");

    const span = document.createElement("span");
    span.textContent = text;
    span.className = "cursor-pointer";
    if (completado) span.classList.add("line-through");

    span.onclick = () => {
        span.classList.toggle("line-through");
        guardarTareas();
    };

    const btn = document.createElement("button");
    btn.textContent = "❌";
    btn.onclick = () => {
        listaTareas.removeChild(li);
        guardarTareas();
    };

    li.appendChild(span);
    li.appendChild(btn);
    listaTareas.appendChild(li);

    if (!tareaObj) tareaInput.value = "";

    guardarTareas();
}

function guardarTareas() {
    const tareas = [];
    listaTareas.querySelectorAll("li").forEach(li => {
        const span = li.querySelector("span");
        tareas.push({
            texto: span.textContent.trim(),
            completado: span.classList.contains("line-through")
        });
    });

    localStorage.setItem("tareas", JSON.stringify(tareas));
}
