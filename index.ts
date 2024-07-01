import ipify from "ipify";
import { getLocation } from "./utils/get-location";
import { getTemperature } from "./utils/get-temp";

const PORT = process.env.PORT || 5000;

let IPAddress = await ipify({ useIPv6: false });
const location = await getLocation(IPAddress);

Bun.serve({
	port: PORT,
	async fetch(request) {
		const { method } = request;
		const { pathname, searchParams } = new URL(request.url);

		if (method === "GET" && pathname.startsWith("/api/hello")) {
			const name = searchParams.get("visitor_name") || "Guest";

			const temperature = await getTemperature(
				location.latitude,
				location.longitude
			);

			const response = {
				client_ip: IPAddress.length > 3 ? IPAddress : "127.0.0.1",
				location: location.city,
				greeting: `Hello, ${name.trim()}!, the temperature is ${temperature} degrees Celsius in ${
					location.city
				}.`,
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
