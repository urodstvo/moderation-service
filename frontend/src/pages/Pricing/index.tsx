import { useChangeRoleMutation } from "@/api/moderationAPI";
import { useAppDispatch, useAppSelector, usePageTitle } from "@/hooks";
import { RoleEnum } from "@/interfaces";
import { PlanCard } from "@/pages/Pricing/components/PlanCard/PlanCard";
import styles from "@/pages/Pricing/index.module.css";
import { setRole } from "@/store/auth";
import { useEffect } from "react";

export const Pricing = () => {
  usePageTitle("PRICING PLAN | CLOUD");

  const [changeRole, { isLoading, isSuccess }] = useChangeRoleMutation();

  const { user } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isSuccess) dispatch(setRole({ role: RoleEnum.Student }));
  }, [isSuccess]);

  const choosePlan = async (role: RoleEnum) => {
    await changeRole(role);
  };

  return (
    <>
      <h1 className="text-center">PRICING</h1>
      <section>
        <div className={styles.plansContainer}>
          <div className={styles.plansContent}>
            <PlanCard
              name="STUDENT"
              price="FREE"
              offers={[
                "1000 requests per day",
                "Text Moderation service",
                "Image Moderation service",
              ]}
              terms={["Verified Email"]}
              disabled={
                !user?.is_verified || user.role !== RoleEnum.User || isLoading
              }
              onChoose={() => choosePlan(RoleEnum.Student)}
            />
            <PlanCard
              name="COMPANY"
              price="FREE"
              offers={[
                "Unlimited requests per day",
                "Text Moderation service",
                "Image Moderation service",
                "Audio Moderation Service",
                "Video Moderation service",
              ]}
              terms={["Verified Email", "Admin Approval"]}
              disabled
            />
          </div>
        </div>
      </section>
    </>
  );
};
