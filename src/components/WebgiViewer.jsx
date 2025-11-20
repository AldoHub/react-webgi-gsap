import React, { useEffect, useRef, useCallback,  useState, forwardRef, useImperativeHandle } from "react";
import { ViewerApp, AssetManagerPlugin, GBufferPlugin, ProgressivePlugin, TonemapPlugin, SSRPlugin, SSAOPlugin, BloomPlugin, GammaCorrectionPlugin, addBasePlugins, mobileAndTabletCheck, CanvasSnipperPlugin } from "webgi";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/src/all";
import { scrollAnimation } from "../lib/scroll-animation";

//add scrollTrigger
gsap.registerPlugin(ScrollTrigger);

//use forwardRef to expose the triggerPreview function to the parent component
const WebgiViewer = forwardRef(({ src, width, height, contentRef }, ref) => {
    const canvasRef =  useRef(null);

    const [viewerRef, setViewerRef] = useState(null);
    const [targetRef, setTargetRef] = useState(null);
    const [cameraRef, setCameraRef] = useState(null);
    const [positionRef, setPositionRef] = useState(null);
    const [previewMode, setPreviewMode] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const canvasContainerRef = useRef(null);

    //inside the useImperativeHandle function, we can expose the triggerPreview function to the parent component
    useImperativeHandle(ref, () => ({
       triggerPreview() {

        setPreviewMode(true);
        canvasContainerRef.current.style.pointerEvents = 'all';
        contentRef.current.style.opacity = 0;
                
        gsap.to(positionRef, {
            x: 13.04,
            y: -2.01,
            z: 2.29,
            duration: 2,
            onUpdate: () => {
                viewerRef.setDirty();
                cameraRef.positionTargetUpdated(true);
            }
        })

         gsap.to(targetRef, {
            x: 0.11,
            y: 0.0,
            z: 0.0,
            duration: 2,
        })

        viewerRef.scene.activeCamera.setCameraOptions({controlsEnabled: true});

       }
    }));

    //avoid re-rendering of the function on every render - memoize
    const memoizeScrollAnimation = useCallback((position, target, isMobile, onUpdate) => {
        if(position && target && onUpdate){
            scrollAnimation(position, target, isMobile,onUpdate);
        }
    },[]);


    //avoid recreating the canvas on every render -use useCallback
    const setupViewer = useCallback(async () => {
        const viewer = new ViewerApp({canvas: canvasRef.current});
        setViewerRef(viewer);
        const isMobileOrTablet = mobileAndTabletCheck();
        setIsMobile(isMobileOrTablet);

        //add plugins here
        const manager = await viewer.addPlugin(AssetManagerPlugin);
        //get camera
        const camera = viewer.scene.activeCamera;
        setCameraRef(camera);
        //get camera position
        const cameraPosition = camera.position;
        setPositionRef(cameraPosition);
        //get camera target
        const cameraTarget = camera.target;
        setTargetRef(cameraTarget);


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

        console.log("MOBILE OR TABLET", isMobileOrTablet); 

        if(isMobileOrTablet){
            cameraPosition.set(-16.7, 1.17, 11.7);
            cameraTarget.set(0, 1.37, 0);
            contentRef.current.className = 'mobile-or-tablet';
        }

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

        memoizeScrollAnimation(cameraPosition, cameraTarget, isMobileOrTablet ,onUpdate)

    }, []);


    //call the setupViewer function on component mount
    useEffect(() => {
        setupViewer();
    }, []);
       

    const handleExit = useCallback(() => {
        setPreviewMode(false);
        canvasContainerRef.current.style.pointerEvents = 'none';
        contentRef.current.style.opacity = 1;
        viewerRef.scene.activeCamera.setCameraOptions({controlsEnabled: false});

         gsap.to(positionRef, {
             x: !isMobile ? 1.56: 9.36,
            y: !isMobile ? 5.0 : 10.95,
            z: !isMobile ? 0.01 : 0.09,
            scrollTrigger: {
                trigger: '.display-section',
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: true,
            },
            onUpdate: () => {
                viewerRef.setDirty();
                cameraRef.positionTargetUpdated(true);
            }
        })

        gsap.to(targetRef, {
           x: !isMobile ? -0.55: -1.62,
            y: !isMobile ? 0.32: 0.02,
            z: !isMobile ? 0.0 : -0.06,
            scrollTrigger: {
                trigger: '.display-section',
                start: "top bottom",
                end: "top top",
                scrub: 2,
                immediateRender: true,
            },
            
            
        })
    }, [canvasContainerRef, viewerRef, cameraRef, positionRef, targetRef]);

    return (
        <div id="webgi-canvas-container" ref={canvasContainerRef}>
            <canvas id="webgi-canvas" ref={canvasRef} width={width} height={height}></canvas>
            {previewMode && <button className="button" onClick={handleExit}>Exit</button>}
        </div>
    );
});


export default WebgiViewer;

//min 1.32:44