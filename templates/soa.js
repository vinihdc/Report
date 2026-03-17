import { $, setReport } from "../js/script.js"

export function gerarSoa() {
    if (!$("cs-acao")) return

    const acao = $("cs-acao").value.trim() || "*"
    const apiProxy = $("cs-apiproxy").value.trim() || "*"
    const resumoErro = $("cs-resumo").value.trim() || "*"

    setReport(
        `Chamado para SOA

Caros,

Estamos enfrentando um problema recorrente ao tentar ${acao} por meio da API ${apiProxy}. A API está retornando ${resumoErro}.

Solicitamos, por gentileza, apoio na análise para verificarem se esse erro está relacionado a alguma regra de negócio vigente, se trata de um problema ainda não mapeado ou se há algum PPM previsto para correção.

Estou anexando o JSON com o log da requisição.

Caso precisem de mais exemplos para análise, fico à disposição.

Atenciosamente,
MOps Solar`)
}