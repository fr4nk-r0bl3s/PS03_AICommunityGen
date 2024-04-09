import React from 'react';
import ReactMarkdown from 'react-markdown';

function ContentGenerator({ generatedContent }) {
    const renderContent = () => {
        if (typeof generatedContent === 'string') {
            return (
                <ReactMarkdown
                    components={{
                        h3: ({ node, ...props }) => (
                            <h3 className="text-4xl font-bold mb-4 text-sky-400" {...props}>
                                {props.children}
                            </h3>
                        ),
                        p: ({ node, ...props }) => (
                            <p className="mb-2 text-slate-500" {...props}>
                                {props.children}
                            </p>
                        ),
                        ul: ({ node, ...props }) => (
                            <ul className="list-disc pl-5 text-slate-500" {...props}>
                                {props.children}
                            </ul>
                        ),
                        ol: ({ node, ...props }) => (
                            <ol className="list-decimal pl-5 text-slate-500" {...props}>
                                {props.children}
                            </ol>
                        ),
                        li: ({ node, ...props }) => (
                            <li className="mb-2 text-slate-500" {...props}>
                                {props.children}
                            </li>
                        ),
                    }}
                >
                    {generatedContent}
                </ReactMarkdown>
            );
        } else if (Array.isArray(generatedContent)) {
            return generatedContent.map((item, index) => (
                <div key={index}>
                    {item.type === 'text' && (
                        <ReactMarkdown
                            components={{
                                h3: ({ node, ...props }) => (
                                    <h3 className="text-4xl font-bold mb-4 text-sky-400" {...props}>
                                        {props.children}
                                    </h3>
                                ),
                                p: ({ node, ...props }) => (
                                    <p className="mb-2 text-slate-500" {...props}>
                                        {props.children}
                                    </p>
                                ),
                                ul: ({ node, ...props }) => (
                                    <ul className="list-disc pl-5 text-slate-500" {...props}>
                                        {props.children}
                                    </ul>
                                ),
                                ol: ({ node, ...props }) => (
                                    <ol className="list-decimal pl-5 text-slate-500" {...props}>
                                        {props.children}
                                    </ol>
                                ),
                                li: ({ node, ...props }) => (
                                    <li className="mb-2 text-slate-500" {...props}>
                                        {props.children}
                                    </li>
                                ),
                            }}
                        >
                            {item.text}
                        </ReactMarkdown>
                    )}
                </div>
            ));
        } else {
            return null;
        }
    };

    return <div>{renderContent()}</div>;
}

export default ContentGenerator;