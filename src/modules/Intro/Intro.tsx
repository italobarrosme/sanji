import { Button } from "@/common/components/Button";
import { Icon } from "@iconify/react";
import { useCustomizerStore } from "../Customizer/store";
import { motion } from "framer-motion";

type IntroProps = {
  config: any;
};

export const Intro = ({ config }: IntroProps) => {
  const { toggle } = useCustomizerStore();

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -120 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", duration: 1.0, delay: 1 }}
        className="flex justify-between"
      >
        <span className="text-2xl font-bold text-black">MaCloset</span>
        <Button className="bg-transparent">
          <Icon
            icon="bx:shopping-bag"
            className="text-5xl font-bold text-black"
          />
        </Button>
      </motion.header>
      <motion.section key="main" {...config} >
        <div className="grid grid-cols-6 gap-4 pt-24">
          <h1 className="text-8xl max-w-80 italic font-extrabold tracking-tighter text-black font-nunitoSans uppercase col-start-2 col-span-4">
            Let&apos;s do it
          </h1>
          <p className="text-black w-full col-start-2 col-span-5  md:w-1/3 ">
            Transforme seu estilo em uma obra-prima. Deixe-nos criar sua camisa
            sob medida, onde cada costura é uma expressão de qualidade e
            dedicação. Sua história merece ser vestida com exclusividade. Vamos
            confeccionar sua camisa.
          </p>
          <Button className="col-start-2 col-span-4" onClick={() => toggle()}>
            <span>Customize</span>
            <Icon icon="ph:paint-brush-light" className="text-2xl" />
          </Button>
        </div>
      </motion.section>
    </>
  );
};
