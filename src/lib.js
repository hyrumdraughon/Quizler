import fs from 'fs'

export const chooseRandom = (arr=[], numItems) => {
  if (arr.length === 0 || arr.length === 1) {
    return arr
  }
  if (numItems < 1 || numItems > arr.length) {
    numItems = Math.floor(Math.random() * (arr.length + 1))
  }

  let result = []
  let unchosen = [...arr]
  for (let i=0; i<numItems; i++) {
    let randomIndex = Math.floor(Math.random() * arr.length)
    result.push(unchosen[randomIndex])
    unchosen.splice(randomIndex, 1)
  }
  return result
}

export const createPrompt = ({numQuestions=1, numChoices=2} = {}) => {
  let prompt = []

  for (let i=1; i<=numQuestions; i++) {
    //get question object data and add it
    let question = {
      type: 'input',
      name: `question-${(i)}`,
      message: `Enter question ${(i)}`
    }
    prompt.push(question)

    for (let j=1; j<=numChoices; j++) {
      //get choice object data and add it at arr[i+j]
      let choice = {
        type: 'input',
        name: `question-${(i)}-choice-${(j)}`,
        message: `Enter answer choice ${(j)} for question ${(i)}`
      }
      prompt.push(choice)
    }
  }
  return prompt
}

export const createQuestions = (obj = {}) => {
  let questions = []

  let keys = Object.keys(obj)
  let questionKeys = keys.filter(currentValue => !currentValue.includes('choice'))
  let choiceKeys = keys.filter(currentValue => currentValue.includes('choice'))

  for (let i=0; i<questionKeys.length; i++) {
    let qChoiceKeys = choiceKeys.filter(currentValue => currentValue.includes(questionKeys[i]))
    let qChoices = []
    for (let j=0; j<qChoiceKeys.length; j++) {
      qChoices[j] = obj[qChoiceKeys[j]]
    }

    let question = {
      type: 'list',
      name: questionKeys[i],
      message: obj[questionKeys[i]],
      choices: qChoices
    }
    questions.push(question)
  }
  return questions
}

export const readFile = path =>
  new Promise((resolve, reject) => {
    fs.readFile(path, (err, data) => (err ? reject(err) : resolve(data)))
  })

export const writeFile = (path, data) =>
  new Promise((resolve, reject) => {
    fs.writeFile(path, data, err =>
      err ? reject(err) : resolve('File saved successfully')
    )
  })
