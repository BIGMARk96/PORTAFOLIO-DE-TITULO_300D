function guardarUsuario(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validar longitud del usuario
    if (usuario.length < 6) {
        alert('El usuario debe tener al menos 6 caracteres');
        return;
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un correo electrónico válido');
        return;
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    if (!passwordRegex.test(password)) {
        alert('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número');
        return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const user = {
        usuario,
        email,
        password,
        tipo: 'usuario'
    };

    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];
    usuarios.push(user);
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Registro exitoso');
    window.location.href = 'index.html';
}

function validarIngreso(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('loginUsuario').value;
    const password = document.getElementById('loginPassword').value;

    // Obtener usuarios del localStorage
    const usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Buscar el usuario
    const usuarioEncontrado = usuarios.find(user => 
        user.usuario === usuario && user.password === password
    );

    if (usuarioEncontrado) {
        // Guardar sesión del usuario
        localStorage.setItem('usuarioActual', JSON.stringify(usuarioEncontrado));
        alert('¡Bienvenido ' + usuario + '!');
        window.location.href = 'form-usuario.html'; // Cambiamos esta línea para redirigir a form-usuario.html
    } else {
        alert('Usuario o contraseña incorrectos');
    }
}

// calculo de calorias
function calcularCalorias(event) {
  event.preventDefault();

  // Obtener valores del formulario
  const sexo = document.getElementById('sexo').value;
  const edad = parseInt(document.getElementById('edad').value);
  const peso = parseFloat(document.getElementById('peso').value);
  const altura = parseInt(document.getElementById('altura').value);
  const actividad = parseFloat(document.getElementById('actividad').value);
  const objetivo = document.getElementById('objetivo').value;

  // Calcular TMB (Tasa Metabólica Basal) usando Harris-Benedict
  let tmb;
  if (sexo === 'hombre') {
      tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad);
  } else {
      tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad);
  }

  // Calcular calorías totales según nivel de actividad
  let caloriasDiarias = tmb * actividad;

  // Ajustar según objetivo
  switch(objetivo) {
      case 'superavit':
          caloriasDiarias += 500;
          break;
      case 'deficit':
          caloriasDiarias -= 500;
          break;
  }

  // Generar rutina según nivel de actividad
  let rutina = generarRutina(actividad, objetivo);

  // Guardar resultados en localStorage
  const resultados = {
      tmb: Math.round(tmb),
      caloriasDiarias: Math.round(caloriasDiarias),
      objetivo: objetivo,
      datosUsuario: {
          sexo, edad, peso, altura, actividad
      },
      rutina: rutina
  };
  localStorage.setItem('resultadosCalorias', JSON.stringify(resultados));

  // Redirigir a la página de resultados
  window.location.href = 'rutina-cal.html';
}

