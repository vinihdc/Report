import { $, setReport, vals } from "../js/utils.js"

export function gerarPosPago() {
    if (!$("ca-acao")) return

    const {
        "ca-acao":       acao,
        "ca-appname":    appName,
        "ca-resumo":     resumo,
        "ca-codigo":     codigo,
        "ca-errorcode":  eCode,
        "ca-mensagem":   msg,
        "ca-ban":        ban,
        "ca-contrato":   contrato,
    } = vals("ca-acao", "ca-appname", "ca-resumo", "ca-codigo", "ca-errorcode", "ca-mensagem", "ca-ban", "ca-contrato")

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