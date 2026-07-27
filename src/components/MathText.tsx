import { Fragment } from 'react';
import katex from 'katex';

const delimitedMath = /(\$\$[\s\S]+?\$\$|\$[^$\n]+?\$)/g;

function Formula({ formula }: { formula: string }) {
  try {
    const html = katex.renderToString(formula, { throwOnError: true, strict: 'ignore' });
    return <span dangerouslySetInnerHTML={{ __html: html }}/>;
  } catch {
    return <code className="math-fallback">{formula}</code>;
  }
}

export function MathText({ children }: { children: string }) {
  const parts = children.split(delimitedMath);
  return <>{parts.map((part, index) => {
    const isBlock = part.startsWith('$$') && part.endsWith('$$');
    const isInline = !isBlock && part.startsWith('$') && part.endsWith('$');
    if (!isBlock && !isInline) return <Fragment key={index}>{part}</Fragment>;
    const formula = part.slice(isBlock ? 2 : 1, isBlock ? -2 : -1).trim();
    return <span className={isBlock ? 'math-block' : 'math-inline'} key={index}>
      <Formula formula={formula}/>
    </span>;
  })}</>;
}
