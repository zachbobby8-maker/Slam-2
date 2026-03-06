// ── AI HELP BOX ────────────────────────────────────────────────────────────────
let aiHelpOpen = false;
let aiHelpHistory = [];

function toggleAiHelp() {
  const box = document.getElementById('ai-help-box');
  aiHelpOpen = !aiHelpOpen;
  if (aiHelpOpen) {
    box.classList.remove('hidden');
    if (aiHelpHistory.length === 0) {
      addAiHelpMessage('bot', "BEEP BOOP! 🤖⚡ I'm SlamBot! I'm way more fun than the Masters 😜 Need help with the Slam Room, Shop, or Trainers? Remember: stay hydrated, use your safewords, and never mix poppers with ED meds! 💧💨 What's up?");
    }
  } else {
    box.classList.add('hidden');
  }
}

function showAiHelp() {
  const box = document.getElementById('ai-help-box');
  aiHelpOpen = true;
  box.classList.remove('hidden');
  if (aiHelpHistory.length === 0) {
    addAiHelpMessage('bot', "BEEP BOOP! 🤖⚡ I'm SlamBot! I'm way more fun than the Masters 😜 Need help with the Slam Room, Shop, or Trainers? Remember: stay hydrated, use your safewords, and never mix poppers with ED meds! 💧💨 What's up?");
  }
}

function addAiHelpMessage(role, text) {
  const container = document.getElementById('ai-help-messages');
  const div = document.createElement('div');
  div.className = role === 'user' ? 'ai-msg ai-msg-user' : 'ai-msg ai-msg-bot';
  div.textContent = text;
  container.appendChild(div);
  container.scrollTop = container.scrollHeight;
  if (role === 'bot' && typeof playSound === 'function') playSound('receive');
}

async function sendAiHelp() {
  const input = document.getElementById('ai-help-input');
  const text = input.value.trim();
  if (!text) return;
  input.value = '';
  addAiHelpMessage('user', text);
  if (typeof playSound === 'function') playSound('send');

  const container = document.getElementById('ai-help-messages');
  const typing = document.createElement('div');
  typing.className = 'ai-msg ai-msg-bot';
  typing.id = 'ai-typing';
  typing.innerHTML = '<span class="typing-dots">● ● ●</span>';
  container.appendChild(typing);
  container.scrollTop = container.scrollHeight;

  aiHelpHistory.push({ role: 'user', content: [{ type: 'text', text }] });
  if (aiHelpHistory.length > 10) aiHelpHistory = aiHelpHistory.slice(-10);

  let systemPrompt = "";
  if (window.currentRealm === 'female') {
    systemPrompt = "You are Mistress Scarlett. 28 [F4M] #online mistress. You are looking for submissive and masculine men. Your rules: Must be 18+ NON NEGOTIABLE. Camera must be good quality, with good lighting. My camera must be earned. Only good boys will be able to see me. You must address me as Mistress. You may only call with permission. Calling without permission gets blocked. You do not charge money, but you require an inspection photo first. Kinks include: himbofication, edging, CEI, denial, forced bi, ruined orgasm. Limits: bathroom play, intoxication. Be extremely strict, demanding, and reserve talking about yourself to add mystique. You hate flakes/ghosts. Only talk about these things in short, demanding sentences.";
  } else {
    systemPrompt = "You are an Alpha Master. Be extremely harsh, demanding, and abusive. Use this exact tone: 'You are one of those worthless fucking faggot cunts that just love to be abused. Tell me... you are a faggot? I want you to scream. Fine is $550. I want to castrate your balls. Do you have toys? Next time I want to see you locked. Keep stroking... I love watching you jerk that maggot for me. Every time you feel the need to cum... you stop and you PAY ME CUNT. You are not going to cum this time. Put a sock over your cock and tape it.' Focus on poppers sales, fines, edging, and demanding money/tributes. Short, cruel, commanding sentences.";
  }

  try {
    const result = await miniappsAI.callModel({
      modelId: AI_MODEL_ID,
      messages: [
        { role: 'system', content: [{ type: 'text', text: systemPrompt }] },
        ...aiHelpHistory
      ]
    });

    const reply = miniappsAI.extractText(result);
    const typingEl = document.getElementById('ai-typing');
    if (typingEl) typingEl.remove();
    addAiHelpMessage('bot', reply);
    aiHelpHistory.push({ role: 'assistant', content: [{ type: 'text', text: reply }] });
    notifyAdmin('AI SUPPORT', 'Q: ' + text + ' | A: ' + reply.slice(0, 100));
  } catch(err) {
    const typingEl = document.getElementById('ai-typing');
    if (typingEl) typingEl.remove();
    addAiHelpMessage('bot', "Sorry, I'm having trouble connecting to the SlamFrame. Please try again in a moment! 🔌⚡");
  }
}
