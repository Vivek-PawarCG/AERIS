import React from 'react';

interface MarkdownRendererProps {
  content: string;
  isUser?: boolean;
}

/**
 * Clean, lightweight, and robust Markdown renderer tailored for AERIS AI chat responses.
 * Parses headers (###, ####), bold (**text**), lists (1., -, *), and paragraphs.
 */
export const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content, isUser = false }) => {
  if (isUser) {
    return <p className="leading-relaxed text-xs">{content}</p>;
  }

  // Pre-process common scientific chemical formatting like $PM_{2.5}$ or $NO_2$
  const cleanContent = content
    .replace(/\$PM_\{?2\.5\}?\$|\$PM2\.5\$/g, 'PM2.5')
    .replace(/\$PM_\{?10\}?\$|\$PM10\$/g, 'PM10')
    .replace(/\$NO_\{?2\}?\$|\$NO2\$/g, 'NO2')
    .replace(/\$CO_\{?2\}?e?\$|\$CO2e?\$/g, 'CO2e');

  const lines = cleanContent.split('\n');
  const elements: React.ReactNode[] = [];
  let currentList: { type: 'ul' | 'ol'; items: string[] } | null = null;

  const flushList = () => {
    if (!currentList) return;
    if (currentList.type === 'ul') {
      elements.push(
        <ul key={`ul-${elements.length}`} className="space-y-1.5 my-2 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2 text-aeris-body leading-relaxed text-xs">
              <span className="w-1.5 h-1.5 rounded-full bg-aeris-accent shrink-0 mt-1.5" />
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ul>
      );
    } else {
      elements.push(
        <ol key={`ol-${elements.length}`} className="space-y-2 my-2.5 pl-1">
          {currentList.items.map((item, idx) => (
            <li key={idx} className="flex items-start gap-2.5 text-aeris-body leading-relaxed text-xs">
              <span className="w-4 h-4 rounded-full bg-aeris-accent/15 text-aeris-accent text-[10px] font-mono font-bold flex items-center justify-center shrink-0 mt-0.5">
                {idx + 1}
              </span>
              <span>{renderInline(item)}</span>
            </li>
          ))}
        </ol>
      );
    }
    currentList = null;
  };

  const renderInline = (text: string): React.ReactNode => {
    // Parse bold text **bold**
    const parts = text.split(/(\*\*.*?\*\*)/g);
    return parts.map((part, i) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const inner = part.slice(2, -2);
        return (
          <strong key={i} className="font-semibold text-aeris-heading">
            {inner}
          </strong>
        );
      }
      return part;
    });
  };

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const line = rawLine.trim();

    if (!line) {
      flushList();
      continue;
    }

    // Header 3: ### Title
    if (line.startsWith('### ')) {
      flushList();
      const title = line.replace(/^###\s+/, '');
      elements.push(
        <h3 key={`h3-${i}`} className="text-sm font-bold text-aeris-heading mt-3 mb-1.5 first:mt-0 flex items-center gap-2">
          <span className="w-1 h-3.5 rounded-full bg-aeris-accent" />
          <span>{renderInline(title)}</span>
        </h3>
      );
      continue;
    }

    // Header 4: #### Subtitle
    if (line.startsWith('#### ')) {
      flushList();
      const sub = line.replace(/^####\s+/, '');
      elements.push(
        <h4 key={`h4-${i}`} className="text-xs font-semibold text-aeris-heading uppercase tracking-wider text-aeris-accent mt-3 mb-1">
          {renderInline(sub)}
        </h4>
      );
      continue;
    }

    // Numbered list item: 1. Item or 1) Item
    const numMatch = line.match(/^(\d+)[\.\)]\s+(.*)/);
    if (numMatch) {
      if (!currentList || currentList.type !== 'ol') {
        flushList();
        currentList = { type: 'ol', items: [] };
      }
      currentList.items.push(numMatch[2]);
      continue;
    }

    // Bullet list item: - Item or * Item
    const bulletMatch = line.match(/^[-*]\s+(.*)/);
    if (bulletMatch) {
      if (!currentList || currentList.type !== 'ul') {
        flushList();
        currentList = { type: 'ul', items: [] };
      }
      currentList.items.push(bulletMatch[1]);
      continue;
    }

    // Standard paragraph
    flushList();
    elements.push(
      <p key={`p-${i}`} className="text-aeris-body leading-relaxed text-xs my-1.5">
        {renderInline(line)}
      </p>
    );
  }

  flushList();

  return <div className="space-y-1">{elements}</div>;
};
