const corpoTransacao = document.querySelector("#corpo-transacao");
const botaoNovaTrasancao = document.querySelector("#nova-transacao");
const confirmarNovaTrasancao = document.querySelector("#confirmar-transacao");
const closeNovaTransacao = document.querySelector(".close-modal");

const removeTransacao = document.getElementsByClassName("fa-trash-alt");


var numeroTransacoes = 0;
var objetoTransacoes = [];

if(localStorage["transacoes"]){
    objetoTransacoes = JSON.parse(localStorage["transacoes"]);

    for(let i=0; i<objetoTransacoes.length; i++){
        let html = "<tr id="+objetoTransacoes[i].id+"><td>"+objetoTransacoes[i].descricao+"</td>";
        if(objetoTransacoes[i].valor > 0){
            html += "<td class='positivo'>";
        }else{
            html += "<td class='negativo'>";
        }
        html += "R$ "+objetoTransacoes[i].valor+"</td><td>"+objetoTransacoes[i].data+"</td><td><i class='far fa-trash-alt'></i></td></tr>";
        corpoTransacao.innerHTML += html;   
    }
    numeroTransacoes = objetoTransacoes.length;
    calcular();
    listarTransacoesRemove();
}
function guardarLocalStorage(){
    localStorage.setItem("transacoes", JSON.stringify(objetoTransacoes));
}
function formataObjeto(id, descricao, valor, data){
    let obj = {
        "id": id,
        "descricao": descricao,
        "valor": valor,
        "data": data
    };
    return obj;
}
function listarTransacoesRemove(){
    for(let i = 0; i<removeTransacao.length; i++){
        removeTransacao[i].addEventListener("click", function(){
            let id = this.parentNode.parentNode.id;
            let posicao;
            for(let i=0; i<objetoTransacoes.length; i++){
                if(objetoTransacoes[i].id == id){
                    posicao = i;
                    break;
                }
            }
            corpoTransacao.removeChild(this.parentNode.parentNode);
            objetoTransacoes.splice(posicao, 1);
            calcular();
            guardarLocalStorage()
        });
    }
}

function calcular(){
    let resultado = 0;
    let valorP = 0;
    let valorN = 0;

    for(let i=0; i<objetoTransacoes.length; i++){
        if(objetoTransacoes[i].valor > 0){
            valorP += objetoTransacoes[i].valor;
        }else{
            valorN += objetoTransacoes[i].valor;
        }
    }

    resultado = valorN+valorP;

    document.querySelector("#saldo-entradas").innerText = "R$ "+(valorP.toFixed(2));
    document.querySelector("#saldo-saidas").innerText = "R$ "+(valorN.toFixed(2));
    document.querySelector("#saldo-total").innerText = "R$ "+(resultado.toFixed(2));
}

function mortrarModal(){
    document.querySelector(".modal").style.display = "flex";
    let inputs = document.querySelectorAll(".modal input[type='text']");
    for(let i=0; i<inputs.length; i++){
        inputs[i].value = "";
    }
    document.querySelector("main").style.filter = "blur(5px)";
}
botaoNovaTrasancao.addEventListener("click", mortrarModal);

confirmarNovaTrasancao.addEventListener("click", function(){
    document.querySelector(".modal").style.display = "none";
    document.querySelector("main").style.filter = "";
    let descricao = document.querySelector("#descricao-transacao").value;
    let valor = parseInt(document.querySelector("#valor-transacao").value);
    let data = document.querySelector("#data-transacao").value;
    if(descricao != "" && valor != "" && data != ""){
        let html = "<tr id="+numeroTransacoes+"><td>"+descricao+"</td>";
        if(valor > 0){
            html += "<td class='positivo'>";
        }else{
            html += "<td class='negativo'>";
        }
        html += "R$ "+valor+"</td><td>"+data+"</td><td><i class='far fa-trash-alt'></i></td></tr>";
        corpoTransacao.innerHTML += html;

        objetoTransacoes.push(formataObjeto(numeroTransacoes, descricao, valor, data));
        listarTransacoesRemove();
        calcular();
        guardarLocalStorage()
        numeroTransacoes++;
    }else{
        document.querySelector(".modal").style.display = "flex";
        document.querySelector(".some-mensagem").style.display = "none";
        document.querySelector(".mensagem").style.display = "flex";
        setTimeout(function(){
            document.querySelector(".mensagem").style.display = "none";
            document.querySelector(".modal").style.display = "none";
            document.querySelector(".some-mensagem").style.display = "block";
        }, 1500);
    }
});

closeNovaTransacao.addEventListener("click", function(){
    document.querySelector(".modal").style.display = "none";
    document.querySelector("main").style.filter = "";
});

