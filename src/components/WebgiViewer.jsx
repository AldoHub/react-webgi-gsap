import React, { useEffect, useRef, useCallback,  useState, forwardRef } from "react";
import { ViewerApp, AssetManagerPlugin, GBufferPlugin, ProgressivePlugin, TonemapPlugin, SSRPlugin, SSAOPlugin, BloomPlugin, GammaCorrectionPlugin, addBasePlugins, mobileAndTabletCheck, CanvasSnipperPlugin } from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/src/all";
import { scrollAnimation } from "../lib/scroll-animation";

//add scrollTrigger
gsap.registerPlugin(ScrollTrigger);


const WebgiViewer = ({ src, width, height }) => {
    const canvasRef =  useRef(null);


    //avoid re-rendering of the function on every render - memoize
    const memoizeScrollAnimation = useCallback((position, target, onUpdate) => {
        if(position && target && onUpdate){
            scrollAnimation(position, target, onUpdate);
        }
    },[]);


    //avoid recreating the canvas on every render -use useCallback
    const setupViewer = useCallback(async () => {
        const viewer = new ViewerApp({canvas: canvasRef.current});
    
        //add plugins here
        const manager = await viewer.addPlugin(AssetManagerPlugin);
        //get camera
        const camera = viewer.scene.activeCamera;
        //get camera position
        const cameraPosition = camera.position;
        //get camera target
        const cameraTarget = camera.target;


        //add plugins
        await viewer.addPlugin(GBufferPlugin);
        await viewer.addPlugin(new ProgressivePlugin(32));
        await viewer.addPlugin(new TonemapPlugin(true));
        await viewer.addPlugin(SSRPlugin);
        await viewer.addPlugin(SSAOPlugin);
        await viewer.addPlugin(BloomPlugin);


        viewer.renderer.refreshPipeline();

        await manager.addFromPath(src);

        viewer.getPlugin(TonemapPlugin).config.clipBackground = true
        viewer.scene.activeCamera.setCameraOptions({controlsEnabled: false});

        window.scrollTo(0, 0);

        let needsUpdate = true;

        //mark the viever and camera for update
        const onUpdate = () => {
            needsUpdate = true;
            viewer.setDirty();
        }

        viewer.addEventListener("preFrame", function (e) {
            if (needsUpdate) {
                camera.positionTargetUpdated(true)
                needsUpdate = false;
            }
        });

        memoizeScrollAnimation(cameraPosition, cameraTarget, )

    }, []);


    //call the setupViewer function on component mount
    useEffect(() => {
        setupViewer();
    }, []);
       
    return (
        <div id="webgi-canvas-container">
            <canvas id="webgi-canvas" ref={canvasRef} width={width} height={height}></canvas>
        </div>
    );
}

export default WebgiViewer;