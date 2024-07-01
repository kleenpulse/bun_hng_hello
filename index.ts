import { serve } from "bun";
import { getLocation } from "./utils/get-location";

const PORT = 5000;

serve({
	port: PORT,
	async fetch(request) {
		const { method } = request;
		const { pathname, searchParams } = new URL(request.url);

		if (method === "GET" && pathname.startsWith("/api/hello")) {
			const name = searchParams.get("visitor_name") || "Guest";
			let sourceIP = this.requestIP(request);
			console.log("SOURCE IP", sourceIP);
			let IPAdress =
				request.headers.get("x-forwarded-for") ||
				sourceIP?.address ||
				"127.0.0.1";
			const location = await getLocation(IPAdress);
			const response = {
				client_ip: IPAdress.length > 3 ? IPAdress : "127.0.0.1",
				greeting: `Hello, ${name.trim()}!`,
				location,
			};

			return new Response(JSON.stringify(response), {
				status: 200,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response("Not Found", { status: 404 });
	},
});

console.log(`listening on http://localhost:${PORT}`);
