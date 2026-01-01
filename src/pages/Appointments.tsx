import { useEffect, useMemo, useState } from "react";
import { CalendarDays } from "lucide-react";
import { supabase } from "../lib/supabase";
import { useClinic } from "../context/ClinicContext";
import { SectionCard } from "../components/SectionCard";
import { EmptyState } from "../components/EmptyState";
import { StatusBadge } from "../components/StatusBadge";
import type { Appointment, Patient } from "../lib/types";

const Appointments = () => {
  const { clinicId } = useClinic();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadAppointments = async () => {
      setLoading(true);

      const appointmentsQuery = supabase
        .from("appointments")
        .select("id, patient_id, patient_phone, status, date, time, reason, channel_source")
        .order("date", { ascending: true })
        .limit(200);

      const patientsQuery = supabase.from("patients").select("id, full_name, phone");

      if (clinicId) {
        appointmentsQuery.eq("clinic_id", clinicId);
        patientsQuery.eq("clinic_id", clinicId);
      }

      const [{ data: appointmentsData }, { data: patientsData }] = await Promise.all([
        appointmentsQuery,
        patientsQuery,
      ]);

      if (!mounted) return;
      setAppointments(appointmentsData ?? []);
      setPatients(patientsData ?? []);
      setLoading(false);
    };

    loadAppointments();

    return () => {
      mounted = false;
    };
  }, [clinicId]);

  const patientMap = useMemo(() => {
    return new Map(patients.map((patient) => [patient.id, patient]));
  }, [patients]);

  const calendarSummary = useMemo(() => {
    const summary: Record<string, number> = {};
    appointments.forEach((appointment) => {
      if (!appointment.date) return;
      const key = appointment.date.includes("T") ? appointment.date.slice(0, 10) : appointment.date;
      summary[key] = (summary[key] ?? 0) + 1;
    });
    return summary;
  }, [appointments]);

  const upcomingDays = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return Array.from({ length: 7 }).map((_, index) => {
      const date = new Date(today);
      date.setDate(today.getDate() + index);
      const key = date.toISOString().slice(0, 10);
      return {
        key,
        label: date.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }),
        count: calendarSummary[key] ?? 0,
      };
    });
  }, [calendarSummary]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-semibold text-slate-100">Appointments</h2>
        <p className="mt-2 text-sm text-slate-400">Track appointment requests and confirmations.</p>
      </div>

      <SectionCard
        title="Upcoming schedule"
        description="Snapshot of the next seven days."
        action={
          <div className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-3 py-1 text-xs text-slate-400">
            <CalendarDays className="h-4 w-4" />
            Next 7 days
          </div>
        }
      >
        <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
          {upcomingDays.map((day) => (
            <div
              key={day.key}
              className="rounded-xl border border-slate-800 bg-slate-950/40 px-4 py-4"
            >
              <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{day.label}</p>
              <p className="mt-3 text-2xl font-semibold text-slate-100">{day.count}</p>
              <p className="text-xs text-slate-400">appointments scheduled</p>
            </div>
          ))}
        </div>
      </SectionCard>

      <SectionCard title="Appointment list" description="Requested, confirmed, and cancelled appointments.">
        {loading ? (
          <p className="text-sm text-slate-400">Loading appointments...</p>
        ) : appointments.length === 0 ? (
          <EmptyState title="No appointments" message="Requests will show up here." />
        ) : (
          <div className="overflow-hidden rounded-xl border border-slate-800">
            <table className="min-w-full divide-y divide-slate-800 text-sm">
              <thead className="bg-slate-950/60 text-xs uppercase tracking-[0.2em] text-slate-500">
                <tr>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Patient</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3 text-left">Reason</th>
                  <th className="px-4 py-3 text-left">Channel</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {appointments.map((appointment) => {
                  const patient = appointment.patient_id
                    ? patientMap.get(appointment.patient_id)
                    : null;
                  return (
                    <tr key={appointment.id} className="bg-slate-950/30 text-slate-300">
                      <td className="px-4 py-3">
                        <StatusBadge value={appointment.status ?? "requested"} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="font-medium text-slate-100">
                          {patient?.full_name ?? appointment.patient_phone ?? "Unknown"}
                        </div>
                        <div className="text-xs text-slate-500">{patient?.phone ?? ""}</div>
                      </td>
                      <td className="px-4 py-3">
                        {appointment.date ?? "--"} {appointment.time ?? ""}
                      </td>
                      <td className="px-4 py-3">{appointment.reason ?? "--"}</td>
                      <td className="px-4 py-3">{appointment.channel_source ?? "--"}</td>
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

export default Appointments;
