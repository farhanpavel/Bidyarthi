import ClubSidebar from "@/components/ClubSidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <ClubSidebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
