import { useEffect, useMemo, useState } from "react";
import { CalendarCheck, MessageSquareText, Plug, Users } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useClinic } from "../context/ClinicContext";
import { StatCard } from "../components/StatCard";
import { SectionCard } from "../components/SectionCard";
import { BarChart, type ChartDatum } from "../components/BarChart";
import { formatDateTime } from "../lib/format";
import type { ConversationMessage } from "../lib/types";
import { EmptyState } from "../components/EmptyState";

const Dashboard = () => {
  const { clinicId } = useClinic();
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    patients: 0,
    conversations: 0,
    appointments: 0,
    integrations: 0,
  });
  const [recentMessages, setRecentMessages] = useState<ConversationMessage[]>([]);
  const [messagesChart, setMessagesChart] = useState<ChartDatum[]>([]);
  const [leadsChart, setLeadsChart] = useState<ChartDatum[]>([]);

  useEffect(() => {
    let mounted = true;

    const loadDashboard = async () => {
      setLoading(true);

      const patientsQuery = supabase.from("patients").select("id", { count: "exact", head: true });
      const conversationsQuery = supabase
        .from("conversation_messages")
        .select("id", { count: "exact", head: true });
      const appointmentsQuery = supabase
        .from("appointments")
        .select("id", { count: "exact", head: true });
      const integrationsQuery = supabase
        .from("integrations")
        .select("id", { count: "exact", head: true })
        .eq("status", "connected");

      if (clinicId) {
        patientsQuery.eq("clinic_id", clinicId);
        conversationsQuery.eq("clinic_id", clinicId);
        appointmentsQuery.eq("clinic_id", clinicId);
        integrationsQuery.eq("clinic_id", clinicId);
      }

      const [patients, conversations, appointments, integrations] = await Promise.all([
        patientsQuery,
        conversationsQuery,
        appointmentsQuery,
        integrationsQuery,
      ]);

      const recentMessagesQuery = supabase
        .from("conversation_messages")
        .select("patient_phone, role, message, channel, created_at")
        .order("created_at", { ascending: false })
        .limit(6);

      if (clinicId) {
        recentMessagesQuery.eq("clinic_id", clinicId);
      }

      const { data: recentMessagesData } = await recentMessagesQuery;

      const chartStart = new Date();
      chartStart.setDate(chartStart.getDate() - 6);
      chartStart.setHours(0, 0, 0, 0);

      const chartQuery = supabase
        .from("conversation_messages")
        .select("created_at, channel")
        .gte("created_at", chartStart.toISOString())
        .order("created_at", { ascending: true });

      if (clinicId) {
        chartQuery.eq("clinic_id", clinicId);
      }

      const { data: chartMessages } = await chartQuery;

      const countsByDay: Record<string, number> = {};
      const countsByChannel: Record<string, number> = {};

      (chartMessages ?? []).forEach((message) => {
        const createdAt = message.created_at ? new Date(message.created_at) : null;
        if (!createdAt) return;
        const key = createdAt.toLocaleDateString();
        countsByDay[key] = (countsByDay[key] ?? 0) + 1;
        const channel = message.channel ?? "unknown";
        countsByChannel[channel] = (countsByChannel[channel] ?? 0) + 1;
      });

      const chartDays: ChartDatum[] = Array.from({ length: 7 }).map((_, index) => {
        const date = new Date(chartStart);
        date.setDate(chartStart.getDate() + index);
        const label = date.toLocaleDateString(undefined, { month: "short", day: "numeric" });
        const key = date.toLocaleDateString();
        return { label, value: countsByDay[key] ?? 0 };
      });

      const channels: ChartDatum[] = Object.entries(countsByChannel).map(([label, value]) => ({
        label,
        value,
      }));

      if (!mounted) return;

      setStats({
        patients: patients.count ?? 0,
        conversations: conversations.count ?? 0,
        appointments: appointments.count ?? 0,
        integrations: integrations.count ?? 0,
      });
      setRecentMessages(recentMessagesData ?? []);
      setMessagesChart(chartDays);
      setLeadsChart(channels.length ? channels : [{ label: "No data", value: 0 }]);
      setLoading(false);
    };

    loadDashboard();

    return () => {
      mounted = false;
    };
  }, [clinicId]);

  const statsCards = useMemo(
    () => [
      {
        label: "Patients",
        value: stats.patients,
        icon: <Users className="h-5 w-5 text-teal-300" />,
      },
      {
        label: "Conversations",
        value: stats.conversations,
        icon: <MessageSquareText className="h-5 w-5 text-teal-300" />,
      },
      {
        label: "Appointments",
        value: stats.appointments,
        icon: <CalendarCheck className="h-5 w-5 text-teal-300" />,
      },
      {
        label: "Active Integrations",
        value: stats.integrations,
        icon: <Plug className="h-5 w-5 text-teal-300" />,
      },
    ],
    [stats]
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">Operations overview</h2>
        <p className="mt-2 text-sm text-slate-400">
          Real-time visibility across patient communications and scheduling.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {statsCards.map((card) => (
          <StatCard key={card.label} label={card.label} value={card.value} icon={card.icon} />
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[2fr_1fr]">
        <BarChart title="Messages per day" data={messagesChart} />
        <BarChart title="Leads per channel" data={leadsChart} />
      </div>

      <SectionCard
        title="Recent conversations"
        description="Latest patient messages across all channels."
      >
        {loading ? (
          <p className="text-sm text-slate-400">Loading recent messages...</p>
        ) : recentMessages.length === 0 ? (
          <EmptyState
            title="No conversations yet"
            message="Messages will appear here once patients start chatting."
          />
        ) : (
          <div className="grid gap-3">
            {recentMessages.map((message, index) => (
              <div
                key={`${message.patient_phone ?? "patient"}-${index}`}
                className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-3"
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-100">
                      {message.patient_phone ?? "Unknown patient"}
                    </p>
                    <p className="text-xs text-slate-500">{message.channel ?? "unknown"}</p>
                  </div>
                  <p className="text-xs text-slate-500">{formatDateTime(message.created_at)}</p>
                </div>
                <p className="mt-2 text-sm text-slate-300">{message.message ?? "(no content)"}</p>
              </div>
            ))}
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default Dashboard;
