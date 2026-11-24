import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MarkdownRenderer } from '../components/MarkdownRenderer';

describe('MarkdownRenderer Component', () => {
  it('renders headers, bold elements, and lists without raw markdown syntax', () => {
    const markdown = `
### Strategy Headline
This is a **critical notice** for the family.
#### Action Steps
1. Seal window frames
2. Run air cleaner
- Wear an N95 mask
    `.trim();

    const { container } = render(<MarkdownRenderer content={markdown} />);

    // Header 3
    const h3 = screen.getByRole('heading', { level: 3 });
    expect(h3).toHaveTextContent('Strategy Headline');
    expect(h3.textContent).not.toContain('###');

    // Bold text
    const strong = container.querySelector('strong');
    expect(strong).toBeInTheDocument();
    expect(strong).toHaveTextContent('critical notice');
    expect(strong?.textContent).not.toContain('**');

    // Header 4
    const h4 = screen.getByRole('heading', { level: 4 });
    expect(h4).toHaveTextContent('Action Steps');
    expect(h4.textContent).not.toContain('####');

    // Lists
    const listItems = screen.getAllByRole('listitem');
    expect(listItems.length).toBe(3);
    expect(listItems[0]).toHaveTextContent('Seal window frames');
    expect(listItems[2]).toHaveTextContent('Wear an N95 mask');
  });

  it('renders user messages as simple plain paragraphs', () => {
    render(<MarkdownRenderer content="Can I take my baby out in a stroller today?" isUser={true} />);
    expect(screen.getByText('Can I take my baby out in a stroller today?')).toBeInTheDocument();
  });
});
