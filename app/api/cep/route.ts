import { NextResponse } from "next/server";
import { z } from "zod";
import { fetchCoordinatesFromCep, CepError } from "@/services/cep";

const querySchema = z.object({
  cep: z.string().regex(/^\d{8}$/, "cep must be exactly 8 digits"),
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const parsed = querySchema.safeParse({ cep: searchParams.get("cep") });

  if (!parsed.success) {
    return NextResponse.json(
      {
        error: "Invalid query parameters",
        details: parsed.error.errors.map((e) => e.message),
      },
      { status: 400 }
    );
  }

  try {
    const coordinates = await fetchCoordinatesFromCep(parsed.data.cep);
    return NextResponse.json(coordinates);
  } catch (error) {
    if (error instanceof CepError) {
      if (error.code === "NOT_FOUND") {
        return NextResponse.json({ error: "CEP not found" }, { status: 404 });
      }
      return NextResponse.json({ error: "Service unavailable" }, { status: 502 });
    }
    throw error;
  }
}
