import { useCallback, useState } from "react";
import { TrashIcon, X } from "lucide-react";
import {
  FileUpload,
  FileUploadItem,
  FileUploadItemDelete,
  FileUploadItemMetadata,
  FileUploadItemPreview,
  FileUploadList,
  FileUploadTrigger,
  FileUploadItemProgress,
} from "@/components/ui/file-upload";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAsyncAnalysisMutation } from "@/api/queries";
import { useActiveRequestId } from "@/provider";

// const onFileReject = useCallback((file: File, message: string) => {
//   toast(message, {
//     description: `"${file.name.length > 20 ? `${file.name.slice(0, 20)}...` : file.name}" has been rejected`,
//   });
// }, []);

const onUpload = async (
  files: File[],
  {
    onProgress,
    onSuccess,
    onError,
  }: {
    onProgress: (file: File, progress: number) => void;
    onSuccess: (file: File) => void;
    onError: (file: File, error: Error) => void;
  }
) => {
  try {
    const uploadPromises = files.map(async (file) => {
      try {
        const totalChunks = 10;
        let uploadedChunks = 0;
        for (let i = 0; i < totalChunks; i++) {
          await new Promise((resolve) => setTimeout(resolve, Math.random() * 200 + 100));
          uploadedChunks++;
          const progress = (uploadedChunks / totalChunks) * 100;
          onProgress(file, progress);
        }
        await new Promise((resolve) => setTimeout(resolve, 500));
        onSuccess(file);
      } catch (error) {
        onError(file, error instanceof Error ? error : new Error("Upload failed"));
      }
    });
    await Promise.all(uploadPromises);
  } catch (error) {
    console.error("Unexpected error during upload:", error);
  }
};

const accept = ["image/png", "image/jpg", "image/jpeg", "video/mp4", "text/plain", "audio/mp3"].join(",");

export default function FileUploader() {
  const [files, setFiles] = useState<File[]>([]);

  const { setRequestId } = useActiveRequestId();
  const { mutateAsync } = useAsyncAnalysisMutation();

  const handleDoRequest = useCallback(async () => {
    if (files.length > 0) {
      try {
        const data = await mutateAsync({ files });
        setRequestId(data.request_id);
      } catch (e) {
        console.error(e);
      }
    }
  }, [files, mutateAsync, setRequestId]);

  return (
    <div className="flex flex-col gap-2 p-2 justify-between">
      <FileUpload
        multiple
        className="size-full"
        value={files}
        onValueChange={setFiles}
        onUpload={onUpload}
        accept={accept}
        // onFileReject={onFileReject}
        maxSize={100 * 1024 * 1024}
      >
        <ScrollArea className="h-[calc(100dvh_-_132px)]">
          <FileUploadList className="w-full flex-wrap h-full" orientation="horizontal">
            {files.map((file, index) => (
              <FileUploadItem key={index} value={file} className="p-0">
                <FileUploadItemPreview className="size-20 [&>svg]:size-12">
                  <FileUploadItemProgress variant="circular" size={40} />
                </FileUploadItemPreview>
                <FileUploadItemMetadata className="sr-only" />
                <FileUploadItemDelete asChild onClick={(e) => e.stopPropagation()}>
                  <Button variant="secondary" size="icon" className="-top-1 -right-1 absolute size-5 rounded-full">
                    <X className="size-3" />
                  </Button>
                </FileUploadItemDelete>
              </FileUploadItem>
            ))}
          </FileUploadList>
        </ScrollArea>
        <div className="flex gap-2">
          <FileUploadTrigger className="flex-1" asChild>
            <Button variant="secondary">Добавить файлы</Button>
          </FileUploadTrigger>
          <Button onClick={() => setFiles([])} disabled={files.length === 0} size="icon" variant="secondary">
            <TrashIcon />
          </Button>
        </div>
      </FileUpload>
      <div>
        <Button
          disabled={files.length === 0}
          className="w-full"
          variant={files.length === 0 ? "outline" : "default"}
          onClick={handleDoRequest}
        >
          Сделать запрос
        </Button>
      </div>
      <div className="flex items-center justify-between text-sm">
        <span>Загружено</span>
        <span>{files.reduce((acc, file) => acc + file.size / 1024 / 1024, 0).toFixed(1)}/100 Мб</span>
      </div>
    </div>
  );
}
