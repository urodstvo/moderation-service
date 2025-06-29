import { ResultSection } from "./sections/result";
import { IntroductionSection } from "./sections/introduction";
import { AuthSection } from "./sections/auth";
import { WebhookSection } from "./sections/webhook";
import { DemoSection } from "./sections/demo";
import { Footer } from "./footer";
import { Provider } from "./provider";

export const App = () => {
  return (
    <Provider>
      <div className="app-container">
        <main>
          <IntroductionSection />
          <AuthSection />
          <WebhookSection />
          <DemoSection />
          <ResultSection />
        </main>
        <Footer />
      </div>
    </Provider>
  );
};
