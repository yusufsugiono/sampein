// Dynamic Year

const year = document.querySelector("#year");
const currentYear = new Date().getFullYear();
year.innerHTML = `Built with <span class='love'>♥</span> by <b>Yusuf Sugiono</b> &copy ${currentYear}`;

//

document.querySelector("#reply-with-tts").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#tts").scrollIntoView();
});

document.querySelector("#reply-with-stt").addEventListener("click", (e) => {
  e.preventDefault();
  document.querySelector("#stt").scrollIntoView();
});
// ------------- Text to Speech ------------

const speechRecognition = window.webkitSpeechRecognition;

const recognition = new speechRecognition();

// const textbox = $("#textbox");

const textbox = document.querySelector("#textbox");

const startBtn = document.querySelector("#start-btn");
const stopBtn = document.querySelector("#stop-btn");

let content = "";

recognition.continuous = true;

// recognition is started

recognition.onerror = function () {
  console.log("Try Again");
};

recognition.onresult = function (event) {
  const current = event.resultIndex;

  const transcript = event.results[current][0].transcript;

  content += transcript;

  textbox.value = content;
};

document
  .querySelector("#start-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    recognition.start();
    startBtn.setAttribute("disabled", "disabled");
    startBtn.style.display = "none";
    stopBtn.removeAttribute("disabled");
    stopBtn.style.display = "inline";
  });

document.querySelector("#stop-btn").addEventListener("click", function (event) {
  event.preventDefault();
  recognition.stop();
  stopBtn.setAttribute("disabled", "disabled");
  stopBtn.style.display = "none";
  startBtn.removeAttribute("disabled");
  startBtn.style.display = "inline";
});

textbox.addEventListener("input", function () {
  content = textbox.value;
});

document
  .querySelector("#reset-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    textbox.value = "";
  });

// Text-to-Speech

const synth = window.speechSynthesis;

async function setSpeech(synth) {
  return new Promise(function (resolve, reject) {
    let id;
    id = setInterval(() => {
      if (synth.getVoices().length !== 0) {
        resolve(synth.getVoices());
        clearInterval(id);
      }
    }, 20);
  });
}

async function getFilteredVoice(synth) {
  const voices = await setSpeech(synth);
  const langRegex = /^id(-[a-z]{2})?$/i;
  const filteredVoice = voices.find((voice) => langRegex.test(voice.lang));

  return filteredVoice;
}

async function ttsSpeak(synth, text) {
  const utterThis = new SpeechSynthesisUtterance(text);
  const voice = await getFilteredVoice(synth);
  utterThis.voice = voice;
  synth.speak(utterThis);
}

const playTtsBtn = document
  .querySelector("#play-tts-btn")
  .addEventListener("click", function (event) {
    event.preventDefault();
    const text = document.querySelector("#textInput").value;
    ttsSpeak(synth, text);
  });

document
  .querySelector("#reset-btn-tts")
  .addEventListener("click", function (event) {
    event.preventDefault();
    document.querySelector("#textInput").value = "";
  });
