import { useFrame } from "@react-three/fiber"
import { useRef } from "react"
import { easing } from "maath"
import { useCustomizerStore } from "@/modules/Customizer/store"

type CameraRigProps = {
  children: React.ReactNode
}

export const CameraRig = ({children}: CameraRigProps) => {
    const group = useRef<THREE.Group>(null)
    const { isOpen } = useCustomizerStore();

    useFrame((state, delta) => {
      if (!group.current) return
      easing.damp3(
        state.camera.position,
        [!isOpen ? -state.viewport.width / 8 : 0, 0, 2],
        0.45,
        delta
      )
      easing.dampE(
        group.current.rotation,
        [state.pointer.y / 10, -state.pointer.x / 5, 0],
        0.25,
        delta
      )
    })

    return (
      <group ref={group}>
        {children}
      </group>
    )
}