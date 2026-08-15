// ===== エントリポイント =====

import "./styles/tokens.css";
import "./styles/base.css";
import "./styles/pixel.css";
import "./styles/screens.css";

import { mountRouter } from "./router";
import { soundToggle } from "./components/sound-toggle";
import { div } from "./dom";

const stage = document.getElementById("stage");
const app = document.getElementById("app");

if (!stage || !app) {
  throw new Error("stage/app root not found");
}

// 画面上部に常設する音声トグル（全画面で共有）
const topBar = div("top-bar");
topBar.appendChild(soundToggle());
stage.insertBefore(topBar, app);

mountRouter(app);
