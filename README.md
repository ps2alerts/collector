# PS2Alerts Collector

The purpose of this service is a dedicated forwarder of messages from the nanite-systems Census stream "manifold" replacement service (which is designed to be more highly redundant) to PS2 Alerts RabbitMQ via a rabbit Fanout exchange.

Within the Aggregator, a topic exchange is created and bound to the fanout exchange, enabling concurrent processing and message redundancy which was not previously possible with the Aggregator alone.
