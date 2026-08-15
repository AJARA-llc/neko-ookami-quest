// ===== 8bit 効果音（Web Audio API 生成。音声ファイル不要） =====
// 既定 OFF。ON のときだけ鳴らす。
// 秘匿方針: 役職固有音は「周囲に正体が漏れる」ため既定で使わない。
//   共通の decide/cancel/chest/reveal/fanfare のみを提供する。

import { getState } from "./state";

type Note = { freq: number; dur: number; type?: OscillatorType; gain?: number };

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  return ctx;
}

/** iOS 等ではユーザー操作起点で resume が要る。最初のタップで呼ぶ。 */
export function primeAudio(): void {
  const ac = audio();
  if (ac && ac.state === "suspended") void ac.resume();
}

function playSequence(notes: Note[]): void {
  if (!getState().soundEnabled) return;
  const ac = audio();
  if (!ac) return;
  if (ac.state === "suspended") void ac.resume();

  let t = ac.currentTime;
  for (const note of notes) {
    const osc = ac.createOscillator();
    const gainNode = ac.createGain();
    osc.type = note.type ?? "square";
    osc.frequency.setValueAtTime(note.freq, t);
    const peak = note.gain ?? 0.14;
    gainNode.gain.setValueAtTime(0.0001, t);
    gainNode.gain.exponentialRampToValueAtTime(peak, t + 0.008);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, t + note.dur);
    osc.connect(gainNode).connect(ac.destination);
    osc.start(t);
    osc.stop(t + note.dur + 0.02);
    t += note.dur;
  }
}

// ---- 効果音プリセット ----
export const sfx = {
  /** 決定音（コマンド確定） */
  decide: () => playSequence([{ freq: 880, dur: 0.06 }, { freq: 1320, dur: 0.08 }]),
  /** キャンセル音 */
  cancel: () => playSequence([{ freq: 440, dur: 0.07 }, { freq: 220, dur: 0.09 }]),
  /** カーソル移動 */
  cursor: () => playSequence([{ freq: 660, dur: 0.04, gain: 0.08 }]),
  /** 宝箱を開く */
  chest: () =>
    playSequence([
      { freq: 523, dur: 0.06 },
      { freq: 659, dur: 0.06 },
      { freq: 784, dur: 0.06 },
      { freq: 1047, dur: 0.12 },
    ]),
  /** 役職判明（共通音。役職ごとに変えない＝秘匿） */
  reveal: () =>
    playSequence([
      { freq: 784, dur: 0.08 },
      { freq: 988, dur: 0.08 },
      { freq: 1319, dur: 0.16 },
    ]),
  /** タイプライター文字送り（極小音） */
  tick: () => playSequence([{ freq: 1200, dur: 0.012, gain: 0.03 }]),
  /** 全員確認完了ファンファーレ */
  fanfare: () =>
    playSequence([
      { freq: 523, dur: 0.1 },
      { freq: 659, dur: 0.1 },
      { freq: 784, dur: 0.1 },
      { freq: 1047, dur: 0.14 },
      { freq: 784, dur: 0.1 },
      { freq: 1047, dur: 0.24 },
    ]),
};
