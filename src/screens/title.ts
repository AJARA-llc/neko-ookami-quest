// ===== 4. タイトル画面 =====
// 満月の夜のあるちゅーる酒場。TAP TO START でも扉タップでも count へ。

import { navigate } from "../router";
import { primeAudio, sfx } from "../sfx";
import { renderMug } from "../pixel";
import { h, div } from "../dom";

export function titleScreen(): HTMLElement {
  const root = div("scene scene--title");

  const sky = div(
    "night-sky",
    div("moon"),
    div("star star--1"),
    div("star star--2"),
    div("star star--3"),
    div("shooting-star"),
  );

  const roof = div(
    "tavern-roof",
    div("chimney", h("span", { class: "smoke" }), h("span", { class: "smoke smoke--2" })),
    div("roof-cat", h("span", { class: "roof-cat-body" }), h("span", { class: "roof-cat-tail" })),
  );

  const sign = div(
    "tavern-sign",
    h("span", { class: "sign-title", text: "にゃんろう" }),
    h("span", { class: "sign-sub", text: "-猫狼-" }),
  );

  const door = div("tavern-door", h("span", { class: "door-l" }), h("span", { class: "door-r" }));

  const body = div(
    "tavern-body",
    div("lantern lantern--l"),
    div("window window--l"),
    door,
    div("window window--r"),
    div("lantern lantern--r"),
  );

  const tavern = div("tavern", roof, sign, body);

  const mug = div("title-mug");
  mug.appendChild(renderMug(5));

  const tapStart = h("p", { class: "tap-start", text: "TAP TO START" });

  root.append(sky, tavern, mug, tapStart);

  let started = false;
  root.addEventListener("click", () => {
    if (started) return;
    started = true;
    primeAudio();
    sfx.chest();
    door.classList.add("is-open");
    window.setTimeout(() => navigate("mode"), 620);
  });

  return root;
}
