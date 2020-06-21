declare module 'gifshot' {
  type GifshotOptionsInternal = {
    /** Desired width of the image */
    gifWidth: number;
    /** Desired height of the image */
    gifHeight: number;
    /**
     * If this option is used, then a GIF will be created using these images
     * e.g. ['http://i.imgur.com/2OO33vX.jpg', 'http://i.imgur.com/qOwVaSN.png', 'http://i.imgur.com/Vo5mFZJ.gif'],
     * Note: Make sure these image resources are CORS enabled to prevent any cross-origin JavaScript errors
     * Note: You may also pass a NodeList of existing image elements on the page
     */
    images: string[] | HTMLImageElement[] | null;
    /**
     * If this option is used, then a gif will be created using the appropriate video
     * HTML5 video that you would like to create your animated GIF from
     * Note: Browser support for certain video codecs is checked, and the appropriate video is selected
     * Note: You may also pass a NodeList of existing video elements on the page
     * e.g. 'video': ['example.mp4', 'example.ogv'],
     */
    video: string[] | HTMLVideoElement[] | null;
    /**
     * You can pass an existing video element to use for the webcam GIF creation process,
     * and this video element will not be hidden (useful when used with the keepCameraOn option)
     * Pro tip: Set the height and width of the video element to the same values as your future GIF
     * Another Pro Tip: If you use this option, the video will not be paused, the object url not revoked, and
     * the video will not be removed from the DOM.  You will need to handle this yourself.
     */
    webcamVideoElement: HTMLVideoElement | null;
    /**
     * Whether or not you would like the user's camera to stay on after the GIF is created
     * Note: The cameraStream Media object is passed back to you in the createGIF() callback function
     */
    keepCameraOn: boolean;
    /**
     * Expects a cameraStream Media object
     * Note: Passing an existing camera stream will allow you to create another GIF and/or snapshot without
     * asking for the user's permission to access the camera again if you are not using SSL
     */
    cameraStream: MediaStream;
    /** CSS filter that will be applied to the image (eg. blur(5px)) */
    filter: string;
    /** The amount of time (in seconds) to wait between each frame capture */
    interval: number;
    /** The amount of time (in seconds) to start capturing the GIF (only for HTML5 videos) */
    offset: number | null;
    /**
     * The number of frames to use to create the animated GIF
     * Note: Each frame is captured every 100 milliseconds of a video and every ms for existing images
     */
    numFrames: number;
    /** The amount of time (10 = 1s) to stay on each frame */
    frameDuration: number;
    /** The text that covers the animated GIF */
    text: string;
    /** The font weight of the text that covers the animated GIF */
    fontWeight: string;
    /** The font size of the text that covers the animated GIF */
    fontSize: string;
    /**
     * The minimum font size of the text that covers the animated GIF
     * Note: This option is only applied if the text being applied is cut off
     */
    minFontSize: string;
    /** Whether or not the animated GIF text will be resized to fit within the GIF container */
    resizeFont: boolean;
    /** The font family of the text that covers the animated GIF */
    fontFamily: string;
    /** The font color of the text that covers the animated GIF */
    fontColor: string;
    /** The horizontal text alignment of the text that covers the animated GIF */
    textAlign: string;
    /** The vertical text alignment of the text that covers the animated GIF */
    textBaseline: string;
    /** The X (horizontal) Coordinate of the text that covers the animated GIF (only use this if the default textAlign and textBaseline options don't work for you) */
    textXCoordinate: number;
    /** The Y (vertical) Coordinate of the text that covers the animated GIF (only use this if the default textAlign and textBaseline options don't work for you) */
    textYCoordinate: number;
    /** Callback function that provides the current progress of the current image */
    progressCallback: (progress: number) => void;
    /** Callback function that is called when the current image is completed */
    completeCallback: () => void;
    /**
     * how many pixels to skip when creating the palette. Default is 10. Less is better, but slower.
     * Note: By adjusting the sample interval, you can either produce extremely high-quality images slowly, or produce good images in reasonable times.
     * With a sampleInterval of 1, the entire image is used in the learning phase, while with an interval of 10,
     * a pseudo-random subset of 1/10 of the pixels are used in the learning phase. A sampling factor of 10 gives a
     * substantial speed-up, with a small quality penalty.
     */
    sampleInterval: number;
    /** how many web workers to use to process the animated GIF frames. Default is 2. */
    numWorkers: number;
    /**
     * Whether or not you would like to save all of the canvas image binary data from your created GIF
     * Note: This is particularly useful for when you want to re-use a GIF to add text to later
     */
    saveRenderingContexts: boolean;
    /**
     * Expects an array of canvas image data
     * Note: If you set the saveRenderingContexts option to true, then you get the savedRenderingContexts in the createGIF callback function
     */
    savedRenderingContexts: CanvasImageData[];
    /**
     * If frame-specific text is supplied with the image array, you can force the frame-specific text to not be displayed by making this option 'false'.
     */
    showFrameText: boolean;
    /**
     * When existing images or videos are requested used, we set a CORS attribute on the request.
     * Options are 'Anonymous', 'use-credentials', or a falsy value (like '') to not set a CORS attribute.
     */
    crossOrigin: 'Anonymous' | 'use-credentials' | false;
    /** If an image is given here, it will be stamped on top of the GIF frames */
    waterMark: null;
    /** Height of the waterMark */
    waterMarkHeight: null;
    /** Height of the waterMark */
    waterMarkWidth: null;
    /** The X (horizontal) Coordinate of the watermark image */
    waterMarkXCoordinate: 1;
    /** The Y (vertical) Coordinate of the watermark image */
    waterMarkYCoordinate: 1;
  };

  export type GifshotOptions = Partial<GifshotOptionsInternal>;
  type CreateGifCallback = (obj: {
    image: string;
    cameraStream: MediaStream;
    error: boolean;
    errorCode: string;
    errorMessage: string;
    savedRenderingContexts?: CanvasImageData[];
  }) => void;

  type TakeSnapshotCallback = (obj: {
    image: string;
    error: boolean;
    errorCode: string;
    errorMessage: string;
    savedRenderingContexts?: CanvasImageData[];
  }) => void;

  interface GifShot {
    createGIF(options: GifshotOptions, callback: CreateGifCallback): void;
    takeSnapshot(options: GifshotOptions, callback: TakeSnapshotCallback): void;
    stopVideoStreaming(): void;
    isSupported(): boolean;
    isExistingVideoGIFSupported(codecs?: string[]): boolean;
    isExistingImagesGIFSupported(): boolean;
  }

  const gifshot: GifShot;

  export default gifshot;
}
