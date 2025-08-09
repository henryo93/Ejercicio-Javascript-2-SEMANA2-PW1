// Calculadora de Calificaciones Finales
// Autor: Sistema de Calificaciones
// Descripción: Calcula la nota final basada en tres parciales con validaciones completas

class GradeCalculator {
    constructor() {
        this.parcial1Input = document.getElementById('parcial1');
        this.parcial2Input = document.getElementById('parcial2');
        this.parcial3Input = document.getElementById('parcial3');
        this.calculateBtn = document.getElementById('calculateBtn');
        this.clearBtn = document.getElementById('clearBtn');
        this.resultContainer = document.getElementById('resultContainer');
        this.finalScore = document.getElementById('finalScore');
        this.resultMessage = document.getElementById('resultMessage');
        
        this.inicializarAplicacion();
    }

    // Inicializar event listeners
    inicializarAplicacion() {
        this.calculateBtn.addEventListener('click', () => this.calculateGrade());
        this.clearBtn.addEventListener('click', () => this.clearForm());
        
        // Validación en tiempo real mientras el usuario escribe
        [this.parcial1Input, this.parcial2Input, this.parcial3Input].forEach(input => {
            input.addEventListener('input', () => this.validateInputRealTime(input));
            input.addEventListener('blur', () => this.validateInputOnBlur(input));
        });

        // Permitir calcular con Enter
        document.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.calculateGrade();
            }
        });
    }

    // Validación en tiempo real
    validateInputRealTime(input) {
        const value = parseFloat(input.value);
        const maxValues = { 'parcial1': 30, 'parcial2': 30, 'parcial3': 40 };
        const maxValue = maxValues[input.id];

        // Remover clases de error previas
        input.classList.remove('is-invalid', 'is-valid');

        if (input.value === '') {
            return;
        }

        if (isNaN(value) || value < 0 || value > maxValue) {
            input.classList.add('is-invalid');
        } else {
            input.classList.add('is-valid');
        }
    }

    // Validación al perder el foco
    validateInputOnBlur(input) {
        if (input.value !== '' && input.classList.contains('is-invalid')) {
            const maxValues = { 'parcial1': 30, 'parcial2': 30, 'parcial3': 40 };
            const maxValue = maxValues[input.id];
            const parcialNames = { 'parcial1': '1.er Parcial', 'parcial2': '2.º Parcial', 'parcial3': '3.er Parcial' };
            
            Swal.fire({
                icon: 'warning',
                title: 'Valor inválido',
                text: `El ${parcialNames[input.id]} debe estar entre 0 y ${maxValue} puntos.`,
                confirmButtonColor: '#667eea',
                timer: 3000,
                timerProgressBar: true
            });
        }
    }

    // Validar todos los campos
    validateAllInputs() {
        const parcial1 = this.parcial1Input.value.trim();
        const parcial2 = this.parcial2Input.value.trim();
        const parcial3 = this.parcial3Input.value.trim();

        // Verificar campos vacíos
        if (parcial1 === '' || parcial2 === '' || parcial3 === '') {
            Swal.fire({
                icon: 'error',
                title: 'Campos incompletos',
                text: 'Por favor, ingresa todas las notas parciales.',
                confirmButtonColor: '#667eea',
                showClass: {
                    popup: 'animate__animated animate__shakeX'
                }
            });
            return false;
        }

        // Convertir a números
        const nota1 = parseFloat(parcial1);
        const nota2 = parseFloat(parcial2);
        const nota3 = parseFloat(parcial3);

        // Verificar que sean números válidos
        if (isNaN(nota1) || isNaN(nota2) || isNaN(nota3)) {
            Swal.fire({
                icon: 'error',
                title: 'Valores inválidos',
                text: 'Por favor, ingresa solo números válidos.',
                confirmButtonColor: '#667eea',
                showClass: {
                    popup: 'animate__animated animate__shakeX'
                }
            });
            return false;
        }

        // Validar rangos específicos
        const validations = [
            { value: nota1, max: 30, name: '1.er Parcial' },
            { value: nota2, max: 30, name: '2.º Parcial' },
            { value: nota3, max: 40, name: '3.er Parcial' }
        ];

        for (let validation of validations) {
            if (validation.value < 0 || validation.value > validation.max) {
                Swal.fire({
                    icon: 'error',
                    title: 'Rango inválido',
                    text: `La nota del ${validation.name} debe estar entre 0 y ${validation.max} puntos.`,
                    confirmButtonColor: '#667eea',
                    showClass: {
                        popup: 'animate__animated animate__shakeX'
                    }
                });
                return false;
            }
        }

        return { nota1, nota2, nota3 };
    }

    // Calcular la calificación final
    calculateGrade() {
        const validation = this.validateAllInputs();
        if (!validation) return;

        const { nota1, nota2, nota3 } = validation;
        
        // Calcular la nota final (suma directa)
        const notaFinal = nota1 + nota2 + nota3;
        
        // Obtener mensaje según la calificación
        const mensaje = this.getGradeMessage(notaFinal);
        const colorClass = this.getGradeColorClass(notaFinal);
        
        // Mostrar resultado con animación
        this.displayResult(notaFinal, mensaje, colorClass);
        
        // Mostrar notificación de éxito
        Swal.fire({
            icon: 'success',
            title: '¡Cálculo realizado!',
            text: `Tu calificación final es: ${notaFinal.toFixed(2)} - ${mensaje}`,
            confirmButtonColor: '#667eea',
            timer: 4000,
            timerProgressBar: true,
            showClass: {
                popup: 'animate__animated animate__bounceIn'
            }
        });
    }

    // Obtener mensaje según la calificación
    getGradeMessage(score) {
        if (score >= 0 && score <= 59) return 'Reprobado';
        if (score >= 60 && score <= 79) return 'Bueno';
        if (score >= 80 && score <= 89) return 'Muy Bueno';
        if (score >= 90 && score <= 100) return 'Sobresaliente';
        return 'Fuera de rango';
    }

    // Obtener clase de color según la calificación
    getGradeColorClass(score) {
        if (score >= 0 && score <= 59) return 'score-reprobado';
        if (score >= 60 && score <= 79) return 'score-bueno';
        if (score >= 80 && score <= 89) return 'score-muy-bueno';
        if (score >= 90 && score <= 100) return 'score-sobresaliente';
        return 'score-reprobado';
    }

    // Mostrar resultado
    displayResult(score, message, colorClass) {
        // Limpiar clases de color previas
        this.finalScore.className = `result-score ${colorClass}`;
        this.resultMessage.className = `result-message ${colorClass}`;
        
        // Animación de contador
        this.animateScore(score);
        this.resultMessage.textContent = message;
        
        // Mostrar contenedor de resultado
        this.resultContainer.style.display = 'block';
        this.resultContainer.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    // Animación del puntaje
    animateScore(targetScore) {
        let currentScore = 0;
        const increment = targetScore / 30; // 30 frames de animación
        const timer = setInterval(() => {
            currentScore += increment;
            if (currentScore >= targetScore) {
                currentScore = targetScore;
                clearInterval(timer);
            }
            this.finalScore.textContent = currentScore.toFixed(2);
        }, 50);
    }

    // Limpiar formulario
    clearForm() {
        Swal.fire({
            title: '¿Estás seguro?',
            text: 'Se borrarán todos los datos ingresados.',
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: '#667eea',
            cancelButtonColor: '#6c757d',
            confirmButtonText: 'Sí, limpiar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                // Limpiar inputs
                this.parcial1Input.value = '';
                this.parcial2Input.value = '';
                this.parcial3Input.value = '';
                
                // Remover clases de validación
                [this.parcial1Input, this.parcial2Input, this.parcial3Input].forEach(input => {
                    input.classList.remove('is-valid', 'is-invalid');
                });
                
                // Ocultar resultado
                this.resultContainer.style.display = 'none';
                
                // Enfocar primer campo
                this.parcial1Input.focus();
                
                Swal.fire({
                    icon: 'success',
                    title: '¡Formulario limpiado!',
                    text: 'Puedes ingresar nuevas calificaciones.',
                    confirmButtonColor: '#667eea',
                    timer: 2000,
                    timerProgressBar: true
                });
            }
        });
    }
}

