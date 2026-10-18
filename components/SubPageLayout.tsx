import SiteHeader from "@/components/SiteHeader";
import BackLink from "@/components/BackLink";
import PageNav from "@/components/PageNav";

interface SubPageLayoutProps {
  currentRoute?: string;
  children: React.ReactNode;
}

export default function SubPageLayout({
  currentRoute = "",
  children,
}: SubPageLayoutProps) {
  return (
    <div className="flex-1 flex flex-col w-full">
      <SiteHeader currentRoute={currentRoute} />
      <BackLink />
      <div className="flex-1 flex flex-col">{children}</div>
      <PageNav currentRoute={currentRoute} />
    </div>
  );
}
