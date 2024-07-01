export async function getLocation(ip: string) {
	if (!ip || ip === "127.0.0.1") return "Unknown";
	try {
		const response = await fetch(`https://ipapi.co/${ip}/json/`);
		const data = await response.json();
		return data.city || "Unknown";
	} catch (error) {
		console.error("Error fetching location:", error);
		return "Unknown";
	}
}
