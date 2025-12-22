"use server";

export async function sendMessageAction(message: string) {
    if (!message || !message.trim()) {
        return { reply: "Please enter a message." };
    }

    console.log("💬 Incoming user message to Server Action:", message);

    try {
        const response = await fetch("https://cloud.activepieces.com/api/v1/webhooks/baHTx73GvxqULhKrxYaYQ", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ message }),
        });

        if (!response.ok) {
            console.error(`Webhook failed with status: ${response.status}`);
            return { reply: "Sorry, I'm having trouble connecting to my brain right now." };
        }

        const data = await response.json();
        console.log("🤖 Automation replied:", data);

        // The automation seems to return { message: "..." } or similar based on server.js logging
        // In server.js: return res.status(200).json({ reply: data.message || "No response from automation" });
        // So we should expect data.message.

        // However, looking at the commented out code in server.js (line 468), it might return response, Response, output, reply, text, content, answer, result...
        // But the active code at 496 says `const data = await response.json();` and 500 says `reply: data.message`.
        // Let's stick to matching the active server.js logic first.

        return {
            reply: data.message || data.reply || data.response || "No response from automation"
        };

    } catch (err) {
        console.error("❌ Error in sendMessageAction:", err);
        return { reply: "Sorry, something went wrong." };
    }
}
