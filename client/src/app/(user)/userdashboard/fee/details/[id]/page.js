"use client";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IndianRupeeIcon,
  Calendar,
  FileText,
  Clock,
  Users,
  CheckCircle2,
  XCircle,
  ArrowLeft,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { url } from "@/components/Url/page";
import Cookies from "js-cookie";

export default function Page({ params }) {
  const [fee, setFee] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const [paymentStatus, setPaymentStatus] = useState(false);
  const [paymentDetails, setPaymentDetails] = useState(null);
  const router = useRouter();
  const token = Cookies.get("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fee details
        const feeResponse = await fetch(`${url}/api/fee/${params.id}`);
        if (!feeResponse.ok) throw new Error("Failed to fetch fee details");
        const feeData = await feeResponse.json();
        setFee(feeData);

        // Check payment status - modified section
        const statusResponse = await fetch(
          `${url}/api/fee/status/data/${params.id}`,
          {
            headers: {
              Authorization: token,
            },
          }
        );

        if (statusResponse.ok) {
          const statusData = await statusResponse.json();
          console.log("Status data:", statusData); // Debug log

          // Handle null or undefined statusData
          if (statusData) {
            setPaymentStatus(statusData.status || false);
            setPaymentDetails(statusData.details || null);
          } else {
            setPaymentStatus(false);
            setPaymentDetails(null);
          }
        } else {
          console.error("Status check failed:", statusResponse.status);
          setPaymentStatus(false);
          setPaymentDetails(null);
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
        setPaymentStatus(false);
        setPaymentDetails(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const getStatusColor = (status) => {
    switch (status) {
      case "paid":
        return "bg-green-100 text-green-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "overdue":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handlePayment = async () => {
    console.log(fee.amount, fee.id);
    setIsPaymentProcessing(true);
    try {
      const response = await fetch(`${url}/api/fee/init`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `${token}`,
        },
        body: JSON.stringify({
          amount: fee.amount,
          feeId: fee.id,
        }),
      });

      if (!response.ok) {
        throw new Error("Payment initialization failed");
      }

      const paymentData = await response.json();

      if (paymentData.url) {
        // Use window.location for external URLs
        window.location.href = paymentData.url;
      } else {
        throw new Error("Payment URL not received");
      }
    } catch (err) {
      alert("Payment failed", {
        description: err.message || "Please try again",
      });
    } finally {
      setIsPaymentProcessing(false);
    }
  };

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
          <Button className="mt-4 font-bangla" onClick={() => router.back()}>
            ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  if (!fee) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <p className="font-bangla">কোন ফি পাওয়া যায়নি</p>
          <Button className="mt-4 font-bangla" onClick={() => router.back()}>
            ফিরে যান
          </Button>
        </div>
      </div>
    );
  }

  const isPaid = paymentStatus || fee.status === "paid";

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <Button
          variant="ghost"
          className="mb-6 hover:bg-gray-100 font-bangla"
          onClick={() => router.back()}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          ফির তালিকায় ফিরে যান
        </Button>

        <Card className="mb-6">
          <CardHeader className="border-b">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <CardTitle className="text-2xl font-bold font-bangla">
                  {fee.feeName}
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize font-bangla">
                    {fee.feeType}
                  </Badge>
                  <Badge
                    className={`capitalize font-bangla ${getStatusColor(
                      isPaid ? "paid" : fee.status
                    )}`}
                  >
                    {isPaid
                      ? "পরিশোধিত"
                      : fee.status === "pending"
                      ? "বকেয়া"
                      : "মেয়াদোত্তীর্ণ"}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold font-bangla">
                  ₹{fee.amount.toLocaleString()}
                </div>
                <div className="text-sm text-muted-foreground font-bangla">
                  মোট পরিমাণ
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground font-bangla">
                      শেষ তারিখ
                    </div>
                    <div className="font-medium font-bangla">
                      {new Date(fee.feeDate).toLocaleDateString("bn-BD", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground font-bangla">
                      পরিশোধের অবস্থা
                    </div>
                    <div className="font-medium flex items-center gap-2 font-bangla">
                      {isPaid ? (
                        <>
                          <CheckCircle2 className="h-4 w-4 text-green-600" />
                          <span>পরিশোধিত</span>
                        </>
                      ) : fee.status === "overdue" ? (
                        <>
                          <XCircle className="h-4 w-4 text-red-600" />
                          <span>মেয়াদোত্তীর্ণ</span>
                        </>
                      ) : (
                        <>
                          <Clock className="h-4 w-4 text-yellow-600" />
                          <span>বকেয়া</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Users className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground font-bangla">
                      প্রযোজ্য
                    </div>
                    <div className="font-medium font-bangla">
                      সমস্ত শিক্ষার্থী
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <FileText className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground font-bangla">
                      বিবরণ
                    </div>
                    <div className="font-medium font-bangla">
                      {fee.feeDescription}
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <IndianRupeeIcon className="h-5 w-5 text-primary mt-1" />
                  <div>
                    <div className="text-sm text-muted-foreground font-bangla">
                      অর্থপ্রদানের বিবরণ
                    </div>
                    <div className="font-medium font-bangla">
                      <ul className="list-disc list-inside space-y-1">
                        <li>
                          মূল পরিমাণ: ₹{(fee.amount * 0.9).toLocaleString()}
                        </li>
                        <li>
                          অতিরিক্ত চার্জ: ₹{(fee.amount * 0.1).toLocaleString()}
                        </li>
                        <li className="font-bold">
                          মোট: ₹{fee.amount.toLocaleString()}
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {!isPaid && (
              <div className="border-t pt-6 mt-6">
                <Button
                  className="w-full md:w-auto font-bangla"
                  size="lg"
                  disabled={isPaymentProcessing}
                  onClick={handlePayment}
                >
                  {isPaymentProcessing
                    ? "প্রক্রিয়াধীন..."
                    : "এখনই প্রদান করুন"}
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-bangla">
              অর্থপ্রদানের ইতিহাস
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {isPaid ? (
                <div className="flex items-center justify-between py-2 border-b">
                  <div className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 text-green-600" />
                    <div>
                      <div className="font-medium font-bangla">
                        {paymentDetails?.status || "সম্পূর্ণ অর্থপ্রদান"}
                      </div>
                      <div className="text-sm text-muted-foreground font-bangla">
                        প্রদান করা হয়েছে{" "}
                        {paymentDetails?.date
                          ? new Date(paymentDetails.date).toLocaleDateString(
                              "bn-BD"
                            )
                          : new Date().toLocaleDateString("bn-BD")}
                      </div>
                    </div>
                  </div>
                  <div className="font-semibold">
                    ₹{paymentDetails?.amount || fee.amount.toLocaleString()}
                  </div>
                </div>
              ) : (
                <div className="text-center text-muted-foreground py-4 font-bangla">
                  কোন অর্থপ্রদানের ইতিহাস পাওয়া যায়নি
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
