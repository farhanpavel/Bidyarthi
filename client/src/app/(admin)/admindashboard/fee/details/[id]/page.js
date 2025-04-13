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
  XCircle,
  ArrowLeft,
  CheckCircle2,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { url } from "@/components/Url/page";

export default function Page({ params }) {
  const [fee, setFee] = useState(null);
  const [paymentHistory, setPaymentHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isPaymentProcessing, setIsPaymentProcessing] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch fee details
        const feeResponse = await fetch(`${url}/api/fee/${params.id}`);
        if (!feeResponse.ok) {
          throw new Error("Failed to fetch fee details");
        }
        const feeData = await feeResponse.json();
        setFee(feeData);

        // Fetch payment history
        const paymentResponse = await fetch(`${url}/api/fee/payment/get`);
        if (paymentResponse.ok) {
          const paymentData = await paymentResponse.json();
          // Filter payments to only include those for the current fee
          const filteredPayments = paymentData.filter(
            (payment) => payment.feeId === params.id
          );
          setPaymentHistory(filteredPayments);
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [params.id]);

  const getStatusColor = (daysRemaining) => {
    return daysRemaining <= 0
      ? "bg-red-100 text-red-800"
      : "bg-yellow-100 text-yellow-800";
  };

  const getDaysRemaining = (feeDate) => {
    const today = new Date();
    const dueDate = new Date(feeDate);
    const timeDiff = dueDate.getTime() - today.getTime();
    return Math.ceil(timeDiff / (1000 * 60 * 60 * 24));
  };

  const getStatusText = (feeDate) => {
    const daysRemaining = getDaysRemaining(feeDate);
    return daysRemaining <= 0 ? "মেয়াদোত্তীর্ণ" : `${daysRemaining} দিন বাকি`;
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

  const daysRemaining = getDaysRemaining(fee.feeDate);
  const statusText = getStatusText(fee.feeDate);

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
                      daysRemaining
                    )}`}
                  >
                    {statusText}
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
                      {daysRemaining <= 0 ? (
                        <>
                          <span>মেয়াদোত্তীর্ণ</span>
                        </>
                      ) : (
                        <>
                          <span>{daysRemaining} দিন বাকি</span>
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
              {paymentHistory.length > 0 ? (
                paymentHistory.map((payment) => (
                  <div
                    key={payment.id}
                    className="flex items-center justify-between py-2 border-b"
                  >
                    <div className="flex items-center gap-3">
                      <CheckCircle2 className="h-5 w-5 text-green-600" />
                      <div>
                        <div className="font-medium font-bangla">
                          {payment.user.name} ({payment.user.email})
                        </div>
                        <div className="flex gap-2 items-center mt-1">
                          <Badge className="bg-green-100 text-green-800 font-bangla">
                            Paid
                          </Badge>
                          <div className="text-sm text-muted-foreground font-bangla">
                            প্রদান করা হয়েছে{" "}
                            {new Date(
                              payment.createdAt || new Date()
                            ).toLocaleDateString("bn-BD")}
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="font-semibold">
                      ₹{fee.amount.toLocaleString()}
                    </div>
                  </div>
                ))
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
