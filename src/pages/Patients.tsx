import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../lib/supabase";
import { useClinic } from "../context/ClinicContext";
import { SectionCard } from "../components/SectionCard";
import { EmptyState } from "../components/EmptyState";
import { formatDateTime } from "../lib/format";
import type { ConversationMessage, Patient } from "../lib/types";

const Patients = () => {
  const { clinicId } = useClinic();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [messages, setMessages] = useState<ConversationMessage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadPatients = async () => {
      setLoading(true);

      const patientsQuery = supabase
        .from("patients")
        .select("id, full_name, phone, created_at")
        .order("created_at", { ascending: false });

      const messagesQuery = supabase
        .from("conversation_messages")
        .select("patient_phone, channel, message, created_at")
        .order("created_at", { ascending: false })
        .limit(500);

      if (clinicId) {
        patientsQuery.eq("clinic_id", clinicId);
        messagesQuery.eq("clinic_id", clinicId);
      }

      const [{ data: patientsData }, { data: messagesData }] = await Promise.all([
        patientsQuery,
        messagesQuery,
      ]);

      if (!mounted) return;
      setPatients(patientsData ?? []);
      setMessages(messagesData ?? []);
      setLoading(false);
    };

    loadPatients();

    return () => {
      mounted = false;
    };
  }, [clinicId]);

  const messageSummary = useMemo(() => {
    const map = new Map<
      string,
      { lastMessage?: ConversationMessage; count: number; channel?: string | null }
    >();

    messages.forEach((message) => {
      const key = message.patient_phone ?? "Unknown";
      if (!map.has(key)) {
        map.set(key, { lastMessage: message, count: 0, channel: message.channel });
      }
      const entry = map.get(key);
      if (!entry) return;
      entry.count += 1;
      if (!entry.lastMessage && message.created_at) {
        entry.lastMessage = message;
      }
    });

    return map;
  }, [messages]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">Patients</h2>
        <p className="mt-2 text-sm text-slate-400">Monitor patients and communication history.</p>
      </div>

      <SectionCard title="Patient directory" description="Access last activity and channel insights.">
        {loading ? (
          <p className="text-sm text-slate-400">Loading patients...</p>
        ) : patients.length === 0 ? (
          <EmptyState
            title="No patients yet"
            message="Patient records will appear once they engage with your clinic."
          />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Last message</th>
                  <th className="px-4 py-3 text-left">Channel</th>
                  <th className="px-4 py-3 text-left">Conversations</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {patients.map((patient) => {
                  const key = patient.phone ?? "Unknown";
                  const summary = messageSummary.get(key);
                  return (
                    <tr key={patient.id} className="bg-slate-950/30 text-slate-300">
                      <td className="px-4 py-3">
                        <Link
                          to={`/patients/${patient.id}`}
                          className="font-medium text-slate-100 hover:text-teal-300"
                        >
                          {patient.full_name ?? "Unnamed patient"}
                        </Link>
                        <div className="text-xs text-slate-500">{patient.phone ?? "No phone"}</div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="text-xs text-slate-400">
                          {formatDateTime(summary?.lastMessage?.created_at)}
                        </div>
                        <div className="text-sm text-slate-200">
                          {summary?.lastMessage?.message ?? "No messages yet"}
                        </div>
                      </td>
                      <td className="px-4 py-3">{summary?.channel ?? "--"}</td>
                      <td className="px-4 py-3">{summary?.count ?? 0}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </SectionCard>
    </div>
  );
};

export default Patients;
