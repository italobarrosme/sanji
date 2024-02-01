import { AccumulativeShadows, RandomizedLight } from "@react-three/drei"
import * as THREE from 'three';
import { useFrame } from "@react-three/fiber";
import { easing } from "maath";
import { useRef } from "react";
import { useCustomizerStore } from "@/modules/Customizer/store";


interface BackdropProps {
  color?: string;
  size?: number;
}


export const Backdrop = (props: BackdropProps) => {
  const shadows = useRef<any>();

  const { currentColor, } = useCustomizerStore();

  useFrame((state, delta) => {

    if (shadows.current === null) {
      return;
    }

    easing.dampC(
      shadows.current.getMesh().material.color, new THREE.Color(currentColor), 0.35, delta);
  })
  return (
    <AccumulativeShadows
      ref={shadows}
      temporal
      frames={60}
      alphaTest={0.85}
      scale={10}
      rotation = {[Math.PI / 2, 0, 0]} 
      position={[0, 0, -0.15]} {...props}>
      <RandomizedLight
        amount={5}
        radius={12}
        intensity={2.9}
        ambient={0.25}
        position={[5, 5, -10]}
      />
      <RandomizedLight
        amount={4}
        radius={5}
        intensity={0.25}
        ambient={0.55}
        position={[-5, 5, -9]}
      />
    </AccumulativeShadows>
  )
}