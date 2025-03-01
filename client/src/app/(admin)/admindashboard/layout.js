import AdminSidebar from "@/components/AdminSidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <AdminSidebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
