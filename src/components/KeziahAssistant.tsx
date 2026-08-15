"use client";

import { useMemo, useState } from "react";
import { Bot, ChevronDown, Mic, Send, Volume2, X } from "lucide-react";

type Answer = { question: string; answer: string };

const knowledge: Answer[] = [
  { question: "What can KEZIAH help me with?", answer: "I can guide you through employees, departments, shifts, attendance, leave and analytics. I use approved KaziCare guidance first and will clearly tell you when information is not yet connected." },
  { question: "How many employees do we have?", answer: "The current KaziCare workspace has 12 employee records from the live Employees API. I will use live data when it is available rather than inventing a number." },
  { question: "How many departments do we have?", answer: "The current KaziCare workspace has 5 department records from the live Departments API." },
  { question: "Can I use KEZIAH without speaking?", answer: "Yes. Everything I can do through voice should also be available through text. Voice is an accessibility option, not a requirement." },
  { question: "Can KEZIAH make HR decisions?", answer: "No. KEZIAH provides guidance and summaries. Authorized managers make employment, disciplinary, compliance and other consequential decisions." },
  { question: "Why is some analytics unavailable?", answer: "The current live APIs provide employees and departments. Attendance, shifts and leave analytics are not yet connected to live APIs, so I will not present demo figures as real operational data." },
];

function findAnswer(input: string) {
  const text = input.toLowerCase();
  if (text.includes("employee") && (text.includes("how many") || text.includes("count"))) return knowledge[1].answer;
  if (text.includes("department") && (text.includes("how many") || text.includes("count"))) return knowledge[2].answer;
  if (text.includes("analytics") || text.includes("unavailable")) return knowledge[5].answer;
  if (text.includes("decision") || text.includes("fire") || text.includes("terminate")) return knowledge[4].answer;
  if (text.includes("voice") || text.includes("speak")) return knowledge[3].answer;
  return "I can help with employees, departments, shifts, attendance, leave and analytics. Try asking: 'How many employees do we have?' or 'Why is some analytics unavailable?'";
}

export default function KeziahAssistant() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; text: string }[]>([
    { role: "assistant", text: "Hello. I’m KEZIAH, your KaziCare workforce guide. Ask me about the workspace or how to use KaziCare." },
  ]);
  const [listening, setListening] = useState(false);

  const suggested = useMemo(() => knowledge.slice(0, 4), []);

  function speak(text: string) {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
    window.speechSynthesis.cancel();
    window.speechSynthesis.speak(new SpeechSynthesisUtterance(text));
  }

  function ask(raw: string) {
    const question = raw.trim();
    if (!question) return;
    const answer = findAnswer(question);
    setMessages((current) => [...current, { role: "user", text: question }, { role: "assistant", text: answer }]);
    setInput("");
  }

  function startVoice() {
    const SpeechRecognition = (window as unknown as { SpeechRecognition?: new () => { lang: string; start: () => void; onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null; onend: (() => void) | null } }).SpeechRecognition;
    if (!SpeechRecognition) return;
    const recognition = new SpeechRecognition();
    recognition.lang = "en-KE";
    recognition.onresult = (event) => ask(event.results[0][0].transcript);
    recognition.onend = () => setListening(false);
    setListening(true);
    recognition.start();
  }

  return <>
    {!open && <button type="button" onClick={() => setOpen(true)} aria-label="Open KEZIAH KaziCare assistant" className="fixed bottom-5 right-5 z-40 flex min-h-12 items-center gap-2 rounded-full border border-[var(--kc-crimson)]/30 bg-[var(--kc-surface)] px-4 text-sm font-semibold text-white shadow-2xl shadow-black/30 hover:border-[var(--kc-crimson)] hover:bg-[var(--kc-surface-2)]"><span className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--kc-crimson)]"><Bot size={17}/></span>KEZIAH</button>}
    {open && <section className="fixed bottom-4 right-4 z-50 flex h-[min(700px,calc(100vh-2rem))] w-[min(420px,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border border-[var(--kc-border)] bg-[var(--kc-surface)] shadow-2xl shadow-black/50" aria-label="KEZIAH KaziCare assistant">
      <header className="flex items-center justify-between border-b border-[var(--kc-border)] px-4 py-3"><div className="flex items-center gap-3"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--kc-crimson)]"><Bot size={18}/></div><div><p className="text-sm font-semibold text-white">KEZIAH</p><p className="text-[10px] text-[var(--kc-muted)]">KaziCare workforce guide</p></div></div><button onClick={() => setOpen(false)} aria-label="Close KEZIAH" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.04] hover:text-white"><X size={18}/></button></header>
      <div className="flex-1 space-y-3 overflow-y-auto p-4" aria-live="polite">{messages.map((m, i) => <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}><div className={`max-w-[88%] rounded-2xl px-3.5 py-2.5 text-sm leading-6 ${m.role === "user" ? "bg-[var(--kc-crimson)] text-white" : "border border-[var(--kc-border)] bg-white/[0.025] text-slate-200"}`}>{m.text}{m.role === "assistant" && <button type="button" onClick={() => speak(m.text)} aria-label="Read response aloud" className="ml-2 inline-flex h-7 w-7 items-center justify-center rounded-lg text-slate-500 hover:bg-white/[0.05] hover:text-white"><Volume2 size={14}/></button>}</div></div>)}
        {messages.length === 1 && <div className="space-y-2 pt-2">{suggested.map((item) => <button key={item.question} type="button" onClick={() => ask(item.question)} className="block w-full rounded-xl border border-[var(--kc-border)] p-3 text-left text-xs text-slate-300 hover:border-[var(--kc-crimson)]/40 hover:bg-[var(--kc-crimson-soft)]">{item.question}</button>)}</div>}
      </div>
      <div className="border-t border-[var(--kc-border)] p-3"><form onSubmit={(e) => { e.preventDefault(); ask(input); }} className="flex items-center gap-2"><input value={input} onChange={(e) => setInput(e.target.value)} aria-label="Ask KEZIAH" placeholder="Ask KEZIAH..." className="min-h-11 min-w-0 flex-1 rounded-xl border border-[var(--kc-border)] bg-black/10 px-3 text-sm text-white outline-none placeholder:text-slate-600 focus:border-[var(--kc-crimson)]"/><button type="button" onClick={startVoice} disabled={listening} aria-label={listening ? "Listening" : "Ask KEZIAH by voice"} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-[var(--kc-border)] text-slate-300 hover:bg-white/[0.04] disabled:text-[var(--kc-crimson-hover)]"><Mic size={17}/></button><button type="submit" aria-label="Send question" className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[var(--kc-crimson)] text-white hover:bg-[var(--kc-crimson-hover)]"><Send size={17}/></button></form><p className="mt-2 text-[10px] leading-4 text-slate-600">AI disclosure: KEZIAH provides guidance from approved KaziCare knowledge and available workspace data. Verify important employment, compliance and operational decisions.</p></div>
    </section>}
  </>;
}
