"use client";
import { useState } from "react";
import { toast } from "sonner";
import { deletVideo } from "../lib/deleteVideo";
import { useRouter } from "next/navigation";

interface UseVideoActionsProps {
  videoId: string;
  videoUrl: string | null;
  onDeleteSuccess?: () => void;
}

export const useVideoActions = ({
  videoId,
  videoUrl,
  onDeleteSuccess,
}: UseVideoActionsProps) => {
  const router = useRouter();
  const [copied, SetCopied] = useState(false);
  const [isDeleting, SetIsDeleting] = useState(false);
  const handleDownload = () => {
    if (!videoUrl) {
      toast.error("Download Failed!", {
        description: "Video file not available",
      });

      return null;
    }

    const a = document.createElement("a");

    a.href = videoUrl;
    a.download = `video-${videoId}.mp4`;
    a.target = "_blank";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);

    toast.success("Download Started", {
      description: "Video Downloaded",
    });
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(
        `${window.location.origin}/video/${videoId}`
      );

      SetCopied(true);

      setTimeout(() => {
        SetCopied(false);
      }, 2000);

      toast.success("Link Copied", {
        description: "Copied link is copied to you Clipboard.",
      });
    } catch (error) {
      toast.error("Copy Failed", {
        description: "unable to copy link to Clipboard",
      });
    }
  };

  const handleDelete = async () => {
    SetIsDeleting(true);
    try {
      const result = await deletVideo(videoId);
      if (!result) return null;
      if (result?.success) {
        toast("Video Deleted", {
          description: "Video has been deleted Successfully",
        });

        if (onDeleteSuccess) {
          onDeleteSuccess();
        } else {
          router.refresh();
        }
      } else {
        toast.error("Error Occured", {
          description:
            result.error || "Unable to delete the video. Please try again",
        });
      }
    } catch (error) {
      toast.error("Error Occured", {
        description: "Unable to delete the video. Please try again",
      });
    } finally {
      SetIsDeleting(false);
    }
  };

  return {
    handleDownload,
    handleCopyLink,
    handleDelete,
    isDeleting,
    copied,
  };
};
