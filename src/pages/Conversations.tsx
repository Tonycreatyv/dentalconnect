import { useEffect, useMemo, useState } from "react";
import { MessageSquareText } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useClinic } from "../context/ClinicContext";
import { SectionCard } from "../components/SectionCard";
import { EmptyState } from "../components/EmptyState";
import { formatDateTime } from "../lib/format";
import type { ConversationMessage } from "../lib/types";

const Conversations = () => {
  const { clinicId } = useClinic();
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadMessages = async () => {
      setLoading(true);
      const query = supabase
        .from("conversation_messages")
        .select("patient_phone, role, message, channel, created_at")
        .order("created_at", { ascending: false })
        .limit(500);

      if (clinicId) {
        query.eq("clinic_id", clinicId);
      }

      const { data } = await query;
      if (!mounted) return;
      setMessages(data ?? []);
      setLoading(false);
    };

    loadMessages();

    return () => {
      mounted = false;
    };
  }, [clinicId]);

  const grouped = useMemo(() => {
    const buckets: Record<
      string,
      { patient: string; channel?: string | null; lastMessage?: ConversationMessage; count: number }
    > = {};

    messages.forEach((message) => {
      const key = message.patient_phone ?? "Unknown";
      if (!buckets[key]) {
        buckets[key] = {
          patient: key,
          channel: message.channel,
          lastMessage: message,
          count: 0,
        };
      }
      buckets[key].count += 1;
      if (!buckets[key].lastMessage && message.created_at) {
        buckets[key].lastMessage = message;
      }
    });

    return Object.values(buckets).sort((a, b) => {
      const dateA = a.lastMessage?.created_at ? new Date(a.lastMessage.created_at).getTime() : 0;
      const dateB = b.lastMessage?.created_at ? new Date(b.lastMessage.created_at).getTime() : 0;
      return dateB - dateA;
    });
  }, [messages]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">Conversations</h2>
        <p className="mt-2 text-sm text-slate-400">
          Read-only messaging history grouped by patient.
        </p>
      </div>

      <SectionCard
        title="Patient threads"
        description="WhatsApp, Instagram, and Messenger conversations."
        action={
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            <MessageSquareText className="h-4 w-4" />
            {grouped.length} threads
          </div>
        }
      >
        {loading ? (
          <p className="text-sm text-slate-400">Loading conversations...</p>
        ) : grouped.length === 0 ? (
          <EmptyState
            title="No messages yet"
            message="Once patients start chatting, their conversations appear here."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Channel</th>
                  <th className="px-4 py-3 text-left">Last message</th>
                  <th className="px-4 py-3 text-left">Messages</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800 text-slate-300">
                {grouped.map((thread) => (
                  <tr key={thread.patient} className="bg-slate-950/30">
                    <td className="px-4 py-3 font-medium text-slate-100">{thread.patient}</td>
                    <td className="px-4 py-3">{thread.channel ?? "--"}</td>
                    <td className="px-4 py-3">
                      <div className="text-xs text-slate-400">
                        {formatDateTime(thread.lastMessage?.created_at)}
                      </div>
                      <div className="text-sm text-slate-200">
                        {thread.lastMessage?.message ?? "(no content)"}
                      </div>
                    </td>
                    <td className="px-4 py-3">{thread.count}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default Conversations;
