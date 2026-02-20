interface NominatimResponse {
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    country_code?: string;
  };
}

export async function fetchCityName(
  latitude: number,
  longitude: number
): Promise<string | null> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse");
  url.searchParams.set("lat", String(latitude));
  url.searchParams.set("lon", String(longitude));
  url.searchParams.set("format", "json");

  let response: Response;
  try {
    response = await fetch(url.toString(), {
      headers: { "User-Agent": "devo-lavar-roupas/1.0" },
      signal: AbortSignal.timeout(5_000),
      next: { revalidate: 86400 },
    });
  } catch {
    return null;
  }

  if (!response.ok) return null;

  const data: NominatimResponse = await response.json();
  const { address } = data;
  if (!address) return null;

  const city =
    address.city ?? address.town ?? address.village ?? address.municipality;
  if (!city) return null;

  const country = address.country_code?.toUpperCase() ?? null;
  return country ? `${city}, ${country}` : city;
}
