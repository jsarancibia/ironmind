import ReactMarkdown from 'react-markdown';

interface MessageBubbleProps {
  role: 'user' | 'assistant';
  content: string;
  isLoading?: boolean;
}

export function MessageBubble({ role, content, isLoading }: MessageBubbleProps) {
  const isUser = role === 'user';

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
      <div
        className={`max-w-[80%] rounded-2xl px-5 py-3 ${
          isUser
            ? 'bg-gradient-to-r from-blue-600 to-blue-500 text-white'
            : 'bg-[#12121a] text-gray-100 border border-blue-500/30'
        }`}
      >
        {isLoading && !content ? (
          <div className="flex gap-1">
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : isUser ? (
          <p className="whitespace-pre-wrap leading-relaxed">{content}</p>
        ) : (
          <div className="markdown-content">
            <ReactMarkdown
              components={{
                h1: ({ children }) => <h1 className="text-xl font-bold mb-2 text-blue-300">{children}</h1>,
                h2: ({ children }) => <h2 className="text-lg font-bold mb-2 text-blue-300">{children}</h2>,
                h3: ({ children }) => <h3 className="text-base font-bold mb-1 text-blue-300">{children}</h3>,
                p: ({ children }) => <p className="mb-2 leading-relaxed">{children}</p>,
                ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
                ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
                li: ({ children }) => <li className="ml-2">{children}</li>,
                code: ({ children, className }) => {
                  const isInline = !className;
                  if (isInline) {
                    return <code className="bg-blue-900/50 px-1.5 py-0.5 rounded text-blue-200 text-sm">{children}</code>;
                  }
                  return (
                    <code className={`${className} block bg-[#0d0d12] p-3 rounded-lg overflow-x-auto mb-2 text-sm border border-blue-500/20`}>
                      {children}
                    </code>
                  );
                },
                pre: ({ children }) => <pre className="overflow-x-auto mb-2">{children}</pre>,
                a: ({ href, children }) => <a href={href} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">{children}</a>,
                blockquote: ({ children }) => <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 mb-2">{children}</blockquote>,
                strong: ({ children }) => <strong className="font-semibold text-blue-200">{children}</strong>,
                em: ({ children }) => <em className="italic">{children}</em>,
                hr: () => <hr className="border-blue-500/30 my-3" />,
                table: ({ children }) => <div className="overflow-x-auto mb-2"><table className="min-w-full border border-blue-500/30">{children}</table></div>,
                th: ({ children }) => <th className="border border-blue-500/30 px-2 py-1 bg-blue-900/30">{children}</th>,
                td: ({ children }) => <td className="border border-blue-500/30 px-2 py-1">{children}</td>,
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
