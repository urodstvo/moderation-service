import { useAppDispatch, useAppSelector, usePageTitle } from "@/hooks";
import { RoleEnum } from "@/interfaces";
import { PlanCard } from "@/pages/Pricing/components/PlanCard/PlanCard";
import styles from "@/pages/Pricing/index.module.css"
import { setRole } from "@/store/auth";

export const Pricing = () => {
    usePageTitle("PRICING PLAN | CLOUD")
    const { token, user } = useAppSelector(state => state.auth)
    const dispatch = useAppDispatch()
    const student_disabled = !user?.is_verified || user.role !== RoleEnum.User
    
    const chooseStudent = () => {
        if (token)
            (async () => {
                const response = await fetch("http://localhost:8000/api/role/student",{
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                        Accept: "application/json",
                        Authorization: token
                    },
                })

                if (response.ok) dispatch(setRole({role: RoleEnum.Student}))
            })()
    }

    return (
        <>
        <h1 className="text-center">PRICING</h1>
        <section>
            <div className={styles.plansContainer}>
                <div className={styles.plansContent}>
                    <PlanCard 
                        name="STUDENT" 
                        price="FREE" 
                        offers={["1000 requests per day", "Text Moderation service", "Image Moderation service"]} 
                        terms={["Verified Email"]}
                        disabled={student_disabled}
                        onChoose={chooseStudent}
                    />
                    <PlanCard 
                        name="COMPANY" 
                        price="FREE" 
                        offers={["Unlimited requests per day", "Text Moderation service", "Image Moderation service", "Audio Moderation Service", "Video Moderation service"]} 
                        terms={["Verified Email", "Admin Approval"]}
                        disabled
                    />
                </div>
            </div>
        </section>
        </>
    );
};