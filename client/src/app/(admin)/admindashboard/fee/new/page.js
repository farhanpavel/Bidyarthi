"use client";
import { url } from "@/components/Url/page";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { IndianRupeeIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Page() {
  const [formData, setFormData] = useState({
    feeName: "",
    feeType: "",
    amount: "",
    dueDate: "",
    description: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      feeType: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch(`${url}/api/fee`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          feeName: formData.feeName,
          feeType: formData.feeType,
          amount: formData.amount,
          feeDate: formData.dueDate, // Mapping dueDate to feeDate as per API requirement
          feeDescription: formData.description,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit fee");
      }

      const result = await response.json();

      alert("ফি সফলভাবে যোগ করা হয়েছে!", {
        description: `${formData.feeName} সিস্টেমে যোগ করা হয়েছে।`,
      });
      router.back();
      // Reset form after successful submission
      setFormData({
        feeName: "",
        feeType: "",
        amount: "",
        dueDate: "",
        description: "",
      });
    } catch (error) {
      toast.error("ফি যোগ করতে সমস্যা হয়েছে", {
        description: error.message || "দয়া করে আবার চেষ্টা করুন",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReset = () => {
    setFormData({
      feeName: "",
      feeType: "",
      amount: "",
      dueDate: "",
      description: "",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex items-center gap-2">
            <IndianRupeeIcon className="h-8 w-8 text-primary" />
            <div>
              <CardTitle className="text-2xl font-bold font-bangla">
                ফি সংযোজন প্যানেল
              </CardTitle>
              <CardDescription className="font-bangla">
                এখানে নতুন ফি যুক্ত করা যাবে এবং প্রয়োজনীয় তথ্য সংরক্ষণ করা
                যাবে
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium font-bangla">
                ফির নাম
              </label>
              <Input
                name="feeName"
                value={formData.feeName}
                onChange={handleChange}
                placeholder="ফির নাম লিখুন"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium font-bangla">
                ফির ধরন
              </label>
              <Select
                onValueChange={handleSelectChange}
                value={formData.feeType}
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="ফির ধরন নির্বাচন করুন" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tuition">টিউশন ফি</SelectItem>
                  <SelectItem value="exam">পরীক্ষার ফি</SelectItem>
                  <SelectItem value="library">লাইব্রেরি ফি</SelectItem>
                  <SelectItem value="laboratory">ল্যাবরেটরি ফি</SelectItem>
                  <SelectItem value="transport">পরিবহন ফি</SelectItem>
                  <SelectItem value="other">অন্যান্য</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium font-bangla">
                পরিমাণ
              </label>
              <div className="relative">
                <IndianRupeeIcon className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                <Input
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  className="pl-10"
                  placeholder="পরিমাণ লিখুন"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium font-bangla">
                শেষ তারিখ
              </label>
              <Input
                type="date"
                name="dueDate"
                value={formData.dueDate}
                onChange={handleChange}
                required
              />
              <p className="text-sm text-muted-foreground font-bangla">
                শিক্ষার্থীদের এই ফি প্রদানের শেষ তারিখ
              </p>
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-medium font-bangla">
                বিবরণ
              </label>
              <Input
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="ফির বিবরণ লিখুন"
              />
              <p className="text-sm text-muted-foreground font-bangla">
                ফি সম্পর্কে অতিরিক্ত বিবরণ
              </p>
            </div>

            <div className="flex justify-end space-x-4">
              <Button variant="outline" type="button" onClick={handleReset}>
                রিসেট
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "সাবমিট করা হচ্ছে..." : "ফি যোগ করুন"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
