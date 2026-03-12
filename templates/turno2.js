import { $, setReport, getTurno, getHoje, getFallout } from "../js/script.js"

export function gerarTurno() {
    if (!$("turno")) return

    const turno  = getTurno("turno")
    const hoje   = getHoje()
    const resumo = $("resumo-turno").value.trim() || "Não tivemos nenhum incidente pendente durante o turno, seguimos com o tratamento das tarefas."

    const { prospect, base, pme } = getFallout("n2")

    const qtd      = $("qtd-chamados").value || "*"
    const dataVenc = $("data-venc").value
        ? new Date($("data-venc").value + "T00:00").toLocaleDateString("pt-BR")
        : "*"
    const sla      = $("sla-horario").value || "*"
    const fila     = $("cnt-fila").value         || "*"
    const atend    = $("cnt-atendimento").value   || "*"
    const externo  = $("cnt-externo").value       || "*"
    const reaberto = $("cnt-reaberto").value      || "*"

    setReport(`*📄 Passagem de Turno N2 Solar (${turno}) – ${hoje}*
 
*✅ Atividades Realizadas*
* Tratamento dos chamados Solar;
* Tratamento do OM;
* Atendimento COTI.
 
*📌 Resumo do Turno*
* ${resumo}
 
📊 Indicadores FallOut:
 Prospect: *${prospect}%*
 Base: *${base}%*
 PME: *${pme}%*
 
⚠️ Pendências
* *${qtd}* Chamados com vencimento para *${dataVenc}* - SLA *${sla}*.
 
🚨 Priorizados
* *${fila}* Em fila;
* *${atend}* Em atendimento;
* *${externo}* Aguardando retorno externo;
* *${reaberto}* Reaberto.`)
}