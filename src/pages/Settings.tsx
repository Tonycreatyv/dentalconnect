import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const META_APP_ID = import.meta.env.VITE_META_APP_ID;

export default function Settings() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (code) {
      console.log("META AUTH CODE:", code);

      fetch(
        "https://oeeyzqqnxvcpibdwuugu.functions.supabase.co/meta-oauth",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            code,
            clinic_id: "TEMP_CLINIC_ID",
          }),
        }
      )
        .then((res) => res.json())
        .then((data) => {
          console.log("META CONNECT RESPONSE:", data);
        })
        .catch((err) => {
          console.error("Error enviando code a Supabase", err);
        });
    }
  }, [location]);

  const connectMeta = () => {
    const redirectUri =
      "https://cheery-unicorn-5cc92c.netlify.app/settings";

    const url =
      `https://www.facebook.com/v19.0/dialog/oauth` +
      `?client_id=${META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=pages_show_list,pages_read_engagement,pages_messaging`;

    window.location.href = url;
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Settings</h1>

      <section style={{ marginTop: 40 }}>
        <h2>Meta Integration</h2>
        <p>Connect WhatsApp & Facebook Pages</p>

        <button
          onClick={connectMeta}
          style={{
            padding: "12px 20px",
            borderRadius: 8,
            background: "#1877F2",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Connect Meta
        </button>
      </section>
    </div>
  );
}
