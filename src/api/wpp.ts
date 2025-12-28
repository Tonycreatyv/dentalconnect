export async function createSession(session: string) {
  return fetch("http://TU_IP_DEL_VPS:3001/api/create-session", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ session }),
  });
}
