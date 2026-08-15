// ===== 最小 DOM ヘルパー（innerHTML 不使用＝XSS 経路ゼロ） =====
// テキストは常に textContent 経由。プレイヤー名など入力値も安全に扱える。

type Attrs = Record<string, string | number | boolean | ((e: Event) => void)>;
type Child = Node | string | null | undefined | false;

export function h(tag: string, attrs?: Attrs | null, ...children: Child[]): HTMLElement {
  const el = document.createElement(tag);
  if (attrs) {
    for (const [key, value] of Object.entries(attrs)) {
      if (value === false || value === null || value === undefined) continue;
      if (key === "class") {
        el.className = String(value);
      } else if (key === "text") {
        el.textContent = String(value);
      } else if (key.startsWith("on") && typeof value === "function") {
        el.addEventListener(key.slice(2).toLowerCase(), value as EventListener);
      } else if (value === true) {
        el.setAttribute(key, "");
      } else {
        el.setAttribute(key, String(value));
      }
    }
  }
  for (const child of children) {
    if (child === null || child === undefined || child === false) continue;
    el.append(typeof child === "string" ? document.createTextNode(child) : child);
  }
  return el;
}

/** 装飾用の空 div をクラス名で量産する糖衣。 */
export function div(className: string, ...children: Child[]): HTMLElement {
  return h("div", { class: className }, ...children);
}
