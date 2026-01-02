import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const META_APP_ID = import.meta.env.VITE_META_APP_ID;
const META_OAUTH_FUNCTION =
  "https://oeeyzqqnxvcpibdwuugu.supabase.co/functions/v1/meta-oauth";

export default function Settings() {
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const code = params.get("code");

    if (!code) return;

    console.log("META AUTH CODE:", code);

    fetch(META_OAUTH_FUNCTION, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code }),
    })
      .then((res) => res.json())
      .then((data) => {
        console.log("META OAUTH RESULT:", data);
      })
      .catch((err) => {
        console.error("META OAUTH ERROR:", err);
      });
  }, [location.search]);

  const connectMeta = () => {
    const redirectUri =
      "https://cheery-unicorn-5cc92c.netlify.app/settings";

    const authUrl =
      "https://www.facebook.com/v19.0/dialog/oauth" +
      `?client_id=${META_APP_ID}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=code` +
      `&scope=pages_show_list,pages_read_engagement,pages_messaging`;

    window.location.href = authUrl;
  };

  return (
    <div style={{ padding: 40 }}>
      <h1>Settings</h1>

      <button
        onClick={connectMeta}
        style={{
          marginTop: 20,
          padding: "12px 20px",
          background: "#1877F2",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          fontWeight: 600,
        }}
      >
        Connect Meta
      </button>
    </div>
  );
}
