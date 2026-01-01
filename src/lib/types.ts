export type IntegrationStatus = "connected" | "disconnected" | "pending";
export type AppointmentStatus = "requested" | "confirmed" | "cancelled";

export type ConversationMessage = {
  id?: string;
  patient_phone?: string | null;
  role?: string | null;
  message?: string | null;
  channel?: string | null;
  created_at?: string | null;
};

export type Patient = {
  id: string;
  full_name?: string | null;
  phone?: string | null;
  created_at?: string | null;
};

export type Appointment = {
  id: string;
  patient_id?: string | null;
  patient_phone?: string | null;
  status?: AppointmentStatus | null;
  date?: string | null;
  time?: string | null;
  reason?: string | null;
  channel_source?: string | null;
};

export type Integration = {
  id: string;
  channel?: string | null;
  status?: IntegrationStatus | null;
  webhook_url?: string | null;
  enabled?: boolean | null;
};

export type ClinicProfile = {
  id: string;
  name?: string | null;
  domain?: string | null;
};
