"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button, Icon, Select } from "@/components/design-system";

type ListenMode = "natural" | "slow";

const preferredVoiceWords = ["yuna", "sora", "narae", "sunhi", "korean", "한국", "google", "microsoft", "apple"];

function readableText(text: string) {
  return text
    .replace(/\bJOBDAY\b/g, "잡데이")
    .replace(/\bAI\b/g, "에이아이")
    .replace(/\s+/g, " ")
    .trim();
}

function splitSpeechText(text: string) {
  const normalized = readableText(text);
  const sentences = normalized.match(/[^.!?\n。！？]+[.!?。！？]?/g) ?? [normalized];

  return sentences.flatMap((sentence) => {
    const trimmed = sentence.trim();
    if (trimmed.length <= 120) return [trimmed];
    const parts = trimmed.split(/[,，;；:：]/).map((part) => part.trim()).filter(Boolean);
    return parts.length > 1 ? parts : [trimmed];
  }).filter(Boolean);
}

function voiceScore(voice: SpeechSynthesisVoice) {
  const name = voice.name.toLowerCase();
  let score = voice.lang.toLowerCase().startsWith("ko") ? 100 : 0;
  if (voice.localService) score += 4;
  for (const word of preferredVoiceWords) {
    if (name.includes(word)) score += 8;
  }
  return score;
}

function voiceLabel(voice: SpeechSynthesisVoice) {
  return `${voice.name}${voice.lang ? ` · ${voice.lang}` : ""}`;
}

export function PodcastListenButton({ text }: { text: string }) {
  const [supported, setSupported] = useState<boolean | null>(null);
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);
  const [voiceURI, setVoiceURI] = useState("");
  const [mode, setMode] = useState<ListenMode>("natural");
  const [progress, setProgress] = useState({ current: 0, total: 0 });
  const cancelRequested = useRef(false);
  const timerRef = useRef<number | null>(null);

  const speechChunks = useMemo(() => splitSpeechText(text), [text]);
  const koreanVoices = useMemo(
    () => [...voices].filter((voice) => voice.lang.toLowerCase().startsWith("ko")).sort((a, b) => voiceScore(b) - voiceScore(a)),
    [voices]
  );
  const selectedVoice = useMemo(() => {
    return voices.find((voice) => voice.voiceURI === voiceURI) ?? koreanVoices[0] ?? [...voices].sort((a, b) => voiceScore(b) - voiceScore(a))[0];
  }, [koreanVoices, voiceURI, voices]);

  useEffect(() => {
    const isSupported = "speechSynthesis" in window && "SpeechSynthesisUtterance" in window;
    setSupported(isSupported);
    if (!isSupported) return undefined;

    const loadVoices = () => {
      const availableVoices = window.speechSynthesis.getVoices();
      setVoices(availableVoices);
      setVoiceURI((current) => current || [...availableVoices].sort((a, b) => voiceScore(b) - voiceScore(a))[0]?.voiceURI || "");
    };

    loadVoices();
    window.speechSynthesis.onvoiceschanged = loadVoices;

    return () => {
      if (timerRef.current) window.clearTimeout(timerRef.current);
      window.speechSynthesis.cancel();
      window.speechSynthesis.onvoiceschanged = null;
    };
  }, []);

  function stop() {
    cancelRequested.current = true;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setProgress({ current: 0, total: speechChunks.length });
  }

  function speakChunk(index: number) {
    if (!supported || cancelRequested.current) return;
    const chunk = speechChunks[index];
    if (!chunk) {
      setSpeaking(false);
      setProgress({ current: speechChunks.length, total: speechChunks.length });
      return;
    }

    const utterance = new SpeechSynthesisUtterance(chunk);
    utterance.lang = selectedVoice?.lang || "ko-KR";
    utterance.voice = selectedVoice ?? null;
    utterance.rate = mode === "slow" ? 0.86 : 0.92;
    utterance.pitch = mode === "slow" ? 0.96 : 1.02;
    utterance.volume = 1;
    utterance.onstart = () => setProgress({ current: index + 1, total: speechChunks.length });
    utterance.onend = () => {
      if (cancelRequested.current) return;
      timerRef.current = window.setTimeout(() => speakChunk(index + 1), mode === "slow" ? 420 : 280);
    };
    utterance.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  }

  function listen() {
    if (!supported) return;
    cancelRequested.current = false;
    if (timerRef.current) window.clearTimeout(timerRef.current);
    window.speechSynthesis.cancel();
    setSpeaking(true);
    setProgress({ current: 0, total: speechChunks.length });
    timerRef.current = window.setTimeout(() => speakChunk(0), 120);
  }

  if (supported === false) {
    return <p className="text-sm font-medium leading-5 text-muted">이 브라우저에서는 기기 듣기를 지원하지 않습니다. 아래 대본으로 내용을 확인할 수 있습니다.</p>;
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        {speaking ? (
          <Button type="button" variant="quiet" size="lg" onClick={stop}>
            <Icon name="closed" className="mr-1.5 h-4 w-4" />
            듣기 멈추기
          </Button>
        ) : (
          <Button type="button" variant="primary" size="lg" disabled={supported === null || !speechChunks.length} onClick={listen}>
            <Icon name="play" className="mr-1.5 h-4 w-4" />
            {supported === null ? "준비 중..." : "자연스럽게 듣기"}
          </Button>
        )}
        <span className="text-sm font-medium text-muted">
          {speaking ? `${progress.current}/${progress.total} 문장 읽는 중` : "기기에서 가능한 가장 자연스러운 한국어 음성을 고릅니다."}
        </span>
      </div>

      <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_160px]">
        <label className="space-y-1">
          <span className="text-xs font-black tracking-[0.14em] text-muted">음성</span>
          <Select value={selectedVoice?.voiceURI ?? ""} disabled={!voices.length || speaking} onChange={(event) => setVoiceURI(event.target.value)}>
            {(koreanVoices.length ? koreanVoices : voices).map((voice) => (
              <option key={voice.voiceURI} value={voice.voiceURI}>{voiceLabel(voice)}</option>
            ))}
          </Select>
        </label>
        <label className="space-y-1">
          <span className="text-xs font-black tracking-[0.14em] text-muted">읽기 톤</span>
          <Select value={mode} disabled={speaking} onChange={(event) => setMode(event.target.value as ListenMode)}>
            <option value="natural">자연스럽게</option>
            <option value="slow">천천히</option>
          </Select>
        </label>
      </div>

      <p className="text-sm font-medium leading-5 text-muted">
        브라우저와 기기에 설치된 음성 품질에 따라 느낌이 달라집니다. 더 사람 같은 음성 파일 생성은 외부 TTS 검토 후 별도 단계로 붙일 수 있습니다.
      </p>
    </div>
  );
}
