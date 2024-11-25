const registros = [];

// Función para cambiar entre pantallas
function showScreen(screenId) {

    // Ocultar todas las pantallas
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });

    // Mostrar la pantalla seleccionada
    document.getElementById(screenId).classList.add('active');

    // Mostrar el contenedor de inicio de sesión solo en la pantalla de inicio
    if (screenId === 'start-screen') {
        document.getElementById('login-section').style.display = 'flex';
    } else {
        document.getElementById('login-section').style.display = 'none';
    }

    if (screenId === 'records-screen') {
        cargarRegistros();
    }
}

// Controlador de formulario de inicio de sesión
document.getElementById('login-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    const correctUsername = "Usuario";
    const correctPassword = "123456789";

    if (username === correctUsername && password === correctPassword) {
        // Inicio de sesión exitoso, redirige a la pantalla de formulario
        showScreen('form-screen');
        document.getElementById('login-section').style.display = 'none';
    } else {
        alert("Usuario o contraseña incorrecta.");
    }
});

// Muestra el prompt de contraseña
function showPasswordPrompt() {
    document.getElementById('password-modal').style.display = 'block';
    document.getElementById('password-input').value = '';
}

// Enviar formulario de modal de contraseña
document.getElementById('password-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const inputPassword = document.getElementById('password-input').value;
    const correctPassword = "Petcare";

    if (inputPassword === correctPassword) {
        document.getElementById('password-modal').style.display = 'none';
        showScreen('records-screen');
    } else {
        document.getElementById('error-message').style.display = 'block';
    }
});
// Controlador de formulario de registro
document.getElementById('registration-form').addEventListener('submit', function(event) {
    event.preventDefault();
    const nombre = document.getElementById('nombre').value;
    const raza = document.getElementById('raza').value;
    const edad = document.getElementById('edad').value;
    const adulto = document.getElementById('adulto').value;
    const telefono = document.getElementById('telefono').value;

    const registro = {
        nombre,
        raza,
        edad,
        adulto,
        telefono
    };

    registros.push(registro);

    alert("Registro guardado correctamente.");
    document.getElementById('registration-form').reset();
});

// Cargar registros en la pantalla de registros
function cargarRegistros() {
    const listaRegistros = document.getElementById('records-list');
    listaRegistros.innerHTML = '';

    registros.forEach(registro => {
        // Crear un contenedor para cada registro
        const registroDiv = document.createElement('div');
        registroDiv.classList.add('registro');

        // Crear los campos con sus etiquetas y respuestas
        registroDiv.innerHTML = `
            <div><label>Nombre:</label><span>${registro.nombre}</span></div>
            <div><label>Raza:</label><span>${registro.raza}</span></div>
            <div><label>Edad:</label><span>${registro.edad}</span></div>
            <div><label>Adulto Responsable:</label><span>${registro.adulto}</span></div>
            <div><label>Teléfono:</label><span>${registro.telefono}</span></div>
        `;

        // Agregar el nuevo registro a la lista
        listaRegistros.appendChild(registroDiv);
    });
}

let model, webcam;

// Cargar el modelo de Teachable Machine
async function loadTeachableMachineModel() {
    const modelURL = 'model/model.json'; // Cambia la ruta según la ubicación de tus archivos
    const metadataURL = 'model/metadata.json';

    try {
        model = await tmImage.load(modelURL, metadataURL);
        console.log("Modelo cargado exitosamente");
    } catch (error) {
        console.error("Error al cargar el modelo:", error);
    }
}

// Inicializar la cámara y usar el modelo
async function showTeachableMachine() {
    showScreen('teachable-screen'); // Cambiar a la pantalla de Teachable Machine

    if (!model) {
        await loadTeachableMachineModel();
    }

    // Acceder a la cámara
    const flip = true;
    webcam = new tmImage.Webcam(200, 200, flip);
    await webcam.setup();
    await webcam.play();

    document.getElementById('webcam').appendChild(webcam.canvas);

    // Empezar a predecir
    window.requestAnimationFrame(loop);
}

// Bucle de predicción
async function loop() {
    webcam.update();
    if (model) {
        const predictions = await model.predict(webcam.canvas);
        displayPredictions(predictions);
    }
    window.requestAnimationFrame(loop);
}

// Mostrar predicciones
function displayPredictions(predictions) {
    const predictionsDiv = document.getElementById('predictions-list');
    predictionsDiv.innerHTML = ''; // Limpia las predicciones anteriores

    predictions.forEach(prediction => {
        // Crear un elemento para cada predicción
        const predictionItem = document.createElement('div');
        predictionItem.classList.add('prediction-item');
        predictionItem.innerHTML = `
            <p><strong>${prediction.className}</strong>: ${(prediction.probability * 100).toFixed(2)}%</p>
        `;
        predictionsDiv.appendChild(predictionItem);
    });
}


// Función para mostrar la pantalla de inicio
function showScreen(screenId) {
    const screens = document.querySelectorAll('.screen');
    screens.forEach((screen) => {
      screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
  }
  
  // Función para manejar el inicio de sesión
  function handleLogin(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    // Verificar la contraseña y mostrar un mensaje de error si es incorrecta
    if (password !== 'petcare123') {
      document.getElementById('error-message').style.display = 'block';
    } else {
      showScreen('form-screen');
    }
  }
  
  // Función para mostrar la pantalla de Teachable Machine
  async function showTeachableMachine() {
    showScreen('teachable-screen'); // Mostrar la pantalla de Teachable Machine
  
  } 
  
  // Función para mostrar la pantalla de diagnóstico
  function showDiagnostico() {
    // Mostrar la pantalla de diagnóstico
    const diagnósticoScreen = document.getElementById('diagnóstico-screen');
    diagnósticoScreen.classList.add('active');
  }
  
  // Función para mostrar la pantalla de registros
  function showPasswordPrompt() {
    // Mostrar la pantalla de registros
    const recordsScreen = document.getElementById('records-screen');
    recordsScreen.classList.add('active');
  }