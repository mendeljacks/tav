import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

const CameraOrbitController = () => {
    const { camera, gl } = useThree()
    useEffect(() => {
        const controls = new OrbitControls(camera, gl.domElement)
        return () => {
            controls.dispose()
        }
    }, [camera, gl])
    return null
}

function Box(props: any) {
    // This reference will give us direct access to the mesh
    const mesh: any = useRef()
    // Set up state for the hovered and active state
    const [hovered, setHover] = useState(false)
    const [active, setActive] = useState(false)
    // Subscribe this component to the render-loop, rotate the mesh every frame
    useFrame((state, delta) => (mesh.current.rotation.x += delta))
    // Return view, these are regular three.js elements expressed in JSX
    return (
        <mesh
            {...props}
            ref={mesh}
            scale={active ? 1.5 : 1}
            onClick={event => setActive(!active)}
            onPointerOver={event => setHover(true)}
            onPointerOut={event => setHover(false)}
        >
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
        </mesh>
    )
}

export const App = () => {
    return (
        <Canvas camera={{ position: [0, 2, 5] }}>
            <axesHelper args={[5]} />
            <ambientLight intensity={0.1} />
            <pointLight position={[10, 10, 10]} />
            <Box position={[-1.2, 0, 0]} />
            <Box position={[1.2, 0, 0]} />
            <CameraOrbitController />
        </Canvas>
    )
}
