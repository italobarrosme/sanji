import { Button } from "@/common/components/Button";
import { Icon } from "@iconify/react";
import { useCustomizerStore } from "./store";
import { cn } from "@/utils/cn/cn";
import { motion } from "framer-motion";

type CustomizerProps = {
  config: any;
};

export const Customizer = ({ config }: CustomizerProps) => {
  const colors = [
    "#ccc",
    "#EFBD4E",
    "#80ed99",
    "#726DE8",
    "#EF674E",
    "#d62828",
    "#F9A8D4",
    "#FFD166",
    "#06d6a0",
    "#14213d",
  ];
  const decals = ["cd", "react", "three2", "charmander"];

  const { currentColor, setColor, setDecal, toggle } = useCustomizerStore();

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.5, delay: 1 }}
        className="flex justify-between"
      >
        <span className="text-2xl font-bold text-black">MaCloset</span>
        <Button
          onClick={() => toggle()}
          style={{ backgroundColor: currentColor }}
        >
          <span>Voltar </span>
          <Icon icon="ph:arrow-left-light" className="text-2xl" />
        </Button>
      </motion.header>
      <motion.section key="custom" {...config}>
        <div className="flex h-[calc(100vh_-_130px)] justify-center w-full items-end">
          <div className="flex gap-4 items-center justify-between w-full flex-wrap">
            <div className="flex gap-4">
              {decals.map((decal) => (
                <div
                  key={decal}
                  className="w-14 h-14 items-center flex brightness-10 hover:brightness-90 cursor-pointer"
                >
                  <Button
                    onClick={() => setDecal(decal)}
                    className="w-full h-full rounded-full border-2 border-black p-2 bg-transparent"
                  >
                    <img src={`${decal}_thumb.png`} />
                  </Button>
                </div>
              ))}
            </div>
            <div className="flex gap-4">
              {colors.map((color) => (
                <Button
                  key={color}
                  className={cn("w-8 h-8 rounded-full border-2 border-black", {
                    "border-green-400": currentColor === color,
                  })}
                  style={{ backgroundColor: color }}
                  onClick={() => setColor(color)}
                />
              ))}
            </div>

            <Button
              style={{ backgroundColor: currentColor }}
              onClick={() => {
                const link = document.createElement("a");
                link.setAttribute("download", "macloset.png");
                link.setAttribute(
                  "href",
                  document
                    .querySelector("canvas")
                    ?.toDataURL("image/png")
                    .replace("image/png", "image/octet-stream") || ""
                );
                link.click();
              }}
            >
              <span>Download </span>
              <Icon icon="ph:download-light" className="text-2xl" />
            </Button>
          </div>
        </div>
      </motion.section>
    </>
  );
};
