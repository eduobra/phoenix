import ReactMarkdown, { Components } from "react-markdown";

import remarkGfm from "remark-gfm";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";
import { ReactNode, HTMLAttributes } from "react";
import "highlight.js/styles/github.css";
interface CodeBlockProps extends HTMLAttributes<HTMLElement> {
  inline?: boolean;
  className?: string;
  children?: ReactNode;
}

const CodeBlock = (props: CodeBlockProps) => {
  const { children, className, inline, ...rest } = props;
  const match = /language-(\w+)/.exec(className || "");

  const codeContent = Array.isArray(children)
    ? children.map((child) => (typeof child === "string" ? child : String(child))).join("")
    : typeof children === "string"
      ? children
      : String(children);

  if (!inline) {
    return (
      <SyntaxHighlighter
        {...rest}
        PreTag="div"
        language={match ? match[1] : "text"} // ✅ kahit walang language, default "text"
        style={dracula}
      >
        {codeContent.replace(/\n$/, "")}
      </SyntaxHighlighter>
    );
  }

  return (
    <code {...rest} className={className}>
      {codeContent}
    </code>
  );
};
const components: Partial<Components> = {
  code: CodeBlock,
  pre: ({ children }) => <>{children}</>,

  ol: ({ children, ...props }) => (
    <ol className="ml-4 text-sm list-decimal list-outside" {...props}>
      {children}
    </ol>
  ),
  li: ({ children, ...props }) => (
    <li className="py-1 text-sm" {...props}>
      {children}
    </li>
  ),
  ul: ({ children, ...props }) => (
    <ul className="ml-4 text-sm list-disc list-outside" {...props}>
      {children}
    </ul>
  ),
  strong: ({ children, ...props }) => (
    <span className="text-sm font-semibold" {...props}>
      {children}
    </span>
  ),
  a: ({ children, ...props }) => (
    <a className="text-sm text-blue-500 hover:underline" target="_blank" rel="noreferrer" {...props}>
      {children}
    </a>
  ),

  // Mas maliit na headings
  h1: ({ children, ...props }) => (
    <h1 className="mt-6 mb-2 text-2xl font-semibold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-6 mb-2 text-xl font-semibold" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-6 mb-2 text-lg font-semibold" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mt-6 mb-2 text-base font-semibold" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="mt-6 mb-2 text-sm font-semibold" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="mt-6 mb-2 text-xs font-semibold" {...props}>
      {children}
    </h6>
  ),

  table: ({ children, ...props }) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full text-xs border border-gray-300" {...props}>
        {children}
      </table>
    </div>
  ),
  thead: ({ children, ...props }) => (
    <thead className="text-xs bg-gray-100" {...props}>
      {children}
    </thead>
  ),
  tbody: ({ children, ...props }) => (
    <tbody className="text-xs divide-y divide-gray-200" {...props}>
      {children}
    </tbody>
  ),
  tr: ({ children, ...props }) => (
    <tr className="border-b last:border-none" {...props}>
      {children}
    </tr>
  ),
  th: ({ children, ...props }) => (
    <th className="px-3 py-1 text-xs font-semibold text-left border border-gray-300" {...props}>
      {children}
    </th>
  ),
  td: ({ children, ...props }) => (
    <td className="px-3 py-1 text-xs border border-gray-300" {...props}>
      {children}
    </td>
  ),
};

const remarkPlugins = [remarkGfm];
const Markdown = ({ content }: { content: string }) => {
  return (
    <ReactMarkdown components={components} remarkPlugins={remarkPlugins}>
      {content}
    </ReactMarkdown>
  );
};

export default Markdown;
