"use client";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import { HandPlatter, Trophy } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useState } from "react";

export default function Page() {
  const router = useRouter();
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchClubs = async () => {
      try {
        const response = await fetch(`${url}/api/club`);
        if (!response.ok) {
          throw new Error("Failed to fetch clubs");
        }
        const data = await response.json();
        setClubs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchClubs();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (clubs.length === 0) return <div>No clubs found</div>;

  return (
    <div>
      <div className="p-9 space-y-2">
        <div className="flex gap-x-2 items-center text-black">
          <Trophy className="text-3xl" />
          <h1 className="text-2xl font-bold font-bangla">ক্লাব</h1>
        </div>
        <p className="text-xs text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
        একসাথে শিখুন, বেড়ে উঠুন এবং আনন্দ উপভোগ করুন
        </p>
        <div className="grid grid-cols-3 gap-4">
          {clubs.map((club) => (
            <div
              key={club.id}
              className="bg-white p-4 shadow-xl rounded-lg flex flex-col"
            >
              <img
                src={club.club_url}
                alt={club.name}
                className="w-full h-40 object-cover rounded-md"
              />
              <div className="flex-grow space-y-3 mt-3 mb-3">
                <h1 className="text-[#000000] font-semibold text-lg">
                  {club.name}
                </h1>
                <p className="text-xs text-[#7848F4]">{club.description}</p>
              </div>
              <div className="mt-auto  text-center">
                <Button
                  onClick={() => {
                    router.push(`/userdashboard/club/${club.id}`);
                  }}
                >
                  বিস্তারিত দেখুন
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
