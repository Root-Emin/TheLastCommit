import { contractorLogo } from "@/lib/contractors";

export default function ContractorLogo({
  name,
  className = "h-12 w-12 text-[15px]",
}: {
  name: string;
  className?: string;
}) {
  const { initials, gradient } = contractorLogo(name);
  return (
    <div
      className={`flex shrink-0 items-center justify-center rounded-xl bg-gradient-to-br font-bold text-white shadow-soft ${gradient} ${className}`}
    >
      {initials}
    </div>
  );
}
