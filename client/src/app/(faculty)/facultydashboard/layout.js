import BusSidebar from "@/components/BusSidebar/page";
import FacultySidebar from "@/components/FacultySidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <FacultySidebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
