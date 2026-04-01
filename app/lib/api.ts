export async function sendTranscriptToN8n(data: {
  projectName: string;
  meetingTitle: string;
  transcript: string;
}) {
  const response = await fetch(
    "https://arjunbabu.app.n8n.cloud/webhook/a18a5c58-75c9-4d3b-806e-0f6aa0ef2bec",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Failed: ${response.status} ${text}`);
  }

  return response.json();
}