// Inicializar la calculadora cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', () => {
    new GradeCalculator();
    
    // Mostrar mensaje de bienvenida
    Swal.fire({
        title: '¡Bienvenido!',
        text: 'Calculadora de Calificaciones Finales lista para usar.',
        icon: 'info',
        confirmButtonColor: '#667eea',
        timer: 3000,
        timerProgressBar: true,
        showClass: {
            popup: 'animate__animated animate__fadeInDown'
        }
    });
});

// Prevenir el envío del formulario por defecto
document.getElementById('gradeForm').addEventListener('submit', (e) => {
    e.preventDefault();
});

// Manejo global de errores
window.addEventListener('error', (e) => {
    console.error('Error en la aplicación:', e.error);
    Swal.fire({
        icon: 'error',
        title: 'Error inesperado',
        text: 'Ha ocurrido un error. Por favor, recarga la página.',
        confirmButtonColor: '#667eea'
    });
});

// Mensaje cuando se sale de la página (si hay datos)
window.addEventListener('beforeunload', (e) => {
    const inputs = [
        document.getElementById('parcial1'),
        document.getElementById('parcial2'),
        document.getElementById('parcial3')
    ];
    
    const hasData = inputs.some(input => input.value.trim() !== '');
    
    if (hasData) {
        e.preventDefault();
        e.returnValue = '¿Estás seguro de que quieres salir? Se perderán los datos ingresados.';
    }
});