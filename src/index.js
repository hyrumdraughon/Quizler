import vorpal from 'vorpal'
import { prompt } from 'inquirer'

import {
  readFile,
  writeFile,
  chooseRandom,
  createPrompt,
  createQuestions,
  makeNewQuestions
} from './lib'

const cli = vorpal()

const askForQuestions = [
  {
    type: 'input',
    name: 'numQuestions',
    message: 'How many questions do you want in your quiz?',
    validate: input => {
      const pass = input.match(/^[1-9]{1}$|^[1-9]{1}[0-9]{1}$|^100$/)
      return pass ? true : 'Please enter a valid number!'
    }
  },
  {
    type: 'input',
    name: 'numChoices',
    message: 'How many choices should each question have?',
    validate: input => {
      const pass = input.match(/^(?:[2-4]|0[2-4]|4)$/)
      return pass ? true : 'Please enter a valid number!'
    }
  }
]

const createQuiz = title => 
  prompt(askForQuestions)
    .then(answer => createPrompt(answer))
    .then(promptArray => prompt(promptArray))
    .then(response => createQuestions(response))
    .then(quiz => writeFile('Quizzes/' + title + '.json', JSON.stringify(quiz)))
    .catch(err => console.log('Error creating the quiz.', err))

const takeQuiz = (title, output) => 
  readFile('Quizzes/' + title + '.json')
    .then(quiz => prompt(JSON.parse(quiz)))
    .then(answers => writeFile('QuizResponses/' + output + '.json', JSON.stringify(answers)))
    .catch(err => console.log('Error taking the quiz.', err))

const takeRandomQuiz = (quizzes, output, n) => 
  Promise.all(quizzes.map(curr => readFile('Quizzes/' + curr + '.json')))
    .then(buffers => buffers.map(buf => JSON.parse(buf)))
    .then(quizzesArray => quizzesArray.flat())
    .then(questionsArray => chooseRandom(questionsArray, n))
    .then(oldRandQs => makeNewQuestions(oldRandQs))
    .then(renamedQs => JSON.parse(JSON.stringify(renamedQs)))
    .then(randomQuestions => prompt(randomQuestions))
    .then(answers => writeFile('QuizResponses/' + output + '.json', JSON.stringify(answers)))
    .catch(err => console.log('Error taking a random quiz.', err))

cli
  .command(
    'create <fileName>',
    'Creates a new quiz and saves it to the given fileName'
  )
  .action(function (input, callback) {
    return createQuiz(input.fileName)
  })

cli
  .command(
    'take <fileName> <outputFile>',
    'Loads a quiz and saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    // TODO implement functionality for taking a quiz
    return takeQuiz(input.fileName, input.outputFile)
  })

cli
  .command(
    'random <outputFile> <fileNames...>',
    'Loads a quiz or' +
      ' multiple quizes and selects a random number of questions from each quiz.' +
      ' Then, saves the users answers to the given outputFile'
  )
  .action(function (input, callback) {
    // TODO implement the functionality for taking a random quiz
    return takeRandomQuiz(input.fileNames, input.outputFile, Math.floor(Math.random() * 11))
  })

cli.delimiter(cli.chalk['yellow']('quizler>')).show()
