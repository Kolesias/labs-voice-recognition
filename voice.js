/**
 * Objeto del reconocimiento
 */
var recognition = null;

/**
 * Lista de comandos y sus respectivas funciones
 * @type {Object}
 */
var commands = {
	'seleccionar campo': function() {
		$('#voice-input').focus();
	},

	'di hola': function() {
		alert('Saludos!');
	},

	'me gusta el café': function() {
		alert('A mi también :)');
	},

	'mostrar foto': function() {
		$('.photo').removeClass('hidden');
	},

	'ocultar foto': function() {
		$('.photo').addClass('hidden');
	},

	'último vídeo': function() {
		var frame = $('<iframe>');
		frame.attr('src', 'https://www.youtube.com/embed/8z5KAykTTH8?autoplay=1');
		frame.attr('width', '560').attr('height', '315');
		frame.attr('frameborder', 0);
		frame.attr('allowfullscreen', 1);

		$('.video').html( frame ).removeClass('hidden');
	}
};

/**
 * https://github.com/GoogleChrome/webplatform-samples/tree/master/webspeechdemo
 */
class Voice
{
	/**
	 * La página ha cargado
	 */
	static start() {
		Voice.prepare();
		$('#activate-voice').on('click', Voice.activate);
	}

	/**
	 * Ejecuta el comando indicado
	 * @param  {string} command Comando
	 */
	static trigger( command ) {
		// Comando válido
		if ( typeof commands[command] == 'function' ) {
			commands[command]();
		}

		// Comando inválido
		else {
			// Si estamos haciendo focus sobre el <input>
			// podemos escribir lo que hemos reconocido
			if ( $('#voice-input').is(':focus') ) {
				$('#voice-input').val( $('#voice-input').val() + ' ' + command );
			}
		}
	}

	/**
	 * Prepara el reconocimiento de voz
	 */
	static prepare() {
		// Sin soporte
		if ( !('webkitSpeechRecognition' in window) ) {
			alert('Tu navegador no soporta esta función: webkitSpeechRecognition');
			return false;
		}

		// Creamos el objeto y lo configuramos
		recognition = new webkitSpeechRecognition();
		recognition.continuous		= true; 			// Escuchamos continuamente
		recognition.interimResults	= false; 			// Por ahora no queremos que nos devuelva los resultados antes de que deje de hablar...

		recognition.onstart		= this.onActivated; 	// Al empezar a escuchar
		recognition.onerror		= this.onError; 		// Al ocurrir un problema
		recognition.onend		= this.clear; 			// Al dejar de escuchar, sea por recognition.stop() o porque se dejo de hablar
		recognition.onresult	= this.onResult;		// Hemos reconocido un comando

		return true;
	}

	/**
	 * Queremos empezar a escuchar
	 */
	static activate() {
		// Mostramos la lista de comandos
		if ( $('#list-commands li').length == 0 ) {
			for ( let c in commands ) {
				$('#list-commands').append('<li>' + c + '</li>');
			}
		}

		$('.commands').removeClass('hidden');

		// Empezamos a escuchar el microfono
		recognition.lang = 'es-MX';
		recognition.start();
	}

	/**
	 * [clear description]
	 */
	static clear() {
		$('#activate-voice').fadeIn();
		$('.commands').addClass('hidden');
	}

	/**
	 * Hemos empezado a escuchar
	 */
	static onActivated() {
		// Ocultamos el enlace
		$('#activate-voice').fadeOut();
	}

	/**
	 * Hemos reconocido un comando (palabra/oración)
	 */
	static onResult( e ) {
		// El resultado más reciente
		var actual = e.resultIndex;

		// Lista con todas las palabras/oraciones que se han detectado
		var result = e.results[actual];

		// Lo que ha dicho el usuario
		var command = result[0].transcript.trim();

		// log
		console.log('Se ha detectado: %s', command.toLowerCase() );

		// Ejecutamos el comando
		Voice.trigger( command.toLowerCase() );
	}

	/**
	 * Ha ocurrido un problema (No hemos escuchado nada, no se detecta microfono, etc...)
	 */
	static onError( e ) {
		console.error( e.error );
	}
}

$(document).on('ready', Voice.start);