const calendar = document.getElementById("calendar");


// =========================
// MESES
// =========================

const monthTitle =
    document.getElementById("monthTitle");

const prevMonth =
    document.getElementById("prevMonth");

const nextMonth =
    document.getElementById("nextMonth");


let currentMonth = 0;

let currentYear = 2026;


const meses = [

    "Janeiro",
    "Fevereiro",
    "Março",
    "Abril",
    "Maio",
    "Junho",

    "Julho",
    "Agosto",
    "Setembro",
    "Outubro",
    "Novembro",
    "Dezembro"

];




// =========================
// VETERINÁRIOS
// =========================

let veterinarios = [

    "Dr. Ana",
    "Dr. João"

];




// =========================
// MODAL VETERINÁRIOS
// =========================

const modal =
    document.getElementById("modal");

const manageBtn =
    document.getElementById("manageBtn");

const closeModal =
    document.getElementById("closeModal");

const addVetBtn =
    document.getElementById("addVetBtn");

const vetInput =
    document.getElementById("vetInput");

const vetList =
    document.getElementById("vetList");



manageBtn.onclick = ()=>{

    modal.classList.remove("hidden");

    renderVetList();

};



closeModal.onclick = ()=>{

    modal.classList.add("hidden");

};



addVetBtn.onclick = ()=>{

    const nome =
        vetInput.value.trim();


    if(!nome){
        return;
    }


    veterinarios.push(nome);


    vetInput.value = "";


    renderVetList();

};



function renderVetList(){

    vetList.innerHTML = "";


    veterinarios.forEach((nome,index)=>{

        const item =
            document.createElement("div");


        item.classList.add("vet-item");


        item.innerHTML = `

            <span>${nome}</span>

            <div>

                <button
                    onclick="editarVet(${index})">

                    ✏️

                </button>


                <button
                    onclick="removerVet(${index})">

                    ❌

                </button>

            </div>

        `;


        vetList.appendChild(item);

    });

}



function removerVet(index){

    veterinarios.splice(index,1);

    renderVetList();

}



function editarVet(index){

    const novoNome = prompt(
        "Novo nome:",
        veterinarios[index]
    );


    if(!novoNome){
        return;
    }


    veterinarios[index] =
        novoNome;


    renderVetList();

}




// =========================
// MODAL PLANTÃO
// =========================

const plantaoModal =
    document.getElementById("plantaoModal");

const vetSelect =
    document.getElementById("vetSelect");

const savePlantaoBtn =
    document.getElementById("savePlantaoBtn");

const closePlantaoModal =
    document.getElementById("closePlantaoModal");


let diaSelecionado = null;

let plantaoSelecionado = null;



function editarDia(data, plantao){

    diaSelecionado = data;

    plantaoSelecionado = plantao;


    vetSelect.innerHTML = "";


    veterinarios.forEach(nome=>{

        const option =
            document.createElement("option");


        option.value = nome;

        option.textContent = nome;


        if(plantao?.veterinario === nome){

            option.selected = true;

        }


        vetSelect.appendChild(option);

    });


    plantaoModal
        .classList
        .remove("hidden");

}



closePlantaoModal.onclick = ()=>{

    plantaoModal
        .classList
        .add("hidden");

};



savePlantaoBtn.onclick = async ()=>{

    const veterinario =
        vetSelect.value;


    if(plantaoSelecionado){

        await fetch(

            `/plantoes/${plantaoSelecionado.id}`,

            {

                method:"PUT",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({
                    veterinario
                })

            }

        );

    }

    else{

        await fetch(

            "/plantoes",

            {

                method:"POST",

                headers:{
                    "Content-Type":"application/json"
                },

                body: JSON.stringify({

                    data:diaSelecionado,

                    veterinario

                })

            }

        );

    }


    plantaoModal
        .classList
        .add("hidden");


    carregarPlantoes();

};




// =========================
// NAVEGAÇÃO MÊS
// =========================

prevMonth.onclick = ()=>{

    currentMonth--;


    if(currentMonth < 0){

        currentMonth = 11;

        currentYear--;

    }


    carregarPlantoes();

};



nextMonth.onclick = ()=>{

    currentMonth++;


    if(currentMonth > 11){

        currentMonth = 0;

        currentYear++;

    }


    carregarPlantoes();

};




// =========================
// CALENDÁRIO
// =========================

async function carregarPlantoes(){

    const resposta =
        await fetch("/plantoes");


    const plantoes =
        await resposta.json();


    calendar.innerHTML = "";


    monthTitle.textContent =

        `${meses[currentMonth]} ${currentYear}`;



    const primeiroDia =

        new Date(
            currentYear,
            currentMonth,
            1
        ).getDay();



    const diasNoMes =

        new Date(
            currentYear,
            currentMonth + 1,
            0
        ).getDate();




    for(let i = 0; i < primeiroDia; i++){

        const vazio =
            document.createElement("div");


        calendar.appendChild(vazio);

    }




    for(let dia = 1; dia <= diasNoMes; dia++){

        const box =
            document.createElement("div");


        box.classList.add("day");



        const data =

            `${currentYear}-${
                String(currentMonth + 1)
                    .padStart(2,"0")
            }-${
                String(dia)
                    .padStart(2,"0")
            }`;



        const plantao =

            plantoes.find(
                p => p.data === data
            );



        box.innerHTML = `

            <strong>${dia}</strong>

            <p>
                ${
                    plantao ?
                    plantao.veterinario :
                    "Vago"
                }
            </p>

        `;



        box.onclick = ()=>{

            editarDia(
                data,
                plantao
            );

        };


        calendar.appendChild(box);

    }

}



carregarPlantoes();