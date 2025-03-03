import ChefSidebar from "@/components/ChefSidebar/page";

export default function Landing({ children }) {
  return (
    <div className="bg-[#F8F9FA] flex">
      <ChefSidebar />
      <div className="w-[90%]">{children}</div>
    </div>
  );
}
