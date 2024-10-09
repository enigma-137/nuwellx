'use client'

import React from 'react'
import ReactMarkdown from 'react-markdown'

interface ResultsProps {
  analysis: string
}

export default function Results({ analysis }: ResultsProps) {
  return (
    <div className="mt-8">
      {/* <h2 className="text-xl font-bold mb-4">Analysis Results:</h2> */}
      <div className='text-left space-y-8'>
        <ReactMarkdown
          components={{
            h1: ({node, ...props}) => <h1 className="text-2xl font-bold mt-6 mb-3" {...props} />,
            h2: ({node, ...props}) => <h2 className="text-xl font-semibold mt-4 mb-2" {...props} />,
            h3: ({node, ...props}) => <h3 className="text-lg font-medium mt-3 mb-1" {...props} />,
            p: ({node, ...props}) => <p className="mb-2" {...props} />,
            ul: ({node, ...props}) => <ul className="list-disc pl-5 mb-2" {...props} />,
            ol: ({node, ...props}) => <ol className="list-decimal pl-5 mb-2" {...props} />,
            li: ({node, ...props}) => <li className="mb-1" {...props} />,
          }}
        >
          {analysis}
        </ReactMarkdown>
      </div>
    </div>
  )
}