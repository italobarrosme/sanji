"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Center, Environment } from "@react-three/drei";
import { Shirt } from "./components/Shirt";
import { Backdrop } from "./components/Backdrop";
import { CameraRig } from "./components/CameraRig";
import { Overlay } from "./components/Overlay";
import { Intro } from "../Intro";
import { Customizer } from "@/modules/Customizer";
import { useCustomizerStore } from "../Customizer/store";
import { AnimatePresence } from "framer-motion";

type ClosetCanvasProps = {
  position?: [number, number, number];
  rotation?: [number, number, number];
  fov?: number;
};

export const ClosetCanvas = ({
  position = [0, 0, 2.7],
  rotation = [0, 0, 0],
  fov = 25,
}: ClosetCanvasProps) => {
  const { isOpen } = useCustomizerStore();
  const transition = { type: "spring", duration: 0.8};
  const config = {
    initial: {x: -100, opacity: 0, transition: { ...transition, delay: 0.5 }},
    animate: {x: 0, opacity: 1, transition: { ...transition, delay: 0 }},
    exit: {x: -100, opacity: 0, transition: { ...transition, delay: 0 }},
  }


  return (
    <>
      <Overlay>
        <AnimatePresence>
          {!isOpen ?  (<Intro key="main" config={config} />):  (<Customizer key="custom" config={config} />) }
      {isOpen}
        </AnimatePresence>
      </Overlay>
      <Canvas
        shadows
        gl={{
          preserveDrawingBuffer: true,
        }}
        eventSource={
          typeof window !== "undefined"
            ? (document.querySelector("#main") as HTMLElement)
            : undefined
        }
        eventPrefix="client"
        camera={{ position, fov, rotation }}
      >
        <Environment preset="city" />
        <ambientLight intensity={0.5} />

        <Backdrop />
        <CameraRig>
          <Center>
            <Shirt />
          </Center>
        </CameraRig>
        {/* <OrbitControls /> */}
      </Canvas>
    </>
  );
};
