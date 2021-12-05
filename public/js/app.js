const form = document.getElementById('form')
const inputPath = document.getElementById('input-path')
const outputPath = document.getElementById('output-path')
const files = document.getElementById('files')
const reset = document.getElementById('reset')
const popUp = document.querySelector('.pop-up')

form.addEventListener('submit', (event) => {
  event.preventDefault()
  let data = {}
  data.inputPath = inputPath.value
  data.outputPath = outputPath.value
  let fileNames = []
  for (let i = 0; i < files.files.length; i++)
    fileNames.push(files.files[i].name.slice(0, files.files[i].name.length - 4))
  data.files = fileNames
  post('http://localhost:4390', JSON.stringify(data))
  .then((res) => {
    popUp.innerText = res
    popUp.style.display = 'block'
    setTimeout(() => {
      popUp.style.display = 'none'
    }, 3000)
  })
  .catch((err) => {
    popUp.innerText = 'Ошибка: ' + err
    popUp.style.display = 'block'
    setTimeout(() => {
      popUp.style.display = 'none'
    }, 5000)
  })
})
reset.addEventListener('click', (event) => {
  event.preventDefault()
  inputPath.value = ''
  files.value = ''
  outputPath.value = ''
})

function post(url, requestuestBody) {
  return new Promise(function(succeed, fail) {
    var request = new XMLHttpRequest()
    request.open("POST", url, true)
    request.setRequestHeader('Content-Type', 'application/json; charset=utf-8')
    request.addEventListener("load", function() {
      if (request.status < 400)
        succeed(request.responseText)
      else
        fail(new Error("Request failed: " + request.statusText))
    })
    request.addEventListener("error", function() {
      fail(new Error("Network error"))
    })
    request.send(requestuestBody)
  })
}