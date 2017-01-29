'use strict'

const jmx = require("jmx");

let client = jmx.createClient({
	host: "localhost",
	port: 7199
});
 
client.connect();

client.on("connect", function() {
	client.getAttribute("java.lang:type=Memory", "HeapMemoryUsage", function(data) {
		var used = data.getSync('used');
		console.log("HeapMemoryUsage used: " + used.longValue);
	});

	console.log('Read,Latency');

	client.getAttribute('org.apache.cassandra.metrics:type=ClientRequest,scope=Read,name=Latency', "95thPercentile", function(data) {
		console.log('95thPercentile: ', data.toString()); 
	});
	client.getAttribute('org.apache.cassandra.metrics:type=ClientRequest,scope=Read,name=Latency', "98thPercentile", function(data) {
		console.log('98thPercentile: ', data.toString()); 
	});
	client.getAttribute('org.apache.cassandra.metrics:type=ClientRequest,scope=Read,name=Latency', "99thPercentile", function(data) {
		console.log('99thPercentile: ', data.toString()); 
	});
	client.getAttribute('org.apache.cassandra.metrics:type=ClientRequest,scope=Read,name=Latency', "999thPercentile", function(data) {
		console.log('999thPercentile: ', data.toString()); 
	});

	const StorageServiceNames = ['LiveNodes', 'LoadMap', 'JoiningNodes', 'MovingNodes', 'LeavingNodes', 'Starting', 'Keyspaces'];
	StorageServiceNames.forEach(function(name) {
		client.getAttribute("org.apache.cassandra.db:type=StorageService", name, function(data) {
			console.log(`${name}: `, data.toString()); 
		});
	});
});