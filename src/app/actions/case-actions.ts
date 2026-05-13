"use server";

import { getCases } from "@/lib/google-sheets";
import { ATCCase } from "@/lib/types";


export async function fetchCasesAction(): Promise<ATCCase[]> {
  try {
    return await getCases();
  } catch (error) {
    console.error("Error in fetchCasesAction:", error);
    return [];
  }
}
