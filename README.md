# PS2Alerts Collector

The purpose of this service is a dedicated forwarder of messages from the nanite-systems Census stream "manifold" replacement service (which is designed to be more highly redundant) to PS2 Alerts RabbitMQ via a rabbit Fanout exchange.

Within the Aggregator, a topic exchange is created and bound to the fanout exchange, enabling concurrent processing and message redundancy which was not previously possible with the Aggregator alone.

## Installation

1. Copy the `vars.local.yaml.dist` to `vars.local.yaml`
2. Update `census_service_id` with your own from https://census.daybreakgames.com
3. Adjust your census events as needed, by default all the ones supplied by the project are provided, if you want to monitor for more, you change them there.

## Usage 

To use this package, simply run `ps2alerts-collector-dev`. You will need to keep the process running for messages to collect, you are recommended to run this in another terminal

