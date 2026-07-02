"use client";

import { forwardRef, useState, type VideoHTMLAttributes } from "react";
import { Loader2 } from "lucide-react";

type VideoWithLoaderProps = VideoHTMLAttributes<HTMLVideoElement> & {
  wrapperClassName?: string;
  loadingLabel?: string;
  errorLabel?: string;
  showLoading?: boolean;
  showError?: boolean;
};

const VideoWithLoader = forwardRef<HTMLVideoElement, VideoWithLoaderProps>(function VideoWithLoader(
  {
    wrapperClassName = "relative h-full w-full bg-black",
    className,
    loadingLabel = "Loading video...",
    errorLabel = "Video load nahi ho paaya.",
    showLoading = true,
    showError = true,
    autoPlay,
    onLoadStart,
    onLoadedMetadata,
    onLoadedData,
    onWaiting,
    onCanPlay,
    onCanPlayThrough,
    onPlaying,
    onPlay,
    onProgress,
    onTimeUpdate,
    onError,
    ...props
  },
  ref
) {
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  return (
    <div className={wrapperClassName}>
      <video
        {...props}
        ref={ref}
        autoPlay={autoPlay}
        className={className}
        onLoadStart={(event) => {
          setFailed(false);
          if (showLoading && autoPlay) setLoading(true);
          onLoadStart?.(event);
        }}
        onPlay={(event) => {
          if (showLoading && event.currentTarget.readyState < 2) {
            setLoading(true);
          } else {
            setLoading(false);
          }
          onPlay?.(event);
        }}
        onLoadedMetadata={(event) => {
          if (event.currentTarget.readyState >= 2) setLoading(false);
          onLoadedMetadata?.(event);
        }}
        onLoadedData={(event) => {
          setLoading(false);
          onLoadedData?.(event);
        }}
        onWaiting={(event) => {
          if (showLoading) setLoading(true);
          onWaiting?.(event);
        }}
        onCanPlay={(event) => {
          setLoading(false);
          onCanPlay?.(event);
        }}
        onCanPlayThrough={(event) => {
          setLoading(false);
          onCanPlayThrough?.(event);
        }}
        onPlaying={(event) => {
          setLoading(false);
          onPlaying?.(event);
        }}
        onProgress={(event) => {
          if (event.currentTarget.readyState >= 2) setLoading(false);
          onProgress?.(event);
        }}
        onTimeUpdate={(event) => {
          setLoading(false);
          onTimeUpdate?.(event);
        }}
        onError={(event) => {
          setLoading(false);
          setFailed(showError);
          onError?.(event);
        }}
      />

      {showLoading && loading && !failed && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center bg-black/35 text-gold backdrop-blur-[1px]">
          <span className="inline-flex items-center gap-2 rounded-full border border-gold/20 bg-black/70 px-4 py-2 text-xs font-bold uppercase tracking-wider">
            <Loader2 className="h-4 w-4 animate-spin" />
            {loadingLabel}
          </span>
        </div>
      )}

      {showError && failed && errorLabel && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-black/70 px-4 text-center text-sm font-semibold text-red-300">
          {errorLabel}
        </div>
      )}
    </div>
  );
});

export default VideoWithLoader;
