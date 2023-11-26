import { useChangeRoleMutation } from "@/api/moderationAPI";
import { useAppDispatch, useAppSelector, usePageTitle } from "@/hooks";
import { RoleEnum } from "@/interfaces";
import { PlanCard } from "@/pages/Pricing/components/PlanCard/PlanCard";
import styles from "@/pages/Pricing/index.module.css";
import { setRole } from "@/store/auth";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";

export const Pricing = () => {
  const { t } = useTranslation();
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
      <h1 className="text-center">{t("pricing.title")}</h1>
      <section>
        <div className={styles.plansContainer}>
          <div className={styles.plansContent}>
            <PlanCard
              name={t("pricing.studentCard.title")}
              price="FREE"
              offers={[
                t("pricing.studentCard.offer1"),
                t("pricing.studentCard.offer2"),
                t("pricing.studentCard.offer3"),
              ]}
              terms={[t("pricing.studentCard.term1")]}
              disabled={
                !user?.is_verified || user.role !== RoleEnum.User || isLoading
              }
              onChoose={() => choosePlan(RoleEnum.Student)}
            />
            <PlanCard
              name={t("pricing.companyCard.title")}
              price="FREE"
              offers={[
                t("pricing.companyCard.offer1"),
                t("pricing.companyCard.offer2"),
                t("pricing.companyCard.offer3"),
                t("pricing.companyCard.offer4"),
                t("pricing.companyCard.offer5"),
              ]}
              terms={[
                t("pricing.companyCard.term1"),
                t("pricing.companyCard.term2"),
              ]}
              disabled
            />
          </div>
        </div>
      </section>
    </>
  );
};
