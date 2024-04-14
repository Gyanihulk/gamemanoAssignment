import Image from "next/image";

export const Logo = () => {
  return (
    <div id="logo" className="flex flex-row">
      <Image height={50} width={50} alt="logo" src="/logo.svg" />
      <div className="flex items-center  text-slate-500 text-sm font-[500] pl-6 transition-all">DVD Bazzar</div>
    </div>
  );
};
