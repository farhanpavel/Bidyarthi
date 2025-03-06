import BusSidebar from "@/components/BusSidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <BusSidebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
