import styles from "@/pages/Docs/index.module.css"
import { memo } from "react";

const index = memo(() => {
    document.title = "DOCS PAGE | CLOUD"
    return (
        <>
        <div className={styles.sidebarContainer}>
            <div className={styles.sidebarContent}>
                <div className={styles.sidebarTab}>Get started</div>
                <div className={styles.sidebarTab}>REST API</div>
                <div className={styles.sidebarTab}>gRPC API</div>
                <div className={styles.sidebarListContainer}>
                    <div className={styles.sidebarTab} onClick={(e) => {(e.target as HTMLDivElement).closest('.' + styles.sidebarListContainer)?.classList.toggle(styles.opened)}}>Endpoints</div>
                    <div className={styles.sidebarListContent}>                        
                        <div className={styles.sidebarTab}>Endpoint</div>
                        <div className={styles.sidebarTab}>Endpoint</div>
                        <div className={styles.sidebarTab}>Endpoint</div>
                    </div>
                </div>
                <div className={styles.sidebarTab}>TAB</div>
            </div>
        </div>

        <div className={styles.docsContainer}>
            <div className={styles.docsContent}>
                <h1>GET STARTED</h1>
                <section>
                    <p>Lorem ipsum dolor sit amet consectetur. Consectetur at eget ut vulputate aliquam enim nullam sed feugiat. Volutpat amet enim duis sed. Lacinia auctor morbi commodo magna. Laoreet auctor aliquet eros et est gravida ipsum. Blandit dui turpis id gravida etiam pharetra at.</p>
                    <p>Dictum vestibulum vitae massa lacus. Feugiat risus mauris lectus vitae sed lobortis risus. Dignissim tristique nunc scelerisque cursus tristique nulla imperdiet ut venenatis. Volutpat egestas mauris lorem lectus mi nisi nunc ut maecenas. Tristique vulputate vitae libero nunc feugiat eget dignissim. </p>
                    <p>Turpis sit nascetur suspendisse a diam eget dolor felis. Blandit odio lacus lorem a. Turpis amet quis sed est leo vulputate rhoncus adipiscing. Morbi scelerisque aliquam dignissim ac pretium non varius magnis.</p>
                    <p>Quis enim convallis viverra arcu odio viverra interdum fusce morbi. A ut posuere semper id mi. A et nulla sodales massa scelerisque. Feugiat ut dui nibh posuere laoreet scelerisque egestas urna. Non fermentum arcu in massa. </p>
                    <p>Posuere feugiat ipsum sagittis sit semper ullamcorper. Dolor felis urna feugiat maecenas suscipit enim turpis maecenas at. Maecenas at rhoncus maecenas pellentesque. Neque eleifend morbi in dignissim faucibus. Eget massa proin est mauris ut sed etiam eget cras. Sapien lectus platea viverra montes ac senectus augue. Sagittis vitae rhoncus non vestibulum.</p> 
                </section>
            </div>
        </div>
        </>
    );
});

export default index;