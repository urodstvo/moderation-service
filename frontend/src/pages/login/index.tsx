import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import LoginForm from "./components/login-form";
import RegisterForm from "./components/register-form";

export default function LoginPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="flex min-w-md max-w-lg flex-col gap-6">
        <Tabs defaultValue="login">
          <TabsList>
            <TabsTrigger value="login">Авторизация</TabsTrigger>
            <TabsTrigger value="register">Регистрация</TabsTrigger>
          </TabsList>
          <Card className="w-full">
            <CardHeader>
              <h3 className="scroll-m-20 text-2xl font-semibold tracking-tight">
                <TabsContent value="login">Авторизация</TabsContent>
                <TabsContent value="register">Регистрация</TabsContent>
              </h3>
            </CardHeader>
            <CardContent>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </CardContent>
          </Card>
        </Tabs>
      </div>
    </main>
  );
}
