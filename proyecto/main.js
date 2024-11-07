function guardarUsuario(event) {
    event.preventDefault();
    
    const usuario = document.getElementById('usuario').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validar que las contraseñas coincidan
    if (password !== confirmPassword) {
        alert('Las contraseñas no coinciden');
        return;
    }

    // Crear objeto de usuario
    const nuevoUsuario = {
        usuario: usuario,
        password: password
    };

    // Obtener usuarios existentes o crear array vacío
    let usuarios = JSON.parse(localStorage.getItem('usuarios')) || [];

    // Verificar si el usuario ya existe
    if (usuarios.some(user => user.usuario === usuario)) {
        alert('Este nombre de usuario ya existe');
        return;
    }

    // Agregar nuevo usuario
    usuarios.push(nuevoUsuario);

    // Guardar en localStorage
    localStorage.setItem('usuarios', JSON.stringify(usuarios));

    alert('Usuario registrado exitosamente');
    window.location.href = 'ingresa.html'; // Cambiamos la redirección
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

  // Guardar resultados en localStorage
  const resultados = {
      tmb: Math.round(tmb),
      caloriasDiarias: Math.round(caloriasDiarias),
      objetivo: objetivo,
      datosUsuario: {
          sexo, edad, peso, altura, actividad
      }
  };
  localStorage.setItem('resultadosCalorias', JSON.stringify(resultados));

  // Redirigir a la página de resultados
  window.location.href = 'rutina-cal.html';
}

// Función para mostrar el mensaje de bienvenida
function mostrarMensajeBienvenida() {
  const welcomeMessage = document.getElementById('welcomeMessage');
  const usuarioActual = JSON.parse(localStorage.getItem('usuarioActual'));
  
  if (welcomeMessage && usuarioActual) {
      welcomeMessage.textContent = `Bienvenido ${usuarioActual.usuario}`;
  }
}

// Ejecutar cuando el DOM esté cargado
document.addEventListener('DOMContentLoaded', mostrarMensajeBienvenida);

function cerrarSesion() {
  localStorage.removeItem('usuarioActual');
  localStorage.removeItem('resultadosCalorias');
  window.location.href = 'index.html';
}