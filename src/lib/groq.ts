export async function groqGenerateText(prompt: string, model = 'openai/gpt-oss-120b'): Promise<string> {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    throw new Error('No Groq API key found. Set GROQ_API_KEY in .env to use Groq text generation.');
  }

  const response = await fetch('https://api.groq.com/openai/v1/responses', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      input: prompt,
    }),
  });

  const json = await response.json();
  if (!response.ok) {
    const errMsg = json?.error?.message || JSON.stringify(json);
    throw new Error(`Groq API error ${response.status}: ${errMsg}`);
  }

  if (typeof json.output_text === 'string' && json.output_text.trim()) {
    return json.output_text.trim();
  }

  const parseOutputItem = (item: any): string => {
    if (typeof item === 'string') return item;
    if (typeof item?.content === 'string') return item.content;
    if (Array.isArray(item?.content)) {
      return item.content.map((chunk: any) => (typeof chunk === 'string' ? chunk : chunk?.text || '')).join('');
    }
    if (typeof item?.text === 'string') return item.text;
    return '';
  };

  if (Array.isArray(json.output)) {
    const text = json.output.map(parseOutputItem).filter(Boolean).join(' ');
    if (text.trim()) return text.trim();
  }

  if (typeof json.text === 'string' && json.text.trim()) {
    return json.text.trim();
  }

  return JSON.stringify(json);
}
