import CleanerSidebar from "@/components/CleanerSidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <CleanerSidebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
