import { Separator } from "@/components/ui/separator";
import FileUploader from "./components/file-uploader";
import Header from "./components/header";
import FlowView from "./components/flow-view";

export default function HomePage() {
  return (
    <div className="flex min-h-screen">
      <div className="w-xs border-r">
        <FileUploader />
      </div>
      <div className="flex flex-col flex-1">
        <Header />
        <Separator />
        <FlowView />
      </div>
    </div>
  );
}
