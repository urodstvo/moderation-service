import { useEffect, useState } from "react";
import ReactJson from "react-json-view";
import { useAnalysisContext } from "../provider";
import { Spinner } from "../icons/spinner";
import { TEST_HOST } from "../config";

export const ResultSection = () => {
  const [data, setData] = useState({});
  const context = useAnalysisContext();

  useEffect(() => {
    if (context.isLoading) setData({});
  }, [context.isLoading]);

  useEffect(() => {
    const source = new EventSource(`${TEST_HOST}/sse`);
    source.onmessage = (event) => {
      setData(JSON.parse(event.data));
    };
    return () => source.close();
  }, []);

  return (
    <section>
      <h3>Результат, полученный на вебхук</h3>
      <p>В этой секции представлен ответ, полученный через тестовый веб-хук.</p>
      <p>
        Из-за того, что веб-хук это "ручка", принимающая POST метод, для тестовой страницы дополнительно развернута SSE
        ручка, отдающая результат в интерфейс.
      </p>
      <div>
        {JSON.stringify(data) === "{}" ? (
          <Spinner />
        ) : (
          <ReactJson src={data} displayDataTypes={false} enableClipboard={false} />
        )}
      </div>
    </section>
  );
};
