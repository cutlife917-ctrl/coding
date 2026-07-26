const question = document.getElementById("question");
const askBtn = document.getElementById("askBtn");
const response = document.getElementById("response");

askBtn.addEventListener("click", sendMessage);

question.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
        sendMessage();
    }
});

async function sendMessage() {

    const message = question.value.trim();

    if (message === "") return;

    response.innerHTML = "<p>🤖 AI is thinking...</p>";

    try {

        const res = await fetch("http://localhost:3000/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                message: message
            })
        });

        const data = await res.json();

        response.innerHTML = `
            <h3>Your Question</h3>
            <p>${message}</p>

            <h3>AI Answer</h3>
            <p>${data.reply}</p>
        `;

    } catch (error) {

        response.innerHTML = `
            <p style="color:red;">
                Unable to connect to the server.
            </p>
        `;

        console.error(error);
    }

    question.value = "";

}
// ==============================
// Voice Recognition
// ==============================

const voiceBtn = document.getElementById("voiceBtn");

if ("webkitSpeechRecognition" in window) {

    const recognition = new webkitSpeechRecognition();

    recognition.lang = "en-US";
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceBtn.addEventListener("click", () => {
        recognition.start();
    });

    recognition.onresult = function (event) {

        question.value = event.results[0][0].transcript;

    };

    recognition.onerror = function (event) {

        console.error(event.error);

    };

} else {

    alert("Speech Recognition is not supported in this browser.");

}
// ==============================
// Text To Speech
// ==============================

const speakBtn = document.getElementById("speakBtn");

speakBtn.addEventListener("click", () => {

    const text = response.innerText;

    if (text.trim() === "") {
        alert("No AI answer to read.");
        return;
    }

    const speech = new SpeechSynthesisUtterance();

    speech.text = text;
    speech.lang = "en-US";
    speech.rate = 1;
    speech.pitch = 1;
    speech.volume = 1;

    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(speech);

});