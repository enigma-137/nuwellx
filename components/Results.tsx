'use client'

import React from 'react'
import ReatMarkDown from 'react-markdown'

interface ResultsProps {
  analysis: string
}

export default function Results({ analysis }: ResultsProps) {
  return (
    <div className="mt-8 p-4   rounded border ">
      <h2 className="text-xl font-bold mb-4">Analysis Results:</h2>
      <pre className="whitespace-pre-wrap"><ReatMarkDown>{analysis}</ReatMarkDown></pre>
    </div>
  )
}