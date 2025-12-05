import { Link } from "react-router-dom";
import { routes } from "@/router";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  return (
    <main className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold">404 - Страница не найдена</h1>
        <p className="mt-4 text-lg">К сожалению, запрашиваемая страница не существует.</p>
        <Button asChild className="mt-5">
          <Link to={routes.home.getPath()} replace>
            Вернуться на главную
          </Link>
        </Button>
      </div>
    </main>
  );
}
