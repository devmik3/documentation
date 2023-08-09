import { getCompletion } from './gpt'
import { CLIENT_METHODS } from './prompts/client-context.constants'

export async function getResponseFromPrompt(query: string): Promise<string[]> {
  const prompt = `Which category of operations are best suited for this query: "${query}". Respond in a valid JSON of type {categories:string[]}\n ### CATEGORIES: ${Object.keys(
    CLIENT_METHODS
  )}`
  console.log({ query })
  console.log({ prompt1: prompt })
  const completionResponse = await getCompletion({ role: 'user', content: prompt })
  if (completionResponse.success) {
    console.log({ completion: completionResponse.completion })
    return (JSON.parse(completionResponse.completion) as { categories: string[] }).categories
  } else {
    console.log({ completionFailure: completionResponse })
    return []
  }
}

export async function getResponseFromPrompt2(query: string, categories: string[]): Promise<string[]> {
  const methodNames = categories.reduce(
    (contextMethods, category) => contextMethods.concat(CLIENT_METHODS[category as keyof typeof CLIENT_METHODS]),
    [] as string[]
  )

  const props = { blockName: '', processedDependencies: [], content: '' }
  for (const methodName of methodNames) {
    props.blockName = methodName
    await processFileContent(props)
  }
  const prompt = `Which of the method(s) are best suited to respond for this query - "${query}". Respond in a valid JSON of type {methods:string[]}\n ### Methods: ${props.content}`
  console.log({ prompt })
  const completionResponse = await getCompletion({ role: 'user', content: prompt })
  if (completionResponse.success) {
    console.log({ completion: completionResponse.completion })
    return { methods: (JSON.parse(completionResponse.completion) as { methods: string[] })?.methods || [] }.methods
  } else {
    console.log({ completionFailure: completionResponse })
    return []
  }
}

export async function getResponseFromPrompt3(query: string, methods: string[]): Promise<string[]> {
  const props = { blockName: '', processedDependencies: [], content: '' }
  for (const method of methods) {
    props.blockName = method
    await processFileContent(props)
  }

  console.log(props.content)

  const prompt = `Using the provided types, write valid javascript code that answers the following query - "${query}". All the methods are async and are available on an object called client. Start with const client = new Client({}). Do not explain your code`
  console.log({ prompt })
  const completionResponse = await getCompletion([
    { role: 'system', content: props.content },
    { role: 'system', content: prompt },
  ])
  if (completionResponse.success) {
    console.log({ completion: completionResponse.completion })
    return [completionResponse.completion.replaceAll('```javascript', '').replaceAll('```', '')]
  } else {
    console.log({ completionFailure: completionResponse })
    return ['']
  }
}

async function processFileContent(props: { blockName: string; processedDependencies: string[]; content: string }) {
  const fileName = props.blockName + '.ts'
  const fileContent = await fetch(`https://cdn.botpress.dev/api/types/v1/${fileName}`).then((res) => res.text())
  const { dependencyFileNames, contentWithoutImports } = getContentWithoutImportsOrExports(fileContent)
  props.processedDependencies.push(props.blockName)

  props.content += contentWithoutImports + '\n'
  for (const dependency of dependencyFileNames) {
    if (props.processedDependencies.includes(dependency)) {
      continue
    }
    props.blockName = dependency
    await processFileContent(props)
  }
}

function getContentWithoutImportsOrExports(content: string): {
  dependencyFileNames: string[]
  contentWithoutImports: string
} {
  const dependencyFileNames: string[] = []
  let contentWithoutImports: string = ''
  for (const line of content.split('\n')) {
    if (line.startsWith('import')) {
      const dependencyFileName = line.split('from')[1].split("'")[1].replace('./', '')
      dependencyFileNames.push(dependencyFileName)
    } else {
      contentWithoutImports += line.replaceAll('export', '') + '\n'
    }
  }
  return { dependencyFileNames, contentWithoutImports }
}

export async function executePromptChain(
  query: string,
  prompts: Array<(...args: any[]) => Promise<string[]>>
): Promise<string[]> {
  let currentArgs: [any, any] = [query, undefined]

  for (let i = 0; i < prompts.length; i++) {
    const prompt = prompts[i]
    const response = await prompt(...currentArgs)
    currentArgs = [query, response as any]
  }

  return currentArgs[1]
}
