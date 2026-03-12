import { $, setReport, formatarData, getTextoSelect } from "../js/script.js"

export function gerarCoti() {
    if (!$("chamado")) return

    let causa = $("causa").value.trim() || "Em análise"
    let acao = $("acao").value.trim() || "Em análise"

    const fim = $("fim").value ? formatarData($("fim").value) : "''"

    setReport(`*MOPs ☀️ - COTI INC-${$("chamado").value}*

*Início do Problema:* ${formatarData($("inicio").value)} | HF: ${fim}

*STATUS:*
* ${getTextoSelect("status")}*

*Jornada:* ${getTextoSelect("jornada")}
*Funcionalidade:* ${$("funcionalidade").value}
*Qual o Impacto?:* ${getTextoSelect("impacto")}

*Resumo:* ${$("resumo").value}

*FATO:* ${$("fato").value}
*CAUSA:* ${causa}
*AÇÃO:* ${acao}

*RESPONSÁVEL PELA ANÁLISE: [MOPS]*

*📍 Status Report:* ${$("statusReport").value}
`)
}