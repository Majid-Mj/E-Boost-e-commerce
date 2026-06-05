import React, { Suspense, Component } from "react";
import { Canvas } from "@react-three/fiber";
import { useGLTF, OrbitControls, Environment, Html, Bounds } from "@react-three/drei";

useGLTF.preload("/xbox_elite_controller.glb");

// ─── Error boundary ───────────────────────────────────────────────────────────
class ThreeErrorBoundary extends Component {
    constructor(props) { super(props); this.state = { hasError: false }; }
    static getDerivedStateFromError() { return { hasError: true }; }
    render() {
        if (this.state.hasError)
            return <div className="flex items-center justify-center w-full h-full text-[#94a3b8] text-sm">🎮 3D viewer unavailable</div>;
        return this.props.children;
    }
}

// ─── The raw model (no manual scaling — Bounds handles it) ────────────────────
function ControllerModel() {
    const { scene } = useGLTF("/xbox_elite_controller.glb");
    return <primitive object={scene} />;
}

// ─── Loading spinner ──────────────────────────────────────────────────────────
function Loader() {
    return (
        <Html center>
            <div style={{ textAlign: "center", color: "#94a3b8" }}>
                <div style={{
                    width: 32, height: 32,
                    border: "3px solid #00C8FF",
                    borderTopColor: "transparent",
                    borderRadius: "50%",
                    animation: "r3fspin .8s linear infinite",
                    margin: "0 auto 8px",
                }} />
                <p style={{ fontSize: 10, letterSpacing: 2, textTransform: "uppercase" }}>Loading…</p>
                <style>{`@keyframes r3fspin{to{transform:rotate(360deg)}}`}</style>
            </div>
        </Html>
    );
}

// ─── Main ─────────────────────────────────────────────────────────────────────
export default function Controller3D() {
    return (
        <div className="flex flex-col items-center">
            {/* Canvas — matches original controller image size */}
            <div style={{ width: 580, height: 530 }}>
                <ThreeErrorBoundary>
                    <Canvas
                        camera={{ position: [0, 0, 10], fov: 45 }}
                        gl={{ alpha: true, antialias: true }}
                        style={{ background: "transparent", width: "100%", height: "100%" }}
                    >
                        {/* Arctic-Blue tinted lighting */}
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[4, 7, 5]} intensity={2.2} color="#ffffff" />
                        <directionalLight position={[-4, 2, -3]} intensity={0.8} color="#00C8FF" />
                        <pointLight position={[2, 2, 3]} intensity={1.0} color="#00FFCC" />
                        <pointLight position={[-2, -1, 2]} intensity={0.5} color="#00C8FF" />

                        {/* HDRI reflections only, no background */}
                        <Environment preset="city" background={false} />

                        {/* Bounds auto-fits camera to show 100% of the model - removed 'observe' to stop flickering */}
                        <Suspense fallback={<Loader />}>
                            <Bounds fit clip margin={1.02}>
                                <ControllerModel />
                            </Bounds>
                        </Suspense>

                        {/* Drag-to-rotate — no zoom, no pan */}
                        <OrbitControls
                            makeDefault
                            enableDamping={true}
                            dampingFactor={0.05}
                            enableZoom={false}
                            enablePan={false}
                            maxPolarAngle={Math.PI / 1.5}
                            minPolarAngle={Math.PI / 5}
                        />
                    </Canvas>
                </ThreeErrorBoundary>
            </div>

            <p className="text-[10px] text-[#94a3b8]/40 uppercase tracking-widest select-none -mt-4">
                🖱 Drag to rotate
            </p>
        </div>
    );
}
