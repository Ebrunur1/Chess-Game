import { initGame } from "./Data/data.js";
import { GlobalEvent } from "./Events/global.js";
import { initGameRender } from "./Render/main.js";

const globalState = initGame();
let keySquareMapper = {};

globalState.flat().forEach((square) => {
  keySquareMapper[square.id] = square;
});

initGameRender(globalState);
GlobalEvent();

String.prototype.replaceAt = function (index, replacement) {
  return (
    this.substring(0, index) +
    replacement +
    this.substring(index + replacement.length)
  );
};

export { globalState, keySquareMapper };

let moveCounter = 0;

/* ✅ SESLER */
const sounds = {
  move: new Audio("./audio/move.mp3"),
  capture: new Audio("./audio/capture.mp3")
};

sounds.move.volume = 0.45;
sounds.capture.volume = 0.55;

/* ✅ Preload */
Object.values(sounds).forEach(s => {
  s.preload = "auto";
});

/* ✅ SES ÇALMA */
function playSound(name) {
  const original = sounds[name];
  if (!original) return;
  
  try {
    const inst = original.cloneNode(true);
    inst.currentTime = 0;
    inst.play().catch(() => {});
  } catch (e) {}
}

/* ✅ HAMLE EVENTİ */
window.addEventListener("pieceMove", (event) => {
  const { from, to, piece, captured, castle } = event.detail || {};
  const table = document.getElementById("moveTable");
  if (!table) return;

  /* ✅ SES */
  if (captured) {
    playSound("capture");
  } else {
    playSound("move");
  }

  /* ✅ HAMLE YAZDIRMA */
  let tbody = table.querySelector("tbody");
  if (!tbody) {
    tbody = document.createElement("tbody");
    table.appendChild(tbody);
  }

  moveCounter++;
  const tr = document.createElement("tr");

  const pieceLabel = piece ? piece.replace(/_/g, " ") : "";
  const capturedText = captured ? ` x ${captured.replace(/_/g, " ")}` : "";
  const castleText = castle ? " (castle)" : "";

  tr.innerHTML = `
    <td>${moveCounter}</td>
    <td>${pieceLabel} ${from || ""} → ${to || ""}${capturedText}${castleText}</td>
  `;

  tbody.appendChild(tr);
});
