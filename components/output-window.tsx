interface OutputWindowProps {
  output: string
  error: string | null
}

export default function OutputWindow({ output, error }: OutputWindowProps) {
  if (error) {
    return <div className="text-red-500 whitespace-pre-wrap">{error}</div>
  }

  if (!output) {
    return <div className="text-muted-foreground italic">Run your code to see output here</div>
  }

  return <div className="whitespace-pre-wrap">{output}</div>
}

