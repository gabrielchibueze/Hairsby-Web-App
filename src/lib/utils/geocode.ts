// lib/utils/geocode.ts
export async function geocodeAddress(
  address: string
): Promise<{ lat: number; lng: number } | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
        address
      )}&key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}`
    );

    const data = await response.json();

    if (data.status === "OK" && data.results[0]?.geometry) {
      return data.results[0].geometry.location;
    }
    return null;
  } catch (error) {
    console.error("Geocoding error:", error);
    return null;
  }
}
