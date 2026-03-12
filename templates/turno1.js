import { $, setReport, getTurno, getHoje, getAlertasN1 } from "../js/script.js"

export function gerarTurnoN1Solar() {
    if (!$("turno-n1")) return

    const turno = getTurno("turno-n1")
    const hoje = getHoje()
    const resumo = $("resumo-n1-solar").value.trim() || "Não houve incidente."
    const caixa = $("n1-caixa").value || "*"
    const prospect = $("n1-prospect").value || "*"
    const base = $("n1-base").value || "*"
    const pme = $("n1-pme").value || "*"
    const alertas = getAlertasN1()

    setReport(`Passagem de Turno N1 (${turno}) - ${hoje}


*✅ Atividades Realizadas:*

Tratamento de chamados do SOLAR, monitoração dos Alertas e OM.


*📌 Resumo do turno:*

${resumo}


*❗ Pendências:*

Caixa do N1: Total *Aguardando Suporte - ${caixa}* chamados;
*${prospect}* ordens do *Prospect* pendentes de associação;
*${base}* ordens do *Base* pendentes de associação;
*${pme}* ordens do *PME* pendentes de associação.


*⚠️ Alertas durante o turno:*

${alertas}`)
}