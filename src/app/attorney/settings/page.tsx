"use client";

import { useState, useEffect } from "react";
import AppLayout from "@/components/attorney-layout";
import { Avatar, Field } from "@/components/ui";
import { useAuth } from "@/lib/auth-context";
import * as attorneysApi from "@/lib/api/attorneys";

const PRACTICE_AREAS = [
  "Personal Injury",
  "Family Law",
  "Criminal Law",
  "Immigration",
  "Employment Law",
];

export default function SettingsPage() {
  const { user } = useAuth();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Profile form state
  const [fullName, setFullName] = useState("");
  const [emailField, setEmailField] = useState("");
  const [phone, setPhone] = useState("");
  const [barNumber, setBarNumber] = useState("");
  const [firmName, setFirmName] = useState("");
  const [city, setCity] = useState("");

  // Practice areas
  const [areas, setAreas] = useState<string[]>([]);

  // Notification preferences
  const [sms, setSms] = useState(false);
  const [email, setEmail] = useState(false);
  const [push, setPush] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        const [profileRes, prefsRes] = await Promise.all([
          attorneysApi.getProfile(),
          attorneysApi.getPreferences(),
        ]);

        const attorney = profileRes.attorney;
        setFullName(attorney.name || user?.name || "");
        setEmailField(attorney.email || user?.email || "");
        setBarNumber(attorney.barNumber || "");
        setFirmName(attorney.firmName || "");
        setCity([attorney.city, attorney.state].filter(Boolean).join(", "));
        setAreas(attorney.specialties || []);

        const prefs = prefsRes.preferences;
        setSms(prefs.notificationSms);
        setEmail(prefs.notificationEmail);
        setPush(prefs.notificationPush);
      } catch (err) {
        console.error("Failed to load settings:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [user]);

  const toggleArea = (a: string) =>
    setAreas((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const handleSave = async () => {
    setSaving(true);
    try {
      const [cityPart, statePart] = city.split(",").map((s) => s.trim());
      await attorneysApi.updateProfile({
        city: cityPart || "",
        state: statePart || "",
        specialties: areas,
      });
    } catch (err) {
      console.error("Failed to save profile:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleTogglePreference = async (
    key: keyof Pick<attorneysApi.AttorneyPreferences, "notificationSms" | "notificationEmail" | "notificationPush">,
    currentValue: boolean,
    setter: (v: boolean) => void,
  ) => {
    const newValue = !currentValue;
    setter(newValue);
    try {
      await attorneysApi.updatePreferences({ [key]: newValue });
    } catch (err) {
      console.error("Failed to update preference:", err);
      setter(currentValue); // revert on failure
    }
  };

  if (loading) {
    return (
      <AppLayout>
        <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>Settings</h1>
        <div className="card" style={{ padding: "60px 30px", textAlign: "center" }}>
          <span style={{ fontSize: 15, color: "var(--text-3)" }}>Loading settings...</span>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <h1 style={{ fontSize: 24, fontWeight: 700, color: "var(--ink)", marginBottom: 28 }}>Settings</h1>

      {/* profile */}
      <div className="card" style={{ padding: "28px 30px", marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 22 }}>Profile</h3>
        <div className="row" style={{ gap: 24, marginBottom: 28 }}>
          <Avatar name={user?.name || fullName} size={72} />
          <div className="stack" style={{ gap: 4 }}>
            <span style={{ fontWeight: 700, fontSize: 18, color: "var(--ink)" }}>{user?.name || fullName}</span>
            <span style={{ fontSize: 14, color: "var(--text-3)" }}>{firmName}</span>
            <button style={{ fontSize: 13, fontWeight: 600, color: "var(--signal)", marginTop: 4 }}>
              Change photo
            </button>
          </div>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 18 }}>
          <Field label="Full name" placeholder="Full name" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <Field label="Email" type="email" placeholder="Email" value={emailField} onChange={(e) => setEmailField(e.target.value)} />
          <Field label="Phone" type="tel" placeholder="Phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
          <Field label="Bar number" placeholder="Bar number" value={barNumber} onChange={(e) => setBarNumber(e.target.value)} />
          <Field label="Firm name" placeholder="Firm name" value={firmName} onChange={(e) => setFirmName(e.target.value)} />
          <Field label="City" placeholder="City, State" value={city} onChange={(e) => setCity(e.target.value)} />
        </div>
        <div style={{ marginTop: 22 }}>
          <button className="btn btn-signal btn-sm" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save changes"}
          </button>
        </div>
      </div>

      {/* practice areas */}
      <div className="card" style={{ padding: "28px 30px", marginBottom: 24 }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>Practice areas</h3>
        <p style={{ fontSize: 13.5, color: "var(--text-3)", marginBottom: 18 }}>
          Select the practice areas you want to receive leads for.
        </p>
        <div className="row" style={{ gap: 10, flexWrap: "wrap" }}>
          {PRACTICE_AREAS.map((a) => {
            const on = areas.includes(a);
            return (
              <button
                key={a}
                onClick={() => toggleArea(a)}
                style={{
                  padding: "9px 18px",
                  borderRadius: 99,
                  fontSize: 13.5,
                  fontWeight: 600,
                  background: on ? "var(--pine)" : "transparent",
                  color: on ? "#fff" : "var(--text-2)",
                  border: on ? "1.5px solid var(--pine)" : "1.5px solid var(--line-2)",
                  cursor: "pointer",
                  transition: "all .15s",
                }}
              >
                {a}
              </button>
            );
          })}
        </div>
      </div>

      {/* lead alerts */}
      <div className="card" style={{ padding: "28px 30px" }}>
        <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--ink)", marginBottom: 18 }}>Lead alerts</h3>
        <p style={{ fontSize: 13.5, color: "var(--text-3)", marginBottom: 22 }}>
          Choose how you want to be notified when a new lead is matched.
        </p>
        <div className="stack" style={{ gap: 16 }}>
          {([
            { label: "SMS", desc: "Get a text for every new lead", val: sms, set: setSms, key: "notificationSms" as const },
            { label: "Email", desc: "Receive an email summary", val: email, set: setEmail, key: "notificationEmail" as const },
            { label: "Push notification", desc: "Browser push alerts", val: push, set: setPush, key: "notificationPush" as const },
          ]).map((t) => (
            <div key={t.label} className="row between" style={{ padding: "14px 0", borderBottom: "1px solid var(--line)" }}>
              <div>
                <div style={{ fontWeight: 650, fontSize: 14.5, color: "var(--ink)" }}>{t.label}</div>
                <div style={{ fontSize: 13, color: "var(--text-3)" }}>{t.desc}</div>
              </div>
              <button
                onClick={() => handleTogglePreference(t.key, t.val, t.set)}
                style={{
                  width: 48,
                  height: 28,
                  borderRadius: 99,
                  background: t.val ? "var(--signal)" : "var(--line-2)",
                  position: "relative",
                  transition: "background .2s",
                  cursor: "pointer",
                  border: "none",
                }}
              >
                <span
                  style={{
                    position: "absolute",
                    top: 3,
                    left: t.val ? 23 : 3,
                    width: 22,
                    height: 22,
                    borderRadius: "50%",
                    background: "#fff",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.15)",
                    transition: "left .2s var(--ease)",
                  }}
                />
              </button>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
