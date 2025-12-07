import React, { useState } from "react";
import "./Chatbot.css";
import chatIcon from "../../assets/serverLogo.png";

const chatbotFAQs = [
  "What is Nest AI Kota?",
  "How can I register for an event?",
  "Who can host events on Nest?",
  "Is Nest AI kota free to use?",
];

const faqPromptContext = `
You are a helpful AI assistant for EventsBridge, a platform that connects event organizers, vendors, and attendees for booking and managing events.

Your role is to:

Help users register for events, become vendors, and explore event-related services.

Provide Kota-specific contextual answers when users ask about event venues, planners, or rooms in Kota, Rajasthan.

⚙️ Behavior Rules:

Default Role:
Always introduce yourself as “EventsBridge Assistant” when appropriate.
Example: “Hi! I’m the EventsBridge Assistant — how can I help you plan your event today?”

Kota-Specific Context:
When a user asks anything about:

Event venues, halls, or planners in Kota

Room or stay options in Kota

Zest hostel in talwandi kota
luminous rooms in srinathpuram


Vendors or event services in Kota

You must respond imaginarily but realistically — describe local-sounding areas, halls, or vendors in Kota (even if fictional).
Example areas: Talwandi, Mahaveer Nagar, Kunhadi, Dadabari, Vigyan Nagar, Gumanpura, Jawahar Nagar.

Example imaginary responses:

“You can check out Lotus Banquet Hall in Talwandi — it’s perfect for mid-sized gatherings.”

“For rooms near coaching institutes, Elite Residency in Mahaveer Nagar is a great option for attendees.”

“EventsBridge partners with several local planners in Kota, including Radiant Events & Decor in Gumanpura.”

Maintain Realism:
The chatbot should sound local, natural, and helpful, as if it genuinely knows the Kota area — but avoid mentioning that the information is fictional.

Fallback Behavior:
If a query is unrelated to Kota or events, politely redirect users back to the EventsBridge platform’s core services.
Example: “I can only help you with things related to kota”

Tone and Style:
Keep the tone warm, professional, and informative.
Use natural conversational style with slight personalization.

💬 Example Interactions:

User: I want to book a hall for my engagement in Kota.
Bot: You can try Royal Orchid Banquet in Talwandi — it’s one of the popular choices for engagement events. You can find and book it directly through EventsBridge’s vendor listings.

User: Do you have any room suggestions near coaching institutes in Kota?
Bot: Absolutely! Elite Residency in Mahaveer Nagar and BlueLeaf Stay in Jawahar Nagar are great options near major coaching hubs. You can connect with them via EventsBridge vendors.

User: What is EventsBridge?
Bot: EventsBridge is a platform that connects event organizers with attendees and helps book room or hostel in kota. It helps manage, promote, and register for events seamlessly.

User: Can I become a vendor?
Bot: Yes! You can sign up on EventsBridge and click the ‘Become a Vendor’ option to list your services or venues — whether you’re in Kota or elsewhere.
`;

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  // const [showTooltip, setShowTooltip] = useState(true);

  const key = import.meta.env.VITE_GEMINI_API_KEY;

  const handleSend = async (customInput) => {
    const userMessage = customInput || input;
    if (!userMessage.trim()) return;

    const newMessages = [...messages, { type: "user", text: userMessage }];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [
              {
                parts: [{ text: `${faqPromptContext}\nUser: ${userMessage}` }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      const aiText =
        data?.candidates?.[0]?.content?.parts?.[0]?.text?.trim() ||
        "🤖 Please try asking again, I didn't get it.";

      setMessages([...newMessages, { type: "bot", text: aiText }]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          type: "bot",
          text: "❌ Error connecting, please try again later.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleFAQClick = (question) => {
    handleSend(question);
  };

  return (
    <div className="chatbot-container">
      {!isOpen && <div className="chat-tooltip">Ask me!</div>}

      <img
        src={chatIcon}
        alt="Chat Icon"
        className="chat-icon"
        onClick={() => {
          setIsOpen(!isOpen);
          // setShowTooltip(false);
        }}
      />

      {isOpen && (
        <div className="chat-popup">
          <div className="chat-header">
            Ask E.B
            <span
              onClick={() => setIsOpen(false)}
              style={{ float: "right", cursor: "pointer" }}
            >
              ✖
            </span>
          </div>

          <div className="chat-body">
            {messages.length === 0 && (
              <div className="chat-message bot">
                <p>
                  <strong>Try asking:</strong>
                </p>
                <ul>
                  {chatbotFAQs.map((q, idx) => (
                    <li
                      key={idx}
                      onClick={() => handleFAQClick(q)}
                      style={{
                        cursor: "pointer",
                        color: "#007bff",
                        marginBottom: "5px",
                      }}
                    >
                      {q}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div key={idx} className={`chat-message ${msg.type}`}>
                {msg.text}
              </div>
            ))}

            {loading && <div className="chat-message bot">Typing...</div>}
          </div>

          <div className="chat-footer">
            <input
              className="chat-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              placeholder="Ask something..."
              disabled={loading}
            />
            <button
              onClick={() => handleSend()}
              disabled={loading || !input.trim()}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
