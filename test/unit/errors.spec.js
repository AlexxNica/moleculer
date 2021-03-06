"use strict";

let errors = require("../../src/errors");


describe("Test Errors", () => {

	it("test MoleculerError", () => {
		let err = new errors.MoleculerError("Something went wrong!", 555, "ERR_TYPE", { a: 5 });
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerError);
		expect(err.name).toBe("MoleculerError");
		expect(err.message).toBe("Something went wrong!");
		expect(err.code).toBe(555);
		expect(err.type).toBe("ERR_TYPE");
		expect(err.data).toEqual({ a: 5});
		expect(err.retryable).toBe(false);
	});

	it("test MoleculerRetryableError", () => {
		let err = new errors.MoleculerRetryableError("Something went wrong!", 555, "ERR_TYPE", { a: 5 });
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerError);
		expect(err).toBeInstanceOf(errors.MoleculerRetryableError);
		expect(err.name).toBe("MoleculerRetryableError");
		expect(err.message).toBe("Something went wrong!");
		expect(err.code).toBe(555);
		expect(err.type).toBe("ERR_TYPE");
		expect(err.data).toEqual({ a: 5});
		expect(err.retryable).toBe(true);
	});

	it("test MoleculerServerError", () => {
		let err = new errors.MoleculerServerError("Something went wrong!", 555, "ERR_TYPE", { a: 5 });
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerError);
		expect(err).toBeInstanceOf(errors.MoleculerRetryableError);
		expect(err).toBeInstanceOf(errors.MoleculerServerError);
		expect(err.name).toBe("MoleculerServerError");
		expect(err.message).toBe("Something went wrong!");
		expect(err.code).toBe(555);
		expect(err.type).toBe("ERR_TYPE");
		expect(err.data).toEqual({ a: 5});
		expect(err.retryable).toBe(true);
	});

	it("test MoleculerClientError", () => {
		let err = new errors.MoleculerClientError("Client error!");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerError);
		expect(err).toBeInstanceOf(errors.MoleculerClientError);
		expect(err.code).toBe(400);
		expect(err.name).toBe("MoleculerClientError");
		expect(err.message).toBe("Client error!");
		//expect(err.data).toEqual({ action: "posts.find" });
		expect(err.retryable).toBe(false);
	});

	it("test ServiceNotFoundError", () => {
		let err = new errors.ServiceNotFoundError("posts.find", "node-2");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.ServiceNotFoundError);
		expect(err.code).toBe(404);
		expect(err.name).toBe("ServiceNotFoundError");
		expect(err.message).toBe("Service 'posts.find' is not found on 'node-2' node.");
		expect(err.data).toEqual({ action: "posts.find", nodeID: "node-2" });
		expect(err.retryable).toBe(false);
	});

	it("test ServiceNotAvailable", () => {
		let err = new errors.ServiceNotAvailable("posts.find", "node-2");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.ServiceNotAvailable);
		expect(err.code).toBe(404);
		expect(err.name).toBe("ServiceNotAvailable");
		expect(err.message).toBe("Service 'posts.find' is not available on 'node-2' node.");
		expect(err.data).toEqual({ action: "posts.find", nodeID: "node-2" });
		expect(err.retryable).toBe(false);
	});

	it("test ServiceNotAvailable with NodeID", () => {
		let err = new errors.ServiceNotAvailable("posts.find", "server-2");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.ServiceNotAvailable);
		expect(err.code).toBe(404);
		expect(err.name).toBe("ServiceNotAvailable");
		expect(err.message).toBe("Service 'posts.find' is not available on 'server-2' node.");
		expect(err.data).toEqual({ action: "posts.find", nodeID: "server-2" });
		expect(err.retryable).toBe(false);
	});

	it("test RequestTimeoutError", () => {
		let err = new errors.RequestTimeoutError("posts.find", "server-2");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerRetryableError);
		expect(err).toBeInstanceOf(errors.RequestTimeoutError);
		expect(err.code).toBe(504);
		expect(err.name).toBe("RequestTimeoutError");
		expect(err.message).toBe("Request is timed out when call 'posts.find' action on 'server-2' node.");
		expect(err.data.nodeID).toBe("server-2");
		expect(err.retryable).toBe(true);
	});

	it("test RequestSkippedError", () => {
		let err = new errors.RequestSkippedError("posts.find", "server-3");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerError);
		expect(err).toBeInstanceOf(errors.RequestSkippedError);
		expect(err.code).toBe(514);
		expect(err.name).toBe("RequestSkippedError");
		expect(err.message).toBe("Calling 'posts.find' is skipped because timeout reached on 'server-3' node.");
		expect(err.data.action).toBe("posts.find");
		expect(err.data.nodeID).toBe("server-3");
		expect(err.retryable).toBe(false);
	});

	it("test RequestRejected", () => {
		let err = new errors.RequestRejected("posts.find", "server-3");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerRetryableError);
		expect(err).toBeInstanceOf(errors.RequestRejected);
		expect(err.code).toBe(503);
		expect(err.name).toBe("RequestRejected");
		expect(err.message).toBe("Request is rejected when call 'posts.find' action on 'server-3' node.");
		expect(err.data.action).toBe("posts.find");
		expect(err.data.nodeID).toBe("server-3");
		expect(err.retryable).toBe(true);
	});

	it("test QueueIsFull", () => {
		let err = new errors.QueueIsFull("posts.find", "server-3", 100, 50);
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerRetryableError);
		expect(err).toBeInstanceOf(errors.QueueIsFull);
		expect(err.code).toBe(429);
		expect(err.name).toBe("QueueIsFull");
		expect(err.message).toBe("Queue is full. Request 'posts.find' action on 'server-3' node is rejected.");
		expect(err.data.action).toBe("posts.find");
		expect(err.data.nodeID).toBe("server-3");
		expect(err.data.size).toBe(100);
		expect(err.data.limit).toBe(50);
		expect(err.retryable).toBe(true);
	});

	it("test ValidationError", () => {
		let data = {};
		let err = new errors.ValidationError("Param is not correct!", "ERR_TYPE", data);
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerClientError);
		expect(err).toBeInstanceOf(errors.ValidationError);
		expect(err.name).toBe("ValidationError");
		expect(err.message).toBe("Param is not correct!");
		expect(err.code).toBe(422);
		expect(err.type).toBe("ERR_TYPE");
		expect(err.data).toBe(data);
		expect(err.retryable).toBe(false);
	});

	it("test MaxCallLevelError", () => {
		let err = new errors.MaxCallLevelError("server-2", 10);
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.MoleculerError);
		expect(err).toBeInstanceOf(errors.MaxCallLevelError);
		expect(err.code).toBe(500);
		expect(err.name).toBe("MaxCallLevelError");
		expect(err.message).toBe("Request level is reached the limit (10) on 'server-2' node.");
		expect(err.data).toEqual({ level: 10 });
		expect(err.retryable).toBe(false);
	});

	it("test ServiceSchemaError", () => {
		let err = new errors.ServiceSchemaError("Invalid schema def.");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.ServiceSchemaError);
		expect(err.name).toBe("ServiceSchemaError");
		expect(err.message).toBe("Invalid schema def.");
		expect(err.code).toBe(500);
		expect(err.type).toBeNull();
		expect(err.data).toBeUndefined();
	});

	it("test ProtocolVersionMismatchError", () => {
		let err = new errors.ProtocolVersionMismatchError("server-2", "2", "1");
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.ProtocolVersionMismatchError);
		expect(err.code).toBe(500);
		expect(err.name).toBe("ProtocolVersionMismatchError");
		expect(err.message).toBe("Protocol version mismatch.");
		expect(err.data).toEqual({ nodeID: "server-2", actual: "2", received: "1" });
		expect(err.retryable).toBe(false);
	});

	it("test InvalidPacketData", () => {
		let packet = {};
		let err = new errors.InvalidPacketData(packet);
		expect(err).toBeDefined();
		expect(err).toBeInstanceOf(Error);
		expect(err).toBeInstanceOf(errors.InvalidPacketData);
		expect(err.code).toBe(500);
		expect(err.name).toBe("InvalidPacketData");
		expect(err.message).toBe("Invalid packet data.");
		expect(err.data).toEqual({ packet });
		expect(err.retryable).toBe(false);
	});

});
