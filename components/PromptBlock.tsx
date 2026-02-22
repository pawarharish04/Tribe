import React from 'react';

type PromptBlockProps = {
    question: string;
    answer: string;
};

export default function PromptBlock({ question, answer }: PromptBlockProps) {
    return (
        <div className="prompt-block">
            <div className="prompt-q">{question}</div>
            <div className="prompt-a">{answer}</div>
        </div>
    );
}
