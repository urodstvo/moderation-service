import { generatePath } from "react-router";

interface RouteProps {
  path: string;
  component: React.ReactNode;
}

export class Route implements RouteProps {
  path: string;
  component: React.ReactNode;

  constructor(props: RouteProps) {
    this.path = props.path;
    this.component = props.component;
  }

  getPath(params?: Record<string, string | number>): string {
    return generatePath(this.path, params);
  }
}
