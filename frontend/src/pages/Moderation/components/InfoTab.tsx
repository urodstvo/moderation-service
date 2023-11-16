import { InfoCard } from "@/pages/Moderation/components/InfoCard/InfoCard";
import { ReactNode } from "react";

const InfoTab = ({
  cards,
}: {
  cards: { icon: ReactNode; title: string; description: string }[];
}) => {
  return (
    <>
      {cards.map((el, ind) => (
        <InfoCard key={ind} {...el} />
      ))}
    </>
  );
};

export default InfoTab;
