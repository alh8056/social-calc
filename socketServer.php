<?php

//
// Ratchet Web Socket Server
//

require 'vendor/autoload.php';

$server = \Ratchet\Server\IoServer::factory(
	new \Ratchet\Http\HttpServer(
		new \Ratchet\WebSocket\WsServer(
			new \Soft321\MessageHandler()
		)
	),
	8080
);

$server->run();
