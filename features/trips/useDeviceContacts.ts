"use client";

import { useCallback, useEffect, useState } from "react";

export interface DeviceContact {
  id: string;
  name: string;
  tel?: string;
  email?: string;
  /** Object URL from Contact Picker icon blob — revoke on cleanup. */
  avatarUrl?: string;
}

type ContactProperty = "name" | "email" | "tel" | "icon";

interface ContactInfo {
  name?: string[];
  email?: string[];
  tel?: string[];
  icon?: Blob[];
}

interface ContactsManager {
  select(
    properties: ContactProperty[],
    options?: { multiple?: boolean }
  ): Promise<ContactInfo[]>;
  getProperties(): Promise<string[]>;
}

function getContactsManager(): ContactsManager | null {
  if (typeof navigator === "undefined") return null;
  const contacts = (
    navigator as Navigator & { contacts?: ContactsManager }
  ).contacts;
  return contacts ?? null;
}

export function isContactPickerSupported(): boolean {
  return Boolean(getContactsManager());
}

function displayName(contact: ContactInfo, index: number): string {
  const name = contact.name?.find((n) => n.trim())?.trim();
  if (name) return name;
  const tel = contact.tel?.find((t) => t.trim())?.trim();
  if (tel) return tel;
  const email = contact.email?.find((e) => e.trim())?.trim();
  if (email) return email;
  return `Contact ${index + 1}`;
}

function mapContacts(
  raw: ContactInfo[],
  previous: DeviceContact[]
): DeviceContact[] {
  for (const prev of previous) {
    if (prev.avatarUrl?.startsWith("blob:")) URL.revokeObjectURL(prev.avatarUrl);
  }

  return raw.map((contact, index) => {
    const icon = contact.icon?.[0];
    return {
      id: `contact-${index}-${displayName(contact, index)}`,
      name: displayName(contact, index),
      tel: contact.tel?.find((t) => t.trim())?.trim(),
      email: contact.email?.find((e) => e.trim())?.trim(),
      avatarUrl: icon ? URL.createObjectURL(icon) : undefined,
    };
  });
}

/**
 * Device contacts via the Contact Picker API (Chromium Android / supported
 * browsers). Requires a user gesture — call `pickContacts()`.
 */
export function useDeviceContacts() {
  const [supported, setSupported] = useState(false);
  const [contacts, setContacts] = useState<DeviceContact[]>([]);
  const [picking, setPicking] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setSupported(isContactPickerSupported());
  }, []);

  useEffect(() => {
    return () => {
      for (const contact of contacts) {
        if (contact.avatarUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(contact.avatarUrl);
        }
      }
    };
  }, [contacts]);

  const pickContacts = useCallback(async () => {
    const manager = getContactsManager();
    if (!manager) {
      setError("Contact access isn’t available in this browser.");
      return;
    }

    setPicking(true);
    setError(null);

    try {
      const available = await manager.getProperties();
      const properties = (
        ["name", "tel", "email", "icon"] as ContactProperty[]
      ).filter((p) => available.includes(p));

      if (!properties.includes("name") && !properties.includes("tel")) {
        setError("This device doesn’t expose contact details.");
        return;
      }

      const selected = await manager.select(properties, { multiple: true });
      if (!selected.length) return;

      setContacts((prev) => mapContacts(selected, prev));
    } catch (err) {
      if (err instanceof DOMException && err.name === "AbortError") return;
      console.error("Contact picker failed:", err);
      setError("Couldn’t read contacts. Check permissions and try again.");
    } finally {
      setPicking(false);
    }
  }, []);

  const clearContacts = useCallback(() => {
    setContacts((prev) => {
      for (const contact of prev) {
        if (contact.avatarUrl?.startsWith("blob:")) {
          URL.revokeObjectURL(contact.avatarUrl);
        }
      }
      return [];
    });
  }, []);

  return {
    supported,
    contacts,
    picking,
    error,
    pickContacts,
    clearContacts,
  };
}