// Función para mostrar el mensaje de bienvenida
function mostrarMensajeBienvenida() {
    const welcomeMessage = document.getElementById('welcomeMessage');
    const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
    const nutricionistaActual = JSON.parse(localStorage.getItem('nutricionistaActual'));
    
    if (welcomeMessage) {
        if (nutricionistaActual) {
            welcomeMessage.textContent = `Nutricionista: ${nutricionistaActual.nombre}`;
        } else if (usuarioActual) {
            welcomeMessage.textContent = `Bienvenido ${usuarioActual.usuario}`;
        }
    }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', mostrarMensajeBienvenida);

function cerrarSesion() {
    localStorage.removeItem('nutricionistaActual');
    localStorage.removeItem('usuarioActual');
    window.location.href = 'index.html';
}

function generarRutina(actividad, objetivo) {
    const series = objetivo === 'superavit' ? 4 : 3;
    
    function getReps(ejercicio) {
        const ejerciciosPesados = [
            'Press banca', 
            'Press inclinado', 
            'Dominadas', 
            'Remo', 
            'Pull-over', 
            'Sentadillas', 
            'Peso muerto',
            'Prensa'
        ];
        return ejerciciosPesados.some(ej => ejercicio.includes(ej)) ? '10' : '12';
    }

    const rutinas = {
        "1.2": { // Sedentario
            "Lunes": {
                titulo: "Full Body",
                ejercicios: [
                    `Press banca ${series}x${getReps('Press banca')}`,
                    `Sentadillas ${series}x${getReps('Sentadillas')}`,
                    `Remo ${series}x${getReps('Remo')}`,
                    `Peso muerto ${series}x${getReps('Peso muerto')}`
                ]
            }
        },
        "1.375": { // Ligera
            "Lunes": {
                titulo: "Tren Superior",
                ejercicios: [
                    `Press banca ${series}x${getReps('Press banca')}`,
                    `Press militar ${series}x${getReps('Press militar')}`,
                    `Remo ${series}x${getReps('Remo')}`,
                    `Curl bíceps ${series}x${getReps('Curl bíceps')}`
                ]
            },
            "Jueves": {
                titulo: "Tren Inferior",
                ejercicios: [
                    `Sentadillas ${series}x${getReps('Sentadillas')}`,
                    `Peso muerto ${series}x${getReps('Peso muerto')}`,
                    `Extensiones ${series}x${getReps('Extensiones')}`,
                    `Gemelos ${series}x${getReps('Gemelos')}`
                ]
            }
        },
        "1.55": { // Moderada
            "Lunes": {
                titulo: "Pecho y Tríceps",
                ejercicios: [
                    `Press banca ${series}x${getReps('Press banca')}`,
                    `Aperturas ${series}x${getReps('Aperturas')}`,
                    `Fondos ${series}x${getReps('Fondos')}`,
                    `Extensiones ${series}x${getReps('Extensiones')}`
                ]
            },
            "Martes": {
                titulo: "Espalda y Bíceps",
                ejercicios: [
                    `Dominadas ${series}x${getReps('Dominadas')}`,
                    `Remo ${series}x${getReps('Remo')}`,
                    `Curl bíceps ${series}x${getReps('Curl bíceps')}`,
                    `Martillo ${series}x${getReps('Martillo')}`
                ]
            },
            "Jueves": {
                titulo: "Pierna",
                ejercicios: [
                    `Sentadillas ${series}x${getReps('Sentadillas')}`,
                    `Peso muerto ${series}x${getReps('Peso muerto')}`,
                    `Prensa ${series}x${getReps('Prensa')}`,
                    `Gemelos ${series}x${getReps('Gemelos')}`
                ]
            },
            "Viernes": {
                titulo: "Hombros",
                ejercicios: [
                    `Press militar ${series}x${getReps('Press militar')}`,
                    `Elevaciones ${series}x${getReps('Elevaciones')}`,
                    `Face pull ${series}x${getReps('Face pull')}`,
                    `Pájaros ${series}x${getReps('Pájaros')}`
                ]
            }
        },
        "1.725": { // Intensa y muy intensa (1.9 también usa esta)
            "Lunes": {
                titulo: "Pecho",
                ejercicios: [
                    `Press banca ${series}x${getReps('Press banca')}`,
                    `Press inclinado ${series}x${getReps('Press inclinado')}`,
                    `Aperturas ${series}x${getReps('Aperturas')}`,
                    `Fondos ${series}x${getReps('Fondos')}`
                ]
            },
            "Martes": {
                titulo: "Espalda",
                ejercicios: [
                    `Dominadas ${series}x${getReps('Dominadas')}`,
                    `Remo ${series}x${getReps('Remo')}`,
                    `Pull-over ${series}x${getReps('Pull-over')}`,
                    `Hiperextensiones ${series}x${getReps('Hiperextensiones')}`
                ]
            },
            "Miércoles": {
                titulo: "Pierna",
                ejercicios: [
                    `Sentadillas ${series}x${getReps('Sentadillas')}`,
                    `Peso muerto ${series}x${getReps('Peso muerto')}`,
                    `Prensa ${series}x${getReps('Prensa')}`,
                    `Gemelos ${series}x${getReps('Gemelos')}`
                ]
            },
            "Jueves": {
                titulo: "Hombros",
                ejercicios: [
                    `Press militar ${series}x${getReps('Press militar')}`,
                    `Elevaciones ${series}x${getReps('Elevaciones')}`,
                    `Face pull ${series}x${getReps('Face pull')}`,
                    `Pájaros ${series}x${getReps('Pájaros')}`
                ]
            },
            "Viernes": {
                titulo: "Brazos",
                ejercicios: [
                    `Curl bíceps ${series}x${getReps('Curl bíceps')}`,
                    `Martillo ${series}x${getReps('Martillo')}`,
                    `Extensiones ${series}x${getReps('Extensiones')}`,
                    `Press francés ${series}x${getReps('Press francés')}`
                ]
            },
            "Sábado": {
                titulo: "Full Body",
                ejercicios: [
                    `Press banca ${series}x${getReps('Press banca')}`,
                    `Dominadas ${series}x${getReps('Dominadas')}`,
                    `Sentadillas ${series}x${getReps('Sentadillas')}`,
                    `Press militar ${series}x${getReps('Press militar')}`
                ]
            }
        }
    };

    return rutinas[actividad] || rutinas["1.9"];
}

function guardarNutricionista(event) {
    event.preventDefault();
    
    const nombre = document.getElementById('nombre').value;
    const usuario = document.getElementById('usuario').value;
    const numeroLicencia = document.getElementById('numeroLicencia').value;
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validar nombre y apellido
    if (!/^[A-Za-zÁáÉéÍíÓóÚúÑñ]+ [A-Za-zÁáÉéÍíÓóÚúÑñ]+$/.test(nombre)) {
        alert('Por favor ingresa nombre y apellido válidos');
        return;
    }

    // Validar longitud del usuario
    if (usuario.length < 6) {
        alert('El usuario debe tener al menos 6 caracteres');
        return;
    }

    // Validar licencia
    if (!/^[0-9]{8}$/.test(numeroLicencia)) {
        alert('La licencia debe tener exactamente 8 dígitos numéricos');
        return;
    }

    // Validar formato de email
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un correo electrónico válido');
        return;
    }

    // Validar contraseña
    const passwordRegex = /^(?=.*[A-Z])(?=.*[0-9]).{6,}$/;
    if (!passwordRegex.test(password)) {
        alert('La contraseña debe tener al menos 6 caracteres, una mayúscula y un número');
        return;
    }

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    const nutricionista = {
        nombre,
        usuario,
        numeroLicencia,
        email,
        password,
        tipo: 'nutricionista'
    };

    let nutricionistas = JSON.parse(localStorage.getItem('nutricionistas')) || [];
    nutricionistas.push(nutricionista);
    localStorage.setItem('nutricionistas', JSON.stringify(nutricionistas));

    alert('Registro exitoso');
    window.location.href = 'index.html';
}

function validarIngresoNutri(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('loginUsuario').value;
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const nutricionistas = JSON.parse(localStorage.getItem('nutricionistas')) || [];

    const nutricionistaEncontrado = nutricionistas.find(nutri => 
        nutri.usuario === usuario && 
        nutri.email === email && 
        nutri.password === password
    );

    if (nutricionistaEncontrado) {
        localStorage.setItem('nutricionistaActual', JSON.stringify(nutricionistaEncontrado));
        alert('¡Bienvenido ' + nutricionistaEncontrado.nombre + '!');
        window.location.href = 'panel-nutri.html';
    } else {
        alert('Credenciales incorrectas');
    }
} 