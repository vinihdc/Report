import { $, setReport, formatarData, getTextoSelect } from "../js/utils.js"

export function gerarFca() {
    if (!$("fca-titulo")) return

    const hi = $("fca-hi").value ? formatarData($("fca-hi").value) : "''"
    const hf = $("fca-hf").value ? formatarData($("fca-hf").value) : ""
    const hfLinha = hf ? `*DATA - HF:* ${hf}` : `*DATA - HF:* `

    // Ambientes — cada item vira uma linha
    const ambienteItems = document.querySelectorAll(".fca-ambiente-item")
    const ambientes = Array.from(ambienteItems)
        .map(item => item.querySelector(".fca-ambiente-texto").value.trim())
        .filter(Boolean)
        .join(" / ")

    // Ações — cada uma vira uma linha "*AÇÃO:* ..."
    const acaoItems = document.querySelectorAll(".fca-acao-item")
    const acoes = Array.from(acaoItems)
        .map(item => item.querySelector(".fca-acao-texto").value.trim())
        .filter(Boolean)
        .map(acao => `*AÇÃO:* ${acao}`)
        .join("\n\n")

    // Volumetria
    const temVolumetria = $("fca-tem-volumetria")?.checked
    const volumetria = temVolumetria ? $("fca-volumetria").value.trim() || "*" : null
    const linhaVolumetria = volumetria ? `\n*VOLUMETRIA:* ${volumetria}\n` : ""

    // Incidente
    const temIncidente = $("fca-tem-incidente")?.checked
    const incidente = temIncidente ? $("fca-incidente").value.trim() || "*" : null
    const linhaIncidente = incidente ? `\n*INCIDENTE:* ${incidente}\n` : ""

    // Responsáveis — cada item vira uma entrada
    const responsavelItems = document.querySelectorAll(".fca-responsavel-item")
    const responsaveis = Array.from(responsavelItems)
        .map(item => item.querySelector(".fca-responsavel-texto").value.trim())
        .filter(Boolean)
        .join(" / ")

    setReport(`*[MOPS - TV DO FUTURO - ${$("fca-titulo").value.trim().toUpperCase()}]*


*DATA - HI:* ${hi}
${hfLinha}


*AMBIENTES AFETADOS* - [${ambientes || "*"}]


*FATO:* ${$("fca-fato").value.trim() || "*"}


*CAUSA:* ${$("fca-causa").value.trim() || "*"}


${acoes || "*AÇÃO:* *"}

*IMPACTO PARA O CLIENTE:* ${$("fca-impacto").value.trim() || "*"}
${linhaVolumetria}
${linhaIncidente}
*STATUS:* ${getTextoSelect("fca-status")}
 
*RESPONSÁVEL PELA ANÁLISE:* ${responsaveis || "*"}`)
}