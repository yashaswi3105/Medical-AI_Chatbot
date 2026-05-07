async function send() {
    const input = document.getElementById("input");
    const chatBox = document.getElementById("chatBox");

    let message = input.value;

    if (!message.trim()) return;

    function escapeHTML(text) {
        return text.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    chatBox.innerHTML += `<div class="message user">🧑 ${escapeHTML(message)}</div>`;

    input.value = "";
    input.disabled = true;

    const typingId = "typing-" + Date.now();
    chatBox.innerHTML += `<div class="message bot" id="${typingId}">🤖 Typing...</div>`;

    const res = await fetch("https://medical-ai-chatbot-1-9tee.onrender.com/chat", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({message})
    });

    if (!res.ok) {
        document.getElementById(typingId)?.remove();
        chatBox.innerHTML += `<div class="message bot">❌ Error occurred</div>`;
        input.disabled = false;
        return;
    }

    const data = await res.json();

    document.getElementById(typingId)?.remove();

    chatBox.innerHTML += `<div class="message bot">🤖 ${data.reply}</div>`;

    input.disabled = false;
    input.focus();

    chatBox.scrollTop = chatBox.scrollHeight;
}