import { $, setReport, formatarData, getTextoSelect, getSalaLink } from "../js/utils.js"

export function gerarCoti() {
    if (!$("chamado")) return

    let causa = $("causa").value.trim() || "Em análise"
    let conclusao = $("acao").value.trim() || "Em análise"

    const fim = $("fim").value ? formatarData($("fim").value) : "''"
    const salaLink = getSalaLink("tem-sala", "sala-link")
    const linhasSala = salaLink ? `\n*Link da sala:* ${salaLink}\n` : ""

    setReport(`*MOPs ☀️ - COTI INC-${$("chamado").value}*
*Período:* ${formatarData($("inicio").value)} – ${fim}
*Status :* ${getTextoSelect("status")}
${linhasSala}
*Resumo:*
- ${$("resumo").value}
- *Causa:* ${causa}

- *Conclusão:* ${conclusao}
`)
}