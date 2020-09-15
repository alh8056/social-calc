<?php

//
// Social Calculator Server
//
// Author: Angel Harbison
//

// Soft321 is a namespace I use for personal projects.
namespace Soft321;

// 3rd Party Libraries
use Ratchet\MessageComponentInterface;
use Ratchet\ConnectionInterface;

/**
 * Custom handler for all WebSocket connections made to the Ratchet server.
 *
 * Enables instant messaging functionality.
 */
class MessageHandler implements MessageComponentInterface {

	/**
	 * The maximum amount of messages allowd in memory.
	 */
	const MESSAGE_LIMIT = 10;

	/**
	 * Client connection collection.
	 */
	protected $clients;

	/**
	 * Message queue.
	 */
	protected $messages;

	/**
	 * Total number of messages received by server.
	 */
	protected $messageCount;

	/**
	 * ctor
	 *
	 * Initialize class variables.
	 */
	public function __construct() {
		$this->clients = [];
		$this->messages = [];
		$this->messageCount = -1;
	}

	/**
	 * Each time a client connects, add their connection to collection.
	 *
	 * Then, send client any messages that the server may have.
	 */
	public function onOpen(ConnectionInterface $client) {
		$this->clients[$client->resourceId] = $client;
		$client->send(json_encode($this->messages, JSON_FORCE_OBJECT));
	}

	/**
	 * Each time message is received by server, add message to message queue.
	 *
	 * Then, send message to each connected client.
	 */
	public function onMessage(ConnectionInterface $from, $messageIn) {
		$messageIndex = ++$this->messageCount;
		if (count($this->messages) >= self::MESSAGE_LIMIT) {
			array_shift($this->messages);
		}
		$this->messages[$messageIndex] = $messageIn;
		foreach($this->clients as $client) {
			$client->send(
				json_encode([$messageIndex => $messageIn], JSON_FORCE_OBJECT)
			);
		}
	}

	/**
	 * Each time a client disconnects, remove their connection from collection.
	 */
	public function onClose(ConnectionInterface $client) {
		unset($this->clients[$client->resourceId]);
	}

	/**
	 * Close client connection on error.
	 */
	public function onError(ConnectionInterface $client, \Exception $e) {
		$client->close();
	}
}