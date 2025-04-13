"use client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { IndianRupeeIcon, Calendar, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { url } from "@/components/Url/page";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
const getStatusColor = (isPaid) => {
  return isPaid
    ? "bg-green-100 text-green-800"
    : "bg-yellow-100 text-yellow-800";
};

function Page() {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paymentStatuses, setPaymentStatuses] = useState({});
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchFeesAndStatuses = async () => {
      try {
        // Fetch all fees
        const feesResponse = await fetch(`${url}/api/fee`);
        if (!feesResponse.ok) throw new Error("Failed to fetch fees");
        const feesData = await feesResponse.json();
        setFees(feesData);

        // Fetch payment status for each fee
        const statusPromises = feesData.map(async (fee) => {
          try {
            const statusResponse = await fetch(
              `${url}/api/fee/status/data/${fee.id}`,
              {
                headers: {
                  Authorization: token,
                },
              }
            );
            if (statusResponse.ok) {
              const statusData = await statusResponse.json();
              return { feeId: fee.id, status: statusData.status };
            }
            return { feeId: fee.id, status: false };
          } catch (error) {
            return { feeId: fee.id, status: false };
          }
        });

        const statusResults = await Promise.all(statusPromises);
        const statusMap = statusResults.reduce((acc, curr) => {
          acc[curr.feeId] = curr.status;
          return acc;
        }, {});

        setPaymentStatuses(statusMap);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchFeesAndStatuses();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="font-bangla">ডেটা লোড হচ্ছে...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="text-red-500 font-bangla">ত্রুটি: {error}</p>
          <Button
            className="mt-4 font-bangla"
            onClick={() => window.location.reload()}
          >
            আবার চেষ্টা করুন
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <Card className="mb-8">
          <CardHeader className="space-y-4">
            <div className="flex gap-x-2 items-center text-black">
              <IndianRupeeIcon className="text-3xl" />
              <h1 className="text-2xl font-bold font-bangla">
                ফি ব্যবস্থাপনা প্যানেল
              </h1>
            </div>
            <p className="text-sm text-[#4a4a4a] border-black border-b-[2px] pb-4 font-bangla">
              আপনার ফি সহজেই পরিশোধ করুন এবং হিসাব সংরক্ষণ করুন
            </p>
          </CardHeader>
        </Card>

        {fees.length === 0 ? (
          <div className="text-center py-8">
            <p className="font-bangla">কোন ফি পাওয়া যায়নি</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fees.map((fee) => {
              const isPaid = paymentStatuses[fee.id] || false;
              return (
                <Card
                  key={fee.id}
                  className="hover:shadow-lg transition-shadow duration-300"
                >
                  <CardHeader className="pb-4">
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-semibold mb-2">
                          {fee.feeName}
                        </CardTitle>
                        <Badge variant="outline" className="capitalize">
                          {fee.feeType}
                        </Badge>
                      </div>
                      <Badge className={`capitalize ${getStatusColor(isPaid)}`}>
                        {isPaid ? "পরিশোধিত" : "বকেয়া"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <IndianRupeeIcon className="h-4 w-4" />
                        <span className="font-bangla">পরিমাণ</span>
                      </div>
                      <span className="font-semibold">
                        ₹{fee.amount.toLocaleString()}
                      </span>
                    </div>

                    <div className="flex items-center justify-between border-b pb-2">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar className="h-4 w-4" />
                        <span className="font-bangla">শেষ তারিখ</span>
                      </div>
                      <span>
                        {new Date(fee.feeDate).toLocaleDateString("bn-BD")}
                      </span>
                    </div>

                    <div className="flex items-start gap-2">
                      <FileText className="h-4 w-4 mt-1 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground font-bangla">
                        {fee.feeDescription}
                      </p>
                    </div>

                    <div className="pt-4">
                      <Button
                        onClick={() => {
                          router.push(`/userdashboard/fee/details/${fee.id}`);
                        }}
                        className="w-full font-bangla"
                        variant="outline"
                      >
                        বিস্তারিত দেখুন
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

export default Page;
