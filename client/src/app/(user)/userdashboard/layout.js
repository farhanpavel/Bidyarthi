import UserSidebar from "@/components/UserSidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <UserSidebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
