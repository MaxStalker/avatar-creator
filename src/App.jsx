import React, { useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, Plane, Sphere, RoundedBox } from "@react-three/drei";
import { PresentationControls, Center } from "@react-three/drei";
import { softShadows } from "@react-three/drei";
import { Sky } from "@react-three/drei";
import "./index.css";
import { FillView } from "./Components";

//const path = "/models/head.glb";
//const path = "/models/head.glb";
// const path = "/models/diorama.glb";
// useGLTF.preload("/models/diorama.glb");
//useGLTF.preload("/models/diorama.glb");

softShadows({
  frustum: 3.75,
  size: 0.005,
  near: 9.5,
  samples: 17,
  rings: 11, // Rings (default: 11) must be a int
});

function RenderDiorama() {
  const { nodes, materials } = useGLTF("/models/diorama.glb");
  console.log(nodes, materials);
  const geometry = nodes["Cube082"].geometry;
  return (
    <mesh geometry={geometry}>
      <meshPhongMaterial color="#f3f3f3" wireframe={true} />
    </mesh>
  );
}

function RenderHead() {
  const { nodes, materials } = useGLTF("/models/head-skew.glb");
  console.log("head", { nodes, materials });

  const scene = nodes["Wolf3D_Head"].children
    .filter((item) => item.isSkinnedMesh || item.isMesh)
    // .slice(0,1)
    .map((node) => {
      const geometry = node.geometry;
      geometry.morphAttributes = {};
      const material = materials[node.material.name];
      console.log({ geometry, material });
      return <mesh geometry={geometry} material={material}>
        <meshStandardMaterial normalMap={material.normalMap} />
      </mesh>;
    });

  return scene;
}

function RenderHair(props) {
  const { show } = props;
  if (!show) {
    return null;
  }
  const { nodes, materials } = useGLTF(`/models/face/hair.glb`);
  console.log("hair", { nodes, materials });

  const node = nodes["Wolf3D_Hair"];
  const geometry = node.geometry;
  const material = materials[node.material.name];
  console.log("hair -> resolved", {material, geometry});
  const {r,g,b} = material.color
  console.log({r,g,b})
  return <mesh geometry={geometry} meterial={material}>
    <meshStandardMaterial normalMap={material.normalMap} />
  </mesh>;
}

function RenderGlasses(props) {
  const { show, id = 0 } = props;
  if (!show) {
    return null;
  }
  const { nodes, materials } = useGLTF(`/models/accessories/glasses-${id}.glb`);
  console.log("glasses", { nodes, materials });
  const node = nodes["Wolf3D_Glasses"];
  const geometry = node.geometry;
  const material = materials[node.material.name];
  console.log("glasses -> resolved", material, geometry);
  return <mesh geometry={geometry} meterial={material}>
    <meshBasicMaterial map={material.map} />
  </mesh>;
}

function RenderCloth(props) {
  const { name } = props;
  if (!name) {
    return null;
  }
  const { nodes, materials } = useGLTF(`/models/cloth/${name}.glb`);
  console.log({ nodes, materials });
  const scene = nodes.Scene.children[0].children
    .filter((item) => item.isSkinnedMesh)
    .slice(0, 4)
    .map((node) => {
      const geometry = node.geometry;
      const material = materials[node.material.name];
      return <mesh geometry={geometry} material={material} />;
    });

  return <group>{scene}</group>;
}

function RenderMan(props) {
  const { name } = props;
  if (!name) {
    return null;
  }
  const { nodes, materials } = useGLTF(`/models/cloth/${name}.glb`);
  console.log({ nodes, materials });
  const scene = nodes.Scene.children[0].children
    .filter((item) => item.isSkinnedMesh)
    .map((node) => {
      const geometry = node.geometry;
      const material = materials[node.material.name];
      return <mesh geometry={geometry} material={material} />;
    });

  return <group>{scene}</group>;
}

function App(props) {
  const group = useRef();

  //const geometry = nodes ? nodes["Wolf3D_Head_2"].geometry : null

  // const material = materials["Wolf3D_Skin"]
  // console.log({geometry})

  // const geometry = null //nodes ? nodes["Wolf3D_Head"]?.geometry : null

  const [name, setName] = useState("basic");
  const [glasses, setGlasses] = useState(false);
  const [hair, setHair] = useState(true);
  return (
    <>
      <button
        onClick={() => {
          if (name === "basic") {
            setName("pull-and-bear");
          } else {
            setName("basic");
          }
        }}
      >
        Swap
      </button>
      <button
        onClick={() => {
          setGlasses(!glasses);
        }}
      >
        Toggle Glasses
      </button>

      <button
        onClick={() => {
          setHair(!hair);
        }}
      >
        Toggle Hair
      </button>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ fov: 50, position: [0, 1, 3] }}
        resize={{ scroll: true }}
      >
        <directionalLight intensity={0.35} position={[0.5, 1, 1]} />

        <Center>
          <PresentationControls>
            <RenderCloth name={name} />
            <group position={[0, 1.425, 0.07]}>
              <RenderHead name={name} />
              <RenderGlasses id={38} show={glasses} />
              <RenderHair show={hair} />
            </group>
          </PresentationControls>
        </Center>
      </Canvas>
    </>
  );
}

export default App;
