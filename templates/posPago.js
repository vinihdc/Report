import { $, setReport } from "../js/script.js"

export function gerarPosPago() {
    if (!$("ca-acao")) return

    const acao = $("ca-acao").value.trim() || "*"
    const appName = $("ca-appname").value.trim() || "*"
    const resumo = $("ca-resumo").value.trim() || "*"
    const codigo = $("ca-codigo").value.trim() || "*"
    const eCode = $("ca-errorcode").value.trim() || "*"
    const msg = $("ca-mensagem").value.trim() || "*"
    const ban = $("ca-ban").value.trim() || "*"
    const contrato = $("ca-contrato").value.trim() || "*"

    setReport(
        `Caros,

Identificamos um problema ao tentar ${acao}. Em análise verificamos que a API ${appName} está retornando ${resumo}. O erro retornado é um ${codigo}, com o errorCode ${eCode}. A mensagem que o sistema retorna é: "${msg}".

Solicitamos, por gentileza, apoio na análise para verificarem se esse erro está relacionado a alguma regra de negócio vigente, se trata de um problema ainda não mapeado ou se há alguma DFT prevista para correção.

Estou anexando o JSON com o log da requisição.

Número do cliente: ${ban}
Número do contrato: ${contrato}

Atenciosamente,
MOPs SOLAR`)
}