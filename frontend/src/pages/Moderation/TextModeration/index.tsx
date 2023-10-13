import { useMemo} from "react";
import { useSearchParams } from "react-router-dom";

import { PageHeader } from "@/pages/Moderation/components/PageHeader/PageHeader";
import { PageContentLayout } from "@/pages/Moderation/components/PageContentLayout/PageContentLayout";

import { ModPageTab, ModerationType } from "@/interfaces";
import { usePageTitle } from "@/hooks";

import InfoTab from "./components/InfoTab";
import PlaygroundTab from "./components/PlaygroundTab";
import IntegrationTab from "./components/IntegrationTab";


export const TextModeration = () => {
    usePageTitle("TEXT MODERATION | CLOUD");
    
    const [searchParams, _] = useSearchParams();

    const tab  = useMemo(() => {
        const tab = searchParams.get("tab")?.toUpperCase();
        return tab ?? "INFO";
    }, [searchParams]);    

     return (
        <>
        <PageHeader tab={tab as ModPageTab} title="TEXT MODERATION" variant={ModerationType.text}/>
        <PageContentLayout>
            {tab === "INFO" && <InfoTab />}
            {tab === "PLAYGROUND" && <PlaygroundTab />}
            {tab === "INTEGRATION" && <IntegrationTab />}
        </PageContentLayout>
        </>
    );
};