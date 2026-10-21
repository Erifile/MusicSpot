const testFormBtn = document.querySelector(".revealTestForm");
const testForm = document.querySelector("#addTestForm");
const questionsCount = document.querySelector('#questionsCount');
const divQuestions = document.getElementById("questions");
const inputs = testForm.querySelectorAll('input[required], textarea[required]');
const submitBtn = testForm.querySelector(".submitTest");
const addQuestion = testForm.querySelector(".addQBtn");
const removeQuestion = testForm.querySelector(".removeQBtn");


// el.createElement('div') еще НЕ СОЗДАЛО его 
// на страничке - он хранится в ОЗУ. поэтому document.querySelector 
// его не найдёт.
//для создания требуется appendChild


// Количество вопросов, вывод самих вопросов


testFormBtn.addEventListener('click', function ()
{
    testForm.style.display = (testForm.style.display === "none") ? "flex" : "none";
})

removeQuestion.disabled = true;
let q = 0; // итератор Вопроса
let a = 0; // итератор Ответа


addQuestion.addEventListener('click', function () 
{
    questionsCount.value++
    
    questionsCount.value == 15 ? addQuestion.disabled = true : addQuestion.disabled = false;
    questionsCount.value == 0 ? removeQuestion.disabled = true : removeQuestion.disabled = false;
    appendQuestion();
})

removeQuestion.addEventListener('click', function ()
{
    questionsCount.value--;

    questionsCount.value == 0 ? removeQuestion.disabled = true : removeQuestion.disabled = false;
    questionsCount.value == 15 ? addQuestion.disabled = true : addQuestion.disabled = false;

    deleteQuestion();
})


function appendQuestion()
{
    q = questionsCount.value;
 
    //Создание Осн. дива Вопроса + дива Ответов
            let question = document.createElement('div');

            let questionText = document.createElement('textarea');
            // -1 НАДФ ЫА)ЫЩЛ
            questionText.name = `questions[${q - 1}]`;
            questionText.placeholder = "Вопрос " + q + "..";
            questionText.required = true;
            //questionText.classList.add("questionText" + i);

            let answers = document.createElement('div');
            answers.classList.add(`answers`);
        //
        
            // ответы (3 на 1 вопрос + объяснение)
            for (let j = 0; j < 3; j++)
            {
                    let answer = document.createElement('div');
                    answer.classList.add("answer");
                    let answerText = document.createElement("textarea");
                    //Итерация ответов
                    // name КАК МАССИВ для $_POST
                    answerText.name = `answers[${q - 1}][${j}]`;
                    answerText.placeholder = "Ответ " + (j + 1) + "..";
                    answerText.required = true;
                    answers.appendChild(answer);
                    answer.appendChild(answerText);

                    // создание isCorrect для Ответа
                    let isCorrect = document.createElement('input');
                    isCorrect.type = 'radio';

                    //Итерация радиокнопок
                    // name КАК МАССИВ для $_POST.т.е. мы массив задаем прям в HTML вёрстке.
                    isCorrect.name = `isCorrect[${q - 1}]`;
                    isCorrect.value = j;
                    
                    answer.appendChild(isCorrect);

                    let explanation = document.createElement('textarea');
                    explanation.classList.add("explanation");
                    explanation.placeholder = "Объяснение.."
                    //Итерация объяснений (двумерная, т.к 1 объяснение к 1 ответу)
                    explanation.name = `explanations[${q - 1}][${j}]`;
                    answer.appendChild(explanation);
            }
            question.classList.add("question" + q);
            divQuestions.appendChild(question);
            question.appendChild(questionText);
            question.appendChild(answers);
}
function deleteQuestion()
{
    // обращение к кол-ву вопросов в input number ПОСЛЕ его уменьшения
    // преобр значение из инпут-поля в число, чтобы + 1 складывалось.
    //+1, чтоб найти последний доб. вопрос, т.к. обращаемся после уменьшения значения в eventListenere кнопки
    q = Number(questionsCount.value) + 1;
    console.log(q);
    let lastQuestion = testForm.querySelector(`.question${q}`);

    lastQuestion.remove();
}

// eventListener для радио-кнопок ко всей страничке
// (т.к. кнопки неизвестно когда появляются);
document.addEventListener('DOMContentLoaded', () => {
    // Вешаем событие на весь документ или на контейнер, в котором появляются ответы
    document.addEventListener('change', function (event) {
        // Проверяем, что кликнули именно по радиокнопке
        if (event.target.matches('input[type="radio"]')) {
            let btn = event.target;

            let answersDiv = btn.closest('.answers'); // возвщарает ТОЛЬКО родителя
            currentAnswers = answersDiv.querySelectorAll(".answer");

            currentAnswers.forEach(el => {
                el.classList.remove("correct");
            }); 

            

            // Ищем родителя и добавляем класс
            let correctAnswer = btn.closest('.answer');
            if (correctAnswer) {
                
                correctAnswer.classList.add("correct");
            }
        }
    });
});







// Ctrl + /

//  inputs.forEach(input => {
//     if (input.value.trim() == "")
//         {
//             submitBtn.disabled = true;
//         }
//     if (input.value.trim() !== "")
//         {
//             submitBtn.disabled = false;
//         }
// });
















// questionsCount.addEventListener('input', function () // анонимная функция
// {
//     if (this.value > 15) this.value = 15;



//     //очистка перед циклом
//     divQuestions.innerHTML = '';


//     // создание дивов всех характеристик вопроса в зависимости от введённого числа
//     for (let i = 1; i <= this.value; i++)
//         {

        
//         // Создание Осн. дива Вопроса + дива Ответов
//             let question = document.createElement('div');

//             let questionText = document.createElement('textarea');
        
//             questionText.name = `questions[${i}]`;
//             questionText.placeholder = "Вопрос " + i + "..";
//             questionText.required = true;
//             //questionText.classList.add("questionText" + i);

//             let answers = document.createElement('div');
//             answers.classList.add(`answers`);
//         //
        
//             // ответы (3 на 1 вопрос)
//             for (let j = 0; j < 3; j++)
//                 {
//                     let answer = document.createElement('div');
//                     answer.classList.add("answer");
//                     let answerText = document.createElement("textarea");

//                     // name КАК МАССИВ для $_POST
//                     answerText.name = `answers[${i}][${j}]`;
//                     answerText.placeholder = "Ответ " + (j + 1) + "..";
//                     answerText.required = true;
//                     answers.appendChild(answer);
//                     answer.appendChild(answerText);

//                     // создание isCorrect для Ответа
//                     let isCorrect = document.createElement('input');
//                     isCorrect.type = 'radio';

//                     // name КАК МАССИВ для $_POST
//                     isCorrect.name = `isCorrect[${i}]`;
//                     isCorrect.value = j;
                    
//                     answer.appendChild(isCorrect);


//                 }
                
//             question.classList.add("question" + i);
//             divQuestions.appendChild(question);
//             question.appendChild(questionText);
//             question.appendChild(answers);
//         }
    
// })











//for (let a = 1; a <= 3; a++)
              //  {
               //     let isCorrect = document.createElement('input');
               //     isCorrect.type = 'radio';
               //     isCorrect.name = "isCorrect" + i; // name кнопко привязан к итератору ВОПРОСА
               //     answers.appendChild(isCorrect);
               //     // нахождение нужного дива ОТВЕТА
                //    //let necessaryAnswer = document.querySelector(".answer" + i + a);
                //    //necessaryAnswer.appendChild(isCorrect);
                //}