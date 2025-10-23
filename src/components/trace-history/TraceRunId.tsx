import { useTrace } from "@/contexts/TraceContext";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { useTraceRunById } from "@/query";
import { TraceNode } from "@/types/trace";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../ui/accordion";
import { DefaultResponse, OutputsMessage } from "@/types/run";
import Skeleton from "../ui/skeleton";

// function isArrayOfObjects(arr: unknown): arr is Record<string, unknown>[] {
//   return Array.isArray(arr) && arr.every((item) => typeof item === "object" && item !== null);
// }

function isArrayOfStrings(arr: unknown): arr is string[] {
  return Array.isArray(arr) && arr.every((item) => typeof item === "string");
}

const ChainInputContent = ({ chainData }: { chainData: string[] }) => {
  return (
    <Accordion type="multiple" className="w-full">
      {chainData.map((msg, i) => {
        return (
          <AccordionItem key={msg + i} value={`item-${i}`} className="[&[data-state=open]_pre]:hidden">
            <AccordionTrigger className="justify-start after:hidden">
              {i}
              <pre className="ml-2 text-xs break-words whitespace-pre-wrap text-muted-foreground">
                {JSON.stringify(JSON.parse(msg))}
              </pre>
            </AccordionTrigger>
            <AccordionContent className="flex flex-col gap-4 text-balance">
              <p className="text-xs break-words whitespace-pre-wrap text-muted-foreground">
                {JSON.stringify(JSON.parse(msg))}
              </p>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
};
const ChainOutputContent = ({ output }: { output: OutputsMessage[] }) => {
  return output.map((msg, i) => {
    return (
      <Card key={i} className="shadow-none">
        <CardHeader className="pb-0">
          <CardTitle className="text-sm font-semibold uppercase">{msg.type}</CardTitle>
        </CardHeader>
        <CardContent>{msg.content}</CardContent>
      </Card>
    );
  });
};

const DisplayContentInput = ({ trace, data }: { trace: TraceNode; data: DefaultResponse }) => {
  switch (trace.run_type) {
    case "chain":
      if (trace.name !== "RunnableSequence") {
        return isArrayOfStrings(data?.inputs?.messages) ? (
          <ChainInputContent chainData={data.inputs.messages} />
        ) : (
          <ChainOutputContent output={data.inputs.messages} />
        );
      }

      return null;

    case "llm":
      return <div>LLM content here</div>;

    case "tool":
      return <div>Tool content here</div>;

    case "retriever":
      return <div>Retriever content here</div>;

    default:
      return null;
  }
};

const DisplayContentOutput = ({ trace, data }: { trace: TraceNode; data: DefaultResponse }) => {
  switch (trace.run_type) {
    case "chain":
      if (trace.name === "RunnableSequence") {
        return (
          <Card className="shadow-none">
            <CardHeader className="pb-0">
              <CardTitle className="text-sm font-semibold uppercase">{data.outputs.output.type}</CardTitle>
            </CardHeader>
            <CardContent>{data.outputs.output.content}</CardContent>
          </Card>
        );
      }

      return null;

    case "llm":
      return <div>LLM content here</div>;

    case "tool":
      return <div>Tool content here</div>;

    case "retriever":
      return <div>Retriever content here</div>;

    default:
      return null;
  }
};

const TraceRunIdContent = ({ trace }: { trace: TraceNode; traceId: string }) => {
  const { data, isLoading } = useTraceRunById(trace?.run_id);
  if (isLoading) {
    return (
      <div className="flex flex-col gap-12">
        <div className="space-y-2">
          <Skeleton className="h-10 rounded-lg w-30" />
          <Skeleton className="w-full rounded-lg h-60" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-10 rounded-lg w-30" />
          <Skeleton className="w-full rounded-lg h-60" />
        </div>
      </div>
    );
  }

  if (!data) {
    return <>asd</>;
  }

  return (
    <>
      <Card className="border shadow-none ">
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Input</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 ">
          <DisplayContentInput trace={trace} data={data} />
        </CardContent>
      </Card>

      <Card className="border shadow-none">
        <CardHeader className="flex flex-row items-center justify-between py-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground">Output</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <DisplayContentOutput trace={trace} data={data} />
        </CardContent>
      </Card>
    </>
  );
};

const TraceRunId = ({ traceId }: { traceId: string }) => {
  const trace = useTrace((state) => state.trace);

  if (!trace) return null;

  return <TraceRunIdContent trace={trace} traceId={traceId} />;
};

export default TraceRunId;
