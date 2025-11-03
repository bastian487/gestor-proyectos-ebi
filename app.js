document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Estado de la Aplicación (El JSON) ---
    let projectData = {
        teamName: "",
        projectName: "",
        members: [],
        stages: {
            descubrimiento: {
                tasks: [],
                evaluation: { competency: "", score: 6, justification: "" } // Default 6 (Moderado)
            },
            interpretacion: {
                tasks: [],
                evaluation: { competency: "", score: 6, justification: "" }
            },
            ideacion: {
                tasks: [],
                evaluation: { competency: "", score: 6, justification: "" }
            },
            experimentacion: {
                tasks: [],
                evaluation: { competency: "", score: 6, justification: "" }
            },
            evolucion: {
                tasks: [],
                evaluation: { competency: "", score: 6, justification: "" }
            }
        }
    };

    // --- 2. Datos Pedagógicos (Competencias y Descripciones) ---
    const competencies = [
        { id: "ce5.1-6.2", text: "CE 5.1/6.2 - Resolución de Problemas (Creatividad y Autonomía)" },
        { id: "ce5.3", text: "CE 5.3 - Comunicación de Ideas Técnicas" },
        { id: "ce5.4-6.4", text: "CE 5.4/6.4 - Evaluación de Impacto (Social, Ambiental)" },
        { id: "ce5.5-6.5", text: "CE 5.5/6.5 - Análisis y Fabricación de Sistemas" },
        { id: "ce6.3", text: "CE 6.3 - Pensamiento Computacional y Documentación" },
        { id: "ce5.7-6.7", text: "CE 5.7/6.7 - Trabajo en Equipo y Cooperación" },
        { id: "ce6.6", text: "CE 6.6 - Reflexión y Solución de Problemas (Metacognición)" }
    ];

    const stageDescriptions = {
        descubrimiento: "Tengo un desafío. ¿Cómo lo abordo? Es la fase para empatizar y entender las necesidades reales de los usuarios.",
        interpretacion: "Aprendí algo. ¿Cómo lo interpreto? Es la fase para organizar la información, encontrar patrones y definir el problema concreto.",
        ideacion: "Veo una oportunidad. ¿Qué puedo crear? Fase de lluvia de ideas (brainstorming) para generar muchas soluciones sin filtro.",
        experimentacion: "Tengo una idea. ¿Cómo la construyo? Fase de prototipar, crear modelos rápidos y de bajo costo para probar las ideas.",
        evolucion: "Intenté algo nuevo. ¿Cómo evolucionarlo? Fase de recibir feedback (retroalimentación), aprender de los fallos e iterar la solución."
    };

    // --- ¡NUEVA! Función para la escala de evaluación ---
    function getScaleDescription(score) {
        if (score <= 2) return "📉 Avance mínimo (1-2)";
        if (score <= 4) return "😕 Avance escaso (3-4)";
        if (score <= 6) return "🤔 Avance moderado (5-6)";
        if (score <= 8) return "👍 Avance significativo (7-8)";
        return "🚀 Avance destacado (9-10)";
    }


    // --- 3. Referencias al DOM ---
    const sidebarLinks = document.querySelectorAll('.nav-links a');
    const contentEl = document.getElementById('content');
    const pageTitleEl = document.getElementById('page-title').querySelector('span'); // Apuntar al span
    const saveBtn = document.getElementById('save-json');
    const loadInput = document.getElementById('load-json');
    const exportPdfBtn = document.getElementById('export-pdf');

    let currentPage = 'equipo';

    // --- 4. Lógica de Navegación ---
    function navigateTo(page) {
        currentPage = page;
        renderContent();
        sidebarLinks.forEach(link => {
            link.classList.toggle('active', link.dataset.page === page);
        });
    }

    sidebarLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            navigateTo(e.target.dataset.page);
        });
    });

    // --- 5. Lógica de Renderizado (Generación de HTML) ---
    function renderContent() {
        switch (currentPage) {
            case 'equipo':
                renderEquipoPage();
                break;
            case 'descubrimiento':
            case 'interpretacion':
            case 'ideacion':
            case 'experimentacion':
            case 'evolucion':
                renderStagePage(currentPage);
                break;
            default:
                renderEquipoPage();
        }
    }

    // Renderiza la página "Equipo y Proyecto" (Más amigable)
    function renderEquipoPage() {
        pageTitleEl.textContent = 'Tu Equipo y Proyecto';
        contentEl.innerHTML = `
            <div class="card">
                <h2>¡Hola, equipo! 👋</h2>
                <div class="form-group">
                    <label for="project-name">¿Cómo se llama su proyecto?</label>
                    <input type="text" id="project-name" data-key="projectName" value="${projectData.projectName}" placeholder="Ej: El Robot Limpiador de Salón">
                </div>
                <div class="form-group">
                    <label for="team-name">¿Cuál es el nombre de su equipo?</label>
                    <input type="text" id="team-name" data-key="teamName" value="${projectData.teamName}" placeholder="Ej: Los Makers de 9B">
                </div>
                <div class="form-group">
                    <label for="team-members">¿Quiénes son los integrantes? (separados por coma)</label>
                    <input type="text" id="team-members" data-key="members" value="${projectData.members.join(', ')}" placeholder="Ej: Ana, Juan, María, Luis">
                </div>
            </div>
        `;
    }

    // Renderiza una página de Etapa (Template general con escala 1-10)
    function renderStagePage(stageName) {
        const stageData = projectData.stages[stageName];
        pageTitleEl.textContent = `Etapa: ${stageName.charAt(0).toUpperCase() + stageName.slice(1)}`;
        
        const tasksHtml = stageData.tasks.map((task, index) => `
            <li class="task-item ${task.done ? 'done' : ''}">
                <input type="checkbox" data-task-index="${index}" ${task.done ? 'checked' : ''}>
                <span>${task.text}</span>
                <button class="delete-task" data-task-index="${index}">&times;</button>
            </li>
        `).join('');

        const competencyOptions = competencies.map(c => `
            <option value="${c.id}" ${stageData.evaluation.competency === c.id ? 'selected' : ''}>
                ${c.text}
            </option>
        `).join('');
        
        const evalScore = stageData.evaluation.score;
        const evalDescription = getScaleDescription(evalScore);

        contentEl.innerHTML = `
            <div class="card">
                <h2>${pageTitleEl.textContent}</h2>
                <p class="description">${stageDescriptions[stageName]}</p>
                
                <h3>Tareas de la Etapa</h3>
                <ul class="task-list">${tasksHtml}</ul>
                
                <div class="form-group" style="margin-top: 20px;">
                    <label for="new-task">¿Qué toca hacer ahora?</label>
                    <input type="text" id="new-task" placeholder="Escribir la nueva tarea y presionar Enter (Ej: Investigar sobre sensores)">
                </div>
            </div>
            
            <div class="card">
                <h2>Autoevaluación de la Etapa</h2>
                <p class="description">
                    Como equipo, evalúen su desempeño en ESTA etapa. Esto es clave para la 
                    evaluación formativa y la metacognición.
                </p>
                
                <div class="form-group">
                    <label for="eval-competency">Competencia Específica (CE) más importante en esta etapa:</label>
                    <select id="eval-competency" data-key="competency">
                        <option value="">Seleccionar una competencia...</option>
                        ${competencyOptions}
                    </select>
                </div>
                
                <div class="form-group">
                    <label for="eval-score">Autoevaluación (Nota del 1 al 10): ${evalScore}</label>
                    <input type="range" id="eval-score" min="1" max="10" value="${evalScore}" data-key="score" style="width: 100%;">
                    <p class="eval-description" id="eval-description-text">${evalDescription}</p>
                </div>
                
                <div class="form-group">
                    <label for="eval-justification">Justificación (¿Por qué se ponen esa nota?):</label>
                    <textarea id="eval-justification" data-key="justification" placeholder="¡Cuenten qué hicieron bien y qué pueden mejorar! Sean honestos.">${stageData.evaluation.justification}</textarea>
                </div>
            </div>
        `;
    }

    // --- 6. Manejo de Eventos Dinámicos (Inputs, Tareas, etc.) ---
    
    contentEl.addEventListener('input', (e) => {
        const target = e.target;
        
        if (currentPage === 'equipo') {
            if (target.dataset.key === 'members') {
                projectData.members = target.value.split(',').map(m => m.trim());
            } else if (target.dataset.key) {
                projectData[target.dataset.key] = target.value;
            }
        }
        
        if (projectData.stages[currentPage]) {
            const evalData = projectData.stages[currentPage].evaluation;
            
            if (target.dataset.key === 'competency') {
                evalData.competency = target.value;
            }
            if (target.dataset.key === 'score') {
                const newScore = parseInt(target.value, 10);
                evalData.score = newScore;
                
                // Actualizar la UI en vivo
                target.previousElementSibling.textContent = `Autoevaluación (Nota del 1 al 10): ${newScore}`;
                document.getElementById('eval-description-text').textContent = getScaleDescription(newScore);
            }
            if (target.dataset.key === 'justification') {
                evalData.justification = target.value;
            }
        }
    });

    // Delegación de eventos para Tareas (Click y Enter)
    contentEl.addEventListener('click', (e) => {
        const target = e.target;
        
        if (target.type === 'checkbox' && target.dataset.taskIndex) {
            const index = parseInt(target.dataset.taskIndex, 10);
            projectData.stages[currentPage].tasks[index].done = target.checked;
            target.parentElement.classList.toggle('done', target.checked);
        }
        
        if (target.classList.contains('delete-task') && target.dataset.taskIndex) {
            const index = parseInt(target.dataset.taskIndex, 10);
            projectData.stages[currentPage].tasks.splice(index, 1);
            renderContent();
        }
    });

    contentEl.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && e.target.id === 'new-task') {
            e.preventDefault();
            const taskText = e.target.value.trim();
            if (taskText) {
                projectData.stages[currentPage].tasks.push({ text: taskText, done: false });
                e.target.value = "";
                renderContent();
            }
        }
    });

    // --- 7. Lógica de Guardar y Cargar JSON ---
    // (Idéntica a la anterior, sin cambios)
    saveBtn.addEventListener('click', () => {
        const filename = `${projectData.projectName.replace(/\s+/g, '-') || 'proyecto-ebi'}.json`;
        const dataStr = JSON.stringify(projectData, null, 4);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    });

    loadInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const loadedData = JSON.parse(event.target.result);
                projectData = loadedData;
                navigateTo(currentPage); 
            } catch (err) {
                console.error("Error al cargar o parsear el archivo JSON:", err);
                alert("Error: El archivo seleccionado no es un JSON válido.");
            }
        };
        reader.readAsText(file);
        loadInput.value = null;
    });

    // --- 8. Lógica de Exportación a PDF (CORREGIDA y ACTUALIZADA) ---

    // Constantes de formato para el PDF (A4)
    const MARGIN = 20;
    const PAGE_WIDTH = 210;
    const PAGE_HEIGHT = 297;
    const CONTENT_WIDTH = PAGE_WIDTH - (MARGIN * 2);
    const LINE_HEIGHT = 7; // Altura de línea en mm

    let doc;
    let yPos; // Posición vertical (se resetea en cada página)

    function addNewPage() {
        doc.addPage();
        yPos = MARGIN;
    }

    function checkPageBreak(heightNeeded) {
        if (yPos + heightNeeded > PAGE_HEIGHT - MARGIN) {
            addNewPage();
        }
    }

    // Función principal de exportación
    function exportToPDF() {
        // --- ¡BUG FIX! ---
        // Inicializar jsPDF aquí, solo cuando se hace clic en el botón.
        // Esto evita el error si el script de la CDN aún no ha cargado.
        const { jsPDF } = window.jspdf;
        
        doc = new jsPDF('p', 'mm', 'a4');
        yPos = MARGIN;

        // --- Portada ---
        doc.setFontSize(24).setFont(undefined, 'bold');
        doc.text(projectData.projectName || "Sin Título", PAGE_WIDTH / 2, yPos, { align: 'center' });
        yPos += 20;

        doc.setFontSize(18).setFont(undefined, 'normal');
        doc.text(`Equipo: ${projectData.teamName || "Sin Nombre"}`, PAGE_WIDTH / 2, yPos, { align: 'center' });
        yPos += 15;

        doc.setFontSize(14).setFont(undefined, 'bold');
        doc.text("Integrantes:", MARGIN, yPos);
        yPos += LINE_HEIGHT * 1.5;

        doc.setFontSize(12).setFont(undefined, 'normal');
        projectData.members.forEach(member => {
            if (member.trim() !== "") {
                doc.text(`- ${member.trim()}`, MARGIN + 10, yPos);
                yPos += LINE_HEIGHT;
            }
        });

        // --- Contenido de las Etapas ---
        Object.keys(projectData.stages).forEach(stageName => {
            const stageData = projectData.stages[stageName];
            addNewPage();
            
            const title = `Etapa: ${stageName.charAt(0).toUpperCase() + stageName.slice(1)}`;
            doc.setFontSize(18).setFont(undefined, 'bold');
            doc.text(title, MARGIN, yPos);
            doc.line(MARGIN, yPos + 2, MARGIN + CONTENT_WIDTH, yPos + 2);
            yPos += 10;

            // Descripción
            doc.setFontSize(11).setFont(undefined, 'italic');
            const descLines = doc.splitTextToSize(stageDescriptions[stageName], CONTENT_WIDTH);
            checkPageBreak(descLines.length * (LINE_HEIGHT - 2));
            doc.text(descLines, MARGIN, yPos);
            yPos += descLines.length * (LINE_HEIGHT - 2) + 10;

            // Tareas
            checkPageBreak(10 + LINE_HEIGHT * stageData.tasks.length);
            doc.setFontSize(14).setFont(undefined, 'bold');
            doc.text("Tareas de la Etapa", MARGIN, yPos);
            yPos += LINE_HEIGHT * 1.5;
            
            doc.setFontSize(12).setFont(undefined, 'normal');
            if (stageData.tasks.length === 0) {
                doc.text("- Sin tareas registradas.", MARGIN + 5, yPos);
                yPos += LINE_HEIGHT;
            } else {
                stageData.tasks.forEach(task => {
                    checkPageBreak(LINE_HEIGHT);
                    const status = task.done ? '[X]' : '[ ]';
                    const taskLines = doc.splitTextToSize(`${status} ${task.text}`, CONTENT_WIDTH - 5);
                    doc.text(taskLines, MARGIN + 5, yPos);
                    yPos += taskLines.length * LINE_HEIGHT;
                });
            }
            yPos += 10;

            // --- Evaluación (Actualizada para 1-10) ---
            checkPageBreak(45); // Un poco más de espacio
            doc.setFontSize(14).setFont(undefined, 'bold');
            doc.text("Autoevaluación de la Etapa", MARGIN, yPos);
            yPos += LINE_HEIGHT * 1.5;

            doc.setFontSize(12).setFont(undefined, 'normal');
            
            const compText = competencies.find(c => c.id === stageData.evaluation.competency)?.text || 'No seleccionada';
            doc.setFont(undefined, 'bold').text("Competencia:", MARGIN, yPos);
            doc.setFont(undefined, 'normal').text(compText, MARGIN + 35, yPos);
            yPos += LINE_HEIGHT;

            // Calificación (1-10)
            doc.setFont(undefined, 'bold').text("Calificación:", MARGIN, yPos);
            doc.setFont(undefined, 'normal').text(`${stageData.evaluation.score} / 10`, MARGIN + 35, yPos);
            yPos += LINE_HEIGHT;

            // Descripción de la escala (¡Nuevo!)
            doc.setFont(undefined, 'bold').text("Desempeño:", MARGIN, yPos);
            doc.setFont(undefined, 'normal').text(getScaleDescription(stageData.evaluation.score), MARGIN + 35, yPos);
            yPos += LINE_HEIGHT;

            // Justificación
            doc.setFont(undefined, 'bold').text("Justificación:", MARGIN, yPos);
            yPos += LINE_HEIGHT;
            doc.setFontSize(11).setFont(undefined, 'italic');
            const justText = stageData.evaluation.justification || "Sin justificación.";
            const justLines = doc.splitTextToSize(justText, CONTENT_WIDTH - 5);
            checkPageBreak(justLines.length * (LINE_HEIGHT - 2));
            doc.text(justLines, MARGIN + 5, yPos);
        });

        // --- Footer y Paginación ---
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10).setFont(undefined, 'normal');
        for (let i = 1; i <= pageCount; i++) {
            doc.setPage(i);
            const footerText = `© 2024 Sebastián Dutruel | Memoria Técnica del Proyecto | Página ${i} de ${pageCount}`;
            doc.text(footerText, PAGE_WIDTH / 2, PAGE_HEIGHT - 10, { align: 'center' });
        }

        // --- Guardar el archivo ---
        doc.save(`${projectData.projectName.replace(/\s+/g, '-') || 'memoria-tecnica-ebi'}.pdf`);
    }

    exportPdfBtn.addEventListener('click', exportToPDF);

    // --- 9. Inicialización ---
    navigateTo('equipo');
});