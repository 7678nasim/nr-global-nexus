import React, { useEffect, useRef, useState } from "react";
import { Bot, X, Send, Sparkles, User as UserIcon } from "lucide-react";
import { API } from "@/lib/site";

const greeting = {
  role: "assistant",
  content:
    "Hi! I'm NexusAI — your assistant at NR Global Nexus. Ask me about BPO, AI Solutions, Recruitment, Sales Outsourcing, Digital Marketing, partnerships or careers. Want a proposal or consultation? Just say so and I'll get the details to our team.",
};

const Chatbot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([greeting]);
  const [input, setInput] = useState("");
  const [streaming, setStreaming] = useState(false);

  const sessionId = useRef(
    (typeof localStorage !== "undefined" &&
      localStorage.getItem("nx_chat_id")) ||
      (() => {
        const id = `web-${Math.random().toString(36).slice(2, 10)}-${Date.now()}`;
        try {
          localStorage.setItem("nx_chat_id", id);
        } catch {}
        return id;
      })()
  );

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  const updateLastAssistantMessage = (text) => {
    setMessages((current) => {
      const copy = [...current];

      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "assistant") {
          copy[i] = {
            ...copy[i],
            content: text,
          };
          break;
        }
      }

      return copy;
    });
  };

  const appendToLastAssistantMessage = (delta) => {
    setMessages((current) => {
      const copy = [...current];

      for (let i = copy.length - 1; i >= 0; i--) {
        if (copy[i].role === "assistant") {
          copy[i] = {
            ...copy[i],
            content: (copy[i].content || "") + delta,
          };
          break;
        }
      }

      return copy;
    });
  };

  const cleanLeadJson = (text) => {
    if (!text) return "";

    return text
      .replace(/\[LEAD_JSON\]\s*\{[\s\S]*?\}/g, "")
      .trim();
  };

  const processSSEEvent = (rawEvent) => {
    const lines = rawEvent.split(/\r?\n/);

    for (const rawLine of lines) {
      const line = rawLine.trim();

      if (!line.startsWith("data:")) {
        continue;
      }

      const jsonText = line.replace(/^data:\s*/, "").trim();

      if (!jsonText) {
        continue;
      }

      try {
        const data = JSON.parse(jsonText);

        if (data.delta) {
          appendToLastAssistantMessage(data.delta);
        }

        if (data.lead_captured) {
          setMessages((current) => [
            ...current,
            {
              role: "system",
              content: "Lead captured — our team will reach out shortly.",
            },
          ]);
        }

        if (data.error) {
          appendToLastAssistantMessage(
            `\n\nSorry, I couldn't complete the response. ${data.error}`
          );
        }
      } catch (error) {
        console.warn("Could not parse SSE event:", jsonText);
      }
    }
  };

  const send = async () => {
    const text = input.trim();

    if (!text || streaming) {
      return;
    }

    setMessages((current) => [
      ...current,
      {
        role: "user",
        content: text,
      },
      {
        role: "assistant",
        content: "",
      },
    ]);

    setInput("");
    setStreaming(true);

    try {
      const response = await fetch(`${API}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "text/event-stream",
        },
        body: JSON.stringify({
          session_id: sessionId.current,
          message: text,
        }),
      });

      if (!response.ok) {
        throw new Error(`Server returned ${response.status}`);
      }

      if (!response.body) {
        throw new Error("No response body received from server");
      }

      const reader = response.body.getReader();

      const decoder = new TextDecoder("utf-8");

      let buffer = "";
      let fullResponse = "";

      while (true) {
        const { value, done } = await reader.read();

        if (done) {
          break;
        }

        const decoded = decoder.decode(value, {
          stream: true,
        });

        buffer += decoded;

        const events = buffer.split(/\r?\n\r?\n/);

        buffer = events.pop() || "";

        for (const event of events) {
          if (!event.trim()) {
            continue;
          }

          const beforeLength = fullResponse.length;

          const lines = event.split(/\r?\n/);

          for (const rawLine of lines) {
            const line = rawLine.trim();

            if (!line.startsWith("data:")) {
              continue;
            }

            const jsonText = line.replace(/^data:\s*/, "").trim();

            if (!jsonText) {
              continue;
            }

            try {
              const data = JSON.parse(jsonText);

              if (data.delta) {
                fullResponse += data.delta;

                const cleaned = cleanLeadJson(fullResponse);

                updateLastAssistantMessage(cleaned);
              }

              if (data.lead_captured) {
                setMessages((current) => [
                  ...current,
                  {
                    role: "system",
                    content:
                      "Lead captured — our team will reach out shortly.",
                  },
                ]);
              }

              if (data.error) {
                throw new Error(data.error);
              }
            } catch (error) {
              if (
                error instanceof Error &&
                error.message &&
                !error.message.includes("JSON")
              ) {
                throw error;
              }

              console.warn("SSE JSON parse warning:", jsonText);
            }
          }

          if (fullResponse.length !== beforeLength) {
            updateLastAssistantMessage(cleanLeadJson(fullResponse));
          }
        }
      }

      // Process any remaining SSE data after stream closes.
      if (buffer.trim()) {
        processSSEEvent(buffer);
      }

      if (!fullResponse.trim()) {
        updateLastAssistantMessage(
          "I'm here and ready to help. Please try your question again."
        );
      }
    } catch (error) {
      console.error("NexusAI chat error:", error);

      updateLastAssistantMessage(
        "I’m having trouble responding right now. Please WhatsApp us at +91 99333 51374 or email info@nrglobalnexus.com."
      );
    } finally {
      setStreaming(false);
    }
  };

  const onKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      send();
    }
  };

  return (
    <>
      <button
        data-testid="chatbot-toggle"
        onClick={() => setOpen((value) => !value)}
        className="fixed bottom-24 right-6 z-[9999] w-14 h-14 rounded-full bg-[#0A58CA] hover:bg-[#0047AB] text-white flex items-center justify-center shadow-lg shadow-[#0A58CA]/30 transition-transform hover:scale-105"
        aria-label="Open AI assistant"
      >
        {open ? <X size={22} /> : <Bot size={22} />}
      </button>

      {open && (
        <div
          data-testid="chatbot-panel"
          className="fixed bottom-44 right-6 z-[9999] w-[92vw] max-w-[400px] h-[560px] bg-white rounded-2xl border border-[var(--nx-line)] shadow-2xl shadow-[#0A192F]/20 flex flex-col overflow-hidden"
        >
          <div className="bg-[#0A192F] text-white px-4 py-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-[#0A58CA] flex items-center justify-center">
              <Sparkles size={16} />
            </div>

            <div className="flex-1">
              <p className="font-display font-semibold text-sm">
                NexusAI Assistant
              </p>

              <p className="text-[11px] text-white/60">
                Multilingual · Lead-aware · 24/7
              </p>
            </div>

            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 bg-[#F8FAFC]">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex gap-2 ${
                  message.role === "user" ? "flex-row-reverse" : ""
                }`}
              >
                {message.role !== "system" && (
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 ${
                      message.role === "user"
                        ? "bg-[#0A192F] text-white"
                        : "bg-[#0A58CA] text-white"
                    }`}
                  >
                    {message.role === "user" ? (
                      <UserIcon size={13} />
                    ) : (
                      <Bot size={13} />
                    )}
                  </div>
                )}

                <div
                  className={`text-sm leading-relaxed px-3 py-2 rounded-xl max-w-[80%] whitespace-pre-wrap ${
                    message.role === "user"
                      ? "bg-[#0A192F] text-white rounded-tr-sm"
                      : message.role === "system"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200 mx-auto text-center text-xs"
                      : "bg-white text-[#0A192F] border border-[var(--nx-line)] rounded-tl-sm"
                  }`}
                >
                  {message.content ||
                    (streaming && index === messages.length - 1
                      ? "Thinking..."
                      : "")}
                </div>
              </div>
            ))}

            <div ref={endRef} />
          </div>

          <div className="p-3 border-t border-[var(--nx-line)] bg-white">
            <div className="flex items-end gap-2">
              <textarea
                rows={1}
                value={input}
                onChange={(event) => setInput(event.target.value)}
                onKeyDown={onKeyDown}
                placeholder="Ask about services, pricing, or request a proposal..."
                data-testid="chatbot-input"
                className="flex-1 resize-none text-sm px-3 py-2 rounded-md border border-[var(--nx-line)] focus:border-[#0A58CA] outline-none max-h-24"
              />

              <button
                onClick={send}
                disabled={streaming || !input.trim()}
                data-testid="chatbot-send"
                className="nx-btn-primary w-10 h-10 rounded-md flex items-center justify-center disabled:opacity-50"
              >
                <Send size={15} />
              </button>
            </div>

            <div className="flex items-center justify-between mt-2 text-[11px] text-[#0A192F]/50">
              <a
                href="https://wa.me/919933351374"
                target="_blank"
                rel="noreferrer"
                className="hover:text-[#0A58CA]"
              >
                WhatsApp handoff
              </a>

              <span>Powered by NexusAI</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;