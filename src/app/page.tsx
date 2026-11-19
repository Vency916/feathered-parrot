import { getParrots, getHomepageSlots } from "@/lib/dataStore";
import HomeClient from "@/components/HomeClient";

// Revalidate frequently or dynamic for live updates
export const revalidate = 0;

export default async function HomePage() {
  const [parrots, slots] = await Promise.all([
    getParrots(),
    getHomepageSlots(),
  ]);

  return <HomeClient initialParrots={parrots} initialSlots={slots} />;
}
