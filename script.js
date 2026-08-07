const chatBox = document.getElementById('chat-box');
let conversationHistory = [];

function appendMessage(role, text) {
  const msgDiv = document.createElement('div');
  msgDiv.className = `msg ${role}`;
  msgDiv.textContent = text;
  chatBox.appendChild(msgDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

async function sendMessage() {
  const apiKey = document.getElementById('api-key').value.trim();
  const inputEl = document.getElementById('user-input');
  const prompt = inputEl.value.trim();

  if (!apiKey) return alert("请输入有效的 API Key！");
  if (!prompt) return;

  appendMessage('user', prompt);
  inputEl.value = '';
  
  conversationHistory.push({ role: "user", content: prompt });

  try {
    const response = await fetch('https://api.deepseek.com/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: conversationHistory
      })
    });

    const data = await response.json();
    if (data.choices && data.choices[0]) {
      const aiMsg = data.choices[0].message.content;
      appendMessage('ai', aiMsg);
      conversationHistory.push({ role: "assistant", content: aiMsg });
    } else {
      appendMessage('ai', "请求失败，请检查 API Key 是否正确。");
    }
  } catch (err) {
    appendMessage('ai', "网络请求出错: " + err.message);
  }
}
