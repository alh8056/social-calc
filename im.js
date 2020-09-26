//
// Social Calculator Client
//
// Author: Angel Harbison
//

/**
 * Program entry point. Runs after window is fully loaded.
 */
window.onload = (event) => {
	// register callbacks to events
	var sock = createSocket(
		'ws://phpserver.321software.net:8080/',
		logMessages
	);
	registerFormulaInput(sock);
	// append instructions to message log
	var messageLog = document.getElementById('messageLog');
	appendListItem(
		messageLog,
		'Welcome to Social Calculator! Enter an expression below.'
	);
	// focus cursor on command prompt
	document.getElementById('formulaInput').focus();
};

/**
 * Open socket and register callback to socket.onmessage event.
 *
 * @param    uri                  The URI of the WebSocket server.
 * @param    onMessageCallback    The function to run whenever a message is received.
 */
function createSocket(uri, onMessageCallback) {
	var sock = new WebSocket(uri);
	sock.onmessage = onMessageCallback;
	return sock;
}

/**
 * Log message(s) to the message log displayed on the screen.
 */
function logMessages(event) {
	var response = JSON.parse(event.data);
	var messages = Object.values(response);
	var messageLog = document.getElementById('messageLog');
	for (let i=0; i < messages.length; i++) {
		shift(messageLog, 10);
		appendListItem(messageLog, messages[i]);
	}
}

/**
 * Helper function to logMessages().
 *
 * Remove the oldest element from the list whenever list becomes full.
 *
 * @param    list    DOM list.
 * @param    max     The maximum number of elements allowed in the list.
 */
function shift(list, max) {
	if (list.childElementCount >= max - 1) {
		list.removeChild(list.firstChild);
	}
}

/**
 * Helper function to logMessages().
 *
 * Append item to the list.
 *
 * @param    list    DOM list.
 * @param    text    The text for the list item.
 */
function appendListItem(list, text) {
	var li = document.createElement('li');
	var liText = document.createTextNode(text);
	li.appendChild(liText);
	list.appendChild(li);
}

/**
 * Register callback to the command prompt.
 *
 * Callback evaluates equation and sends result to WebSocket server.
 */
function registerFormulaInput(sock) {
	var formulaInputElement = document.getElementById('formulaInput');
	formulaInputElement.addEventListener("keydown", function(e) {
		// if Enter key is pressed
		if (e.keyCode === 13) {
			e.preventDefault();
			// evaluate formula
			var formula = e.target.value;
			try {
				var equation = formula + ' = ' + math.eval(formula);
				// send message to server
				sock.send(equation);
			} catch(exception) {
				alert( exception.message );
			}
			// reset the form
			e.target.value = '';
		}
	});
}
