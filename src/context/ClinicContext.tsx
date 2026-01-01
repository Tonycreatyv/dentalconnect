import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { supabase } from "../lib/supabase";
import { useAuth } from "./AuthContext";
import type { ClinicProfile } from "../lib/types";

type ClinicContextValue = {
  clinic: ClinicProfile | null;
  clinicId: string | null;
  loading: boolean;
};

const ClinicContext = createContext<ClinicContextValue | undefined>(undefined);

export const ClinicProvider = ({ children }: { children: React.ReactNode }) => {
  const { user } = useAuth();
  const [clinic, setClinic] = useState<ClinicProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    const loadClinic = async () => {
      if (!user) {
        setClinic(null);
        setLoading(false);
        return;
      }

      setLoading(true);
      const { data, error } = await supabase
        .from("clinic_users")
        .select("clinic_id, clinics(id, name, domain)")
        .eq("user_id", user.id)
        .limit(1)
        .maybeSingle();

      if (!mounted) return;

      if (error || !data) {
        setClinic(null);
        setLoading(false);
        return;
      }

      const clinicData = Array.isArray(data.clinics) ? data.clinics[0] : data.clinics;

      setClinic({
        id: clinicData?.id ?? data.clinic_id,
        name: clinicData?.name ?? null,
        domain: clinicData?.domain ?? null,
      });
      setLoading(false);
    };

    loadClinic();

    return () => {
      mounted = false;
    };
  }, [user]);

  const value = useMemo(
    () => ({ clinic, clinicId: clinic?.id ?? null, loading }),
    [clinic, loading]
  );

  return <ClinicContext.Provider value={value}>{children}</ClinicContext.Provider>;
};

export const useClinic = () => {
  const context = useContext(ClinicContext);
  if (!context) {
    throw new Error("useClinic must be used within ClinicProvider");
  }
  return context;
};
