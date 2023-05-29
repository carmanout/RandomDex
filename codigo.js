// Carga el archivo JSON
fetch('tipos.json')
    .then(response => response.json())
    .then(data => {
        const tiposDiv = document.getElementById('tipos');
        let tiposActuales = generarCombinacionesTipos(Object.keys(data)); // Empieza con todas las combinaciones de tipos disponibles
        
        // Crea las casillas de verificación para los tipos de Pokémon
        for (const tipo in data) {
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = tipo;
            checkbox.value = tipo;
            
            const label = document.createElement('label');
            label.htmlFor = tipo;
            label.textContent = tipo;

            tiposDiv.appendChild(checkbox);
            tiposDiv.appendChild(label);
            tiposDiv.appendChild(document.createElement('br'));
        }

        // Añade un listener al botón de búsqueda
        document.getElementById('buscar').addEventListener('click', mostrarResultados);
        
        // Añade un listener al botón de reiniciar
        document.getElementById('reiniciar').addEventListener('click', reiniciar);
        
        function mostrarResultados() {
            const checkboxes = tiposDiv.getElementsByTagName('input');
            const tiposSeleccionados = Array.from(checkboxes).filter(checkbox => checkbox.checked).map(checkbox => checkbox.value);
            const eficaciaSeleccionada = parseFloat(document.getElementById('eficacia').value);
            const resultadosDiv = document.getElementById('resultados');
            resultadosDiv.innerHTML = '';
            
            // Busca las combinaciones de tipos que coinciden con todas las eficacias seleccionadas
            const nuevosTipos = [];
            for (const tipoActual of tiposActuales) {
                const tipo1 = tipoActual.split("/")[0];
                const tipo2 = tipoActual.split("/")[1] || tipo1; // Si no hay tipo2, usa el tipo1
                if (tiposSeleccionados.every(tipoSeleccionado => {
                    const eficaciaTipo1 = data[tipo1].eficacia[tipoSeleccionado];
                    const eficaciaTipo2 = data[tipo2].eficacia[tipoSeleccionado];
                    const eficaciaTotal = eficaciaTipo1 * eficaciaTipo2;
                    return eficaciaTotal === eficaciaSeleccionada;
                })) {
                    const p = document.createElement('p');
                    p.textContent = tipoActual;
                    resultadosDiv.appendChild(p);
                    nuevosTipos.push(p.textContent);
                }
            }
            tiposActuales = nuevosTipos;
        }
        
        function reiniciar() {
            // Desmarca todas las casillas de verificación
            const checkboxes = tiposDiv.getElementsByTagName('input');
            for (const checkbox of checkboxes) {
                checkbox.checked = false;
            }
            
            // Limpia los resultados y restaura todas las combinaciones de tipos
            document.getElementById('resultados').innerHTML = '';
            tiposActuales = generarCombinacionesTipos(Object.keys(data));
        }

        // Genera todas las combinaciones posibles de tipos, tanto simples como dobles
        function generarCombinacionesTipos(tipos) {
            let combinaciones = [...tipos]; // Añade los tipos simples
            for (let i = 0; i < tipos.length; i++) {
                for (let j = i+1; j < tipos.length; j++) {
                    combinaciones.push(tipos[i] + "/" + tipos[j]);
                }
            }
            return combinaciones;
        }
    })
    .catch(error => console.error('Error:', error));
