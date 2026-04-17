"use server";

import { revalidateTag } from "next/cache";

/**
 * Manually invalidates the cached Google Sheets data.
 * This triggers a fresh fetch the next time the data is requested.
 */
export async function syncData() {
  try {
    revalidateTag("cases-data");
    console.log("[Server Action] Cache invalidated for 'cases-data'");
    return { success: true };
  } catch (error) {
    console.error("[Server Action] Failed to sync data:", error);
    return { success: false, error: "Falha al sincronizar" };
  }
}
