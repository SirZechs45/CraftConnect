import { ReactNode } from "react";
import { Link } from "wouter";

interface CategoryItemProps {
  icon: ReactNode;
  name: string;
  href: string;
}

export default function CategoryItem({ icon, name, href }: CategoryItemProps) {
  return (
    <Link href={href} className="group">
      <div className="flex flex-col items-center">
        <div className="bg-gray-100 rounded-full p-4 w-20 h-20 flex items-center justify-center mb-3 group-hover:bg-primary/10 transition-colors">
          {icon}
        </div>
        <span className="text-gray-800 font-medium text-center">{name}</span>
      </div>
    </Link>
  );
}